import pandas as pd
import matplotlib.pyplot as plt

# 读取 CSV 文件
file_path = 'land_cover_data.csv'  # 替换为你的CSV文件路径
df = pd.read_csv(file_path)

# 查看数据
print(df.head())

# 设置图形大小
plt.figure(figsize=(10, 6))

# 绘制不同土地覆盖类型随年份变化的折线图
plt.plot(df['year'], df['Grassland'], label='草地', marker='o', linestyle='-', color='green')
plt.plot(df['year'], df['Mixed forest'], label='混合森林', marker='o', linestyle='-', color='forestgreen')
plt.plot(df['year'], df['Savannas'], label='热带草原', marker='o', linestyle='-', color='orange')
plt.plot(df['year'], df['Woody savannas'], label='木本草原', marker='o', linestyle='-', color='brown')

# 添加标题和标签
plt.title('多年来的土地利用变化')
plt.xlabel('年份')
plt.ylabel('覆盖率')
plt.legend()

# 显示网格
plt.grid(True)

# 展示图表
plt.tight_layout()
plt.show()
