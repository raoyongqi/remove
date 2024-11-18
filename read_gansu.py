import pandas as pd
import matplotlib.pyplot as plt
import matplotlib

# 设置中文显示
matplotlib.rcParams['font.sans-serif'] = ['SimHei']  # 或者 ['Microsoft YaHei']
matplotlib.rcParams['axes.unicode_minus'] = False  # 用来正常显示负号

# 构建数据
data = {
    'Year': [2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020],
    'Barrenland': [0.4924, 0.5306, 0.5223, 0.4858, 0.4995, 0.4877, 0.4909, 0.4692, 0.5052, 0.5239, 0.5207, 0.4896, 0.5103, 0.4882, 0.5267, 0.5009, 0.4840, 0.4512, 0.4898, 0.4728],
    'Cropland': [0.4401, 0.4537, 0.4414, 0.4657, 0.4510, 0.4436, 0.4400, 0.4308, 0.4510, 0.4522, 0.4212, 0.4674, 0.4870, 0.4674, 0.4661, 0.4675, 0.4506, 0.4683, 0.4696, 0.4773],
    'Grassland': [0.4185, 0.4382, 0.4551, 0.4384, 0.4347, 0.4054, 0.4344, 0.4245, 0.4599, 0.4783, 0.4311, 0.4515, 0.4828, 0.4674, 0.4840, 0.4802, 0.4295, 0.4371, 0.4793, 0.4590],
    'Woody savannas': [0.5771, 0.6046, 0.5337, 0.6367, 0.5824, 0.6060, 0.6109, 0.5347, 0.5797, 0.6419, 0.5667, 0.5897, 0.6492, 0.5522, 0.5863, 0.6166, 0.5607, 0.5593, 0.5780, 0.5429]
}

# 转换为DataFrame
df = pd.DataFrame(data)

# 计算每条曲线的平均植被覆盖度
mean_barrenland = df['Barrenland'].mean()
mean_cropland = df['Cropland'].mean()
mean_grassland = df['Grassland'].mean()
mean_woody_savannas = df['Woody savannas'].mean()

# 将这些平均值与相应的标签绑定，并按平均值从高到低排序
coverages = {
    '荒地': mean_barrenland,
    '耕地': mean_cropland,
    '草地': mean_grassland,
    '木本稀树草原': mean_woody_savannas
}

sorted_coverages = sorted(coverages.items(), key=lambda x: x[1], reverse=True)

# 根据排序后的顺序重新绘制图表
plt.figure(figsize=(10, 6))

# 使用排序后的顺序绘制曲线
for label, _ in sorted_coverages:
    plt.plot(df['Year'], df[label], label=label, marker='o')

# 设置标题和标签
plt.title('内蒙古自治区不同土地类型的植被覆盖度随年份变化', fontsize=14)
plt.xlabel('年份', fontsize=12)
plt.ylabel('植被覆盖度', fontsize=12)

# 显示网格
plt.grid(True)

# 创建排序后的图例
sorted_labels = [label for label, _ in sorted_coverages]
plt.legend(title='土地类型', loc='center left', bbox_to_anchor=(1, 0.5), labels=sorted_labels)

# 显示图表
plt.tight_layout()
plt.savefig('neimeng_ci_sorted.png')  # 保存图表
plt.show()
