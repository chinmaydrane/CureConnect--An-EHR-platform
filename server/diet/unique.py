import pandas as pd

df = pd.read_csv("Personalized_Diet_Recommendations.csv")

print("Unique values in Gender:")
print(df["Gender"].unique(), "\n")

print("Unique values in Dietary_Habits:")
print(df["Dietary_Habits"].unique(), "\n")

print("Unique values in Chronic_Disease:")
print(df["Chronic_Disease"].unique(), "\n")
