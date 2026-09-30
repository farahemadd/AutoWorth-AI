import numpy as np
import pandas as pd

REFERENCE_YEAR = 2021
PREMIUM = {"Audi", "BMW", "Mercedes"}
NUM = ["Year", "Mileage", "EngineSize", "MPG", "Tax",
       "CarAge", "MileagePerYear", "PowerProxy", "IsPremium"]
CAT = ["Make", "Model", "Transmission", "FuelType"]


def add_features(X):
    X = pd.DataFrame(X).copy()
    X["CarAge"] = (REFERENCE_YEAR - X["Year"]).clip(lower=1)
    X["MileagePerYear"] = X["Mileage"] / X["CarAge"]
    X["PowerProxy"] = X["EngineSize"] / X["MPG"].replace(0, np.nan)
    X["IsPremium"] = X["Make"].isin(PREMIUM).astype(int)
    return X[NUM + CAT]
