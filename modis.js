// 定义土地覆盖分类标签 (对应 MODIS IGBP 分类)
var classLabels = ee.Dictionary({
    0: 'No Data',
    1: 'Evergreen needleleaf forest',
    2: 'Evergreen broadleaf forest',
    3: 'Deciduous needleleaf forest',
    4: 'Deciduous broadleaf forest',
    5: 'Mixed forest',
    6: 'Closed shrublands',
    7: 'Open shrublands',
    8: 'Woody savannas',
    9: 'Savannas',
    10: 'Grasslands',
    11: 'Permanent wetlands',
    12: 'Croplands',
    13: 'Urban and built-up',
    14: 'Cropland/natural vegetation mosaic',
    15: 'Snow and ice',
    16: 'Barren or sparsely vegetated',
    17: 'Water bodies'
  });
  