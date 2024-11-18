// 定义研究区域（甘肃省的一个部分）
var shapefile = ee.FeatureCollection('projects/fluid-cosmos-435610-a6/assets/neimeng');

// 土地覆盖类型和相应名称
var landCoverTypes = [
  {id: 10, name: 'Grassland'},
  {id: 16, name: 'Barrenland'},
  {id: 12, name: 'Cropland'},
  {id: 8, name: 'Woody savannas'}
];

// 创建一个空的字典，用于存储每一年的结果
var results = [];

// 定义时间范围（例如2001年到2020年）
var startYear = 2001;
var endYear = 2020;

// 加载该年度 MODIS NDVI 数据的函数
var processNDVI = function(year) {
  // 加载该年度 MODIS 土地覆盖数据
  var landCover = ee.Image('MODIS/006/MCD12Q1/' + year + '_01_01');
  var landCoverClass = landCover.select('LC_Type1');
  
  // 创建水体和永久冰雪的掩膜
  var waterMask = landCoverClass.eq(17);  // 水体类别的值是 17
  var iceMask = landCoverClass.eq(15);    // 永久冰雪类别的值是 15
  var combinedMask = waterMask.or(iceMask);  // 水体 OR 永久冰雪
  var landCoverWithoutWaterIce = landCoverClass.updateMask(combinedMask.not());  // 去除水体和冰雪

  // 加载该年度 MODIS NDVI 数据
  var ndviCollection = ee.ImageCollection('MODIS/006/MOD13Q1')
    .filterDate(year + '-04-01', year + '-10-31')  // 选择每年的数据
    .select('NDVI');  // 选择 NDVI 波段

  // 将 NDVI 数据裁剪到指定区域并应用掩膜（只保留去除水体和冰雪区域）
  var ndviRegionMasked = ndviCollection.map(function(image) {
    return image.clip(shapefile).updateMask(landCoverWithoutWaterIce);
  });

  // 计算 NDVI 最大值和最小值
  var ndviMax = ndviRegionMasked.max();
  var ndviMin = ndviRegionMasked.min();

  // 计算植被覆盖度 Ci
  var Ci = ndviRegionMasked.map(function(image) {
    return image.subtract(ndviMin).divide(ndviMax.subtract(ndviMin)).rename('Ci');
  });

  // 创建一个字典，用于存储该年所有土地类型的 Ci 值
  var yearResults = { 'year': year };
  
  // 遍历每个土地类型，计算其平均植被覆盖度（Ci）
  landCoverTypes.forEach(function(landCoverType) {
    var mask = landCoverClass.eq(landCoverType.id);  // 根据土地类型选择掩膜
    var CiLandCover = Ci.map(function(image) {
      return image.updateMask(mask);  // 应用掩膜
    });

    var meanCiLandCover = CiLandCover.mean().reduceRegion({
      reducer: ee.Reducer.mean(),
      geometry: shapefile,
      scale: 500,
      maxPixels: 1e9
    });

    // 获取该土地类型的 Ci 值并存储到字典中
    var ciValue = meanCiLandCover.get('Ci');
    yearResults[landCoverType.name] = ciValue;
  });

  // 将每年的结果添加到总结果数组
  results.push(yearResults);
};

// 遍历每个年份
for (var year = startYear; year <= endYear; year++) {
  processNDVI(year);
}

// 将结果数组转换为表格
var resultTable = ee.FeatureCollection(results.map(function(item) {
  return ee.Feature(null, item);
}));

// 打印结果表格
print('Annual Vegetation Coverage (Ci) for Different Land Covers:', resultTable);

// 如果你需要将数据导出为CSV，可以使用如下代码
Export.table.toDrive({
  collection: resultTable,
  description: 'Annual_neimeng_ci',
    folder: 'Annual_ci',   // 保存到 Google Drive 的文件夹名称
  fileNamePrefix: 'Annual_neimeng_ci',    // 导出的文件前缀
  fileFormat: 'CSV'
});