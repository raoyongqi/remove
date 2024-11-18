// 定义研究区域（甘肃省的一个部分）

var shapefile = ee.FeatureCollection('projects/fluid-cosmos-435610-a6/assets/gansu');

// 加载 MODIS 土地覆盖数据（2020年）
var landCover = ee.Image('MODIS/006/MCD12Q1/2020_01_01');
var landCoverClass = landCover.select('LC_Type1');

// 创建水体和永久冰雪的掩膜
var waterMask = landCoverClass.eq(17);  // 水体类别的值是 17
var iceMask = landCoverClass.eq(15);    // 永久冰雪类别的值是 15

// 合并水体和冰雪的掩膜（水体 OR 永久冰雪）
var combinedMask = waterMask.or(iceMask);

// 反转掩膜，去除水体和冰雪以外的区域
var landCoverWithoutWaterIce = landCoverClass.updateMask(combinedMask.not());

// 加载 MODIS NDVI 数据（2020年）
var ndviCollection = ee.ImageCollection('MODIS/006/MOD13Q1')
  .filterDate('2000-04-01', '2000-10-31')  // 选择2020年4月到10月的数据
  .select('NDVI');  // 选择 NDVI 波段

// 将 NDVI 数据裁剪到指定区域
var ndviRegion = ndviCollection.map(function(image) {
  return image.clip(shapefile);
});

// 在时间维度上应用掩膜（只保留去除水体和冰雪区域）
var ndviRegionMasked = ndviRegion.map(function(image) {
  return image.updateMask(landCoverWithoutWaterIce);  // 应用掩膜
});

// 计算每个像素的 NDVI 最大值和最小值
var ndviMax = ndviRegionMasked.max(); // 每个像素的最大值
var ndviMin = ndviRegionMasked.min(); // 每个像素的最小值

//// 计算植被覆盖度 Ci
var Ci = ndviRegionMasked.map(function(image) {
  return image.subtract(ndviMin).divide(ndviMax.subtract(ndviMin)).rename('Ci');
});

// 选择草地类别（LC_Type1 为 10）
var grasslandMask = landCoverClass.eq(10);  // 草地的类别是 10

// 只保留草地的植被覆盖度
var CiGrassland = Ci.map(function(image) {
  return image.updateMask(grasslandMask);  // 应用草地掩膜
});

// 可视化草地的植被覆盖度
// Map.addLayer(CiGrassland.mean(), {min: 0, max: 1, palette: ['white', 'green']}, 'Vegetation Coverage (Ci) - Grasslands');
var meanCiGrassland = CiGrassland.mean().reduceRegion({
  reducer: ee.Reducer.mean(),  // 使用均值计算
  geometry: shapefile,  // 计算范围，可以使用你定义的研究区域
  scale: 500,  // 设置合适的分辨率
  maxPixels: 1e8  // 最大像素数，避免计算时过多数据引起的问题
});




// 提取均值结果
var grassCiValue = meanCiGrassland.get('Ci');

// 可以使用 set 给这个结果命名
var grassCiDict = ee.Dictionary({
  'gansu_grassland_ci': grassCiValue
});

// 输出字典到控制台
print('Renamed Mean Vegetation Coverage (Ci) for Grasslands:', meanCiDict);

var barrenMask = landCoverClass.eq(16);  // 荒地的类别是 16

var CiBarrenland = Ci.map(function(image) {
  return image.updateMask(barrenMask);  // 应用草地掩膜
});

var meanCiBarrenland = CiBarrenland.mean().reduceRegion({
  reducer: ee.Reducer.mean(),  // 使用均值计算
  geometry: shapefile,  // 计算范围，可以使用你定义的研究区域
  scale: 500,  // 设置合适的分辨率
  maxPixels: 1e8  // 最大像素数，避免计算时过多数据引起的问题
});

// 提取均值结果
var barrenCiValue = meanCiBarrenland.get('Ci');

// 可以使用 set 给这个结果命名
var barrenCiDict = ee.Dictionary({
  'barren_grassland_ci': barrenCiValue
});
