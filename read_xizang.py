import pandas as pd
import matplotlib.pyplot as plt

# Read the CSV data into a DataFrame
data = pd.read_csv('your_file.csv')  # Replace with your actual CSV file path

# Extract relevant columns
years = data['year']
barrenland = data['Barrenland']
evergreen_broadleaf = data['Evergreen broadleaf forest']
evergreen_needleleaf = data['Evergreen needleleaf forest']
grassland = data['Grassland']

# Create the plot
plt.figure(figsize=(10, 6))

# Plot the data for each vegetation type with Chinese labels
plt.plot(years, barrenland, label='光秃地', marker='o')
plt.plot(years, evergreen_broadleaf, label='常绿阔叶林', marker='o')
plt.plot(years, evergreen_needleleaf, label='常绿针叶林', marker='o')
plt.plot(years, grassland, label='草地', marker='o')

# Adding labels and title
plt.xlabel('年份')
plt.ylabel('植被覆盖度')
plt.title('植被覆盖度随时间变化')

# Display the legend with Chinese labels
plt.legend()

# Display the plot
plt.grid(True)
plt.tight_layout()
plt.show()
