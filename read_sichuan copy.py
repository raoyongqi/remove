import pandas as pd
import matplotlib.pyplot as plt
from matplotlib import font_manager

# 读取 CSV 数据
df = pd.read_csv('Annual_sichuan_ci.csv')

# 设置楷体字体路径（Windows 中通常可以找到 KaiTi.ttf）
import matplotlib
matplotlib.rcParams['font.sans-serif'] = ['SimHei']  # 或者 ['Microsoft YaHei']
matplotlib.rcParams['axes.unicode_minus'] = False  # 用来正常显示负号

# 创建折线图
plt.figure(figsize=(10, 6))

# 绘制每个土地类型的折线
line_grassland, = plt.plot(df['year'], df['Grassland'], label='草地', marker='o')
line_forest, = plt.plot(df['year'], df['Mixed forest'], label='混合森林', marker='o')
line_savannas, = plt.plot(df['year'], df['Savannas'], label='稀树草原', marker='o')
line_Woodysavannas, = plt.plot(df['year'], df['Woody savannas'], label='木本稀树草原', marker='o')

# 按照最后一年的覆盖度排序
labels = ['草地','混合森林', '稀树草原',  '木本稀树草原',]
values = [df['Grassland'].iloc[-1], df['Mixed forest'].iloc[-1], df['Savannas'].iloc[-1],df['Woody savannas'].iloc[-1]]

# 将标签和覆盖度按从高到低排序
sorted_labels_values = sorted(zip(values, [line_grassland, line_forest, line_savannas,line_Woodysavannas], labels), reverse=True)

# 获取排序后的线条和标签
sorted_lines = [line for _, line, _ in sorted_labels_values]
sorted_sorted_labels = [label for _, _, label in sorted_labels_values]

# 创建图例，按照排序后的标签顺序
plt.legend(sorted_lines, sorted_sorted_labels, title='土地类型', loc='center left', bbox_to_anchor=(1, 0.5))

# 添加标题和标签
plt.title('四川省不同土地类型的植被覆盖度', fontsize=16)
plt.xlabel('年份', fontsize=12)
plt.ylabel('植被覆盖度 (Ci)', fontsize=12)

# 显示图表
plt.tight_layout()  # 确保图表不会被切割
plt.savefig('sichuan_ci.png')  # 保存图表
plt.show()  # 显示图表
