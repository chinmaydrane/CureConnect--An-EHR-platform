import os, json, math, warnings
from datetime import datetime
warnings.filterwarnings("ignore")

import numpy as np
import pandas as pd

from sklearn.model_selection import train_test_split, RandomizedSearchCV
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import OneHotEncoder

from lightgbm import LGBMRegressor
from xgboost import XGBRegressor
from catboost import CatBoostRegressor
from sklearn.ensemble import ExtraTreesRegressor

import pickle

CSV_PATH = "Personalized_Diet_Recommendations.csv"
MODEL_DIR = "diet_model"

TARGETS = [
    "Recommended_Calories",
    "Recommended_Protein",
    "Recommended_Carbs",
    "Recommended_Fats"
]

def add_features(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()

    # BMI recompute
    if "Height_cm" in df.columns and "Weight_kg" in df.columns:
        h_m = df["Height_cm"] / 100.0
        df["BMI_calc"] = df["Weight_kg"] / (h_m * h_m)

    # Pulse pressure & MAP
    if "Blood_Pressure_Systolic" in df.columns and "Blood_Pressure_Diastolic" in df.columns:
        df["Pulse_Pressure"] = df["Blood_Pressure_Systolic"] - df["Blood_Pressure_Diastolic"]
        df["MAP"] = (2 * df["Blood_Pressure_Diastolic"] + df["Blood_Pressure_Systolic"]) / 3.0

    # Risk flags
    if "Blood_Sugar_Level" in df.columns:
        df["High_Sugar"] = (df["Blood_Sugar_Level"] >= 126).astype(int)

    if "Cholesterol_Level" in df.columns:
        df["High_Cholesterol"] = (df["Cholesterol_Level"] >= 240).astype(int)

    if "Blood_Pressure_Systolic" in df.columns and "Blood_Pressure_Diastolic" in df.columns:
        df["High_BP"] = ((df["Blood_Pressure_Systolic"] >= 140) | (df["Blood_Pressure_Diastolic"] >= 90)).astype(int)

    # Lifestyle index
    if "Daily_Steps" in df.columns and "Exercise_Frequency" in df.columns:
        df["Activity_Index"] = df["Daily_Steps"] * df["Exercise_Frequency"]

    if "Sleep_Hours" in df.columns:
        df["Sleep_Deficit"] = np.maximum(0, 7 - df["Sleep_Hours"])

    return df

def build_preprocessor(X: pd.DataFrame):
    num_cols = [c for c in X.columns if pd.api.types.is_numeric_dtype(X[c])]
    cat_cols = [c for c in X.columns if c not in num_cols]

    preprocessor = ColumnTransformer(
        transformers=[
            ("num", Pipeline(steps=[
                ("imputer", SimpleImputer(strategy="median"))
            ]), num_cols),
            ("cat", Pipeline(steps=[
                ("imputer", SimpleImputer(strategy="most_frequent")),
                ("ohe", OneHotEncoder(handle_unknown="ignore"))
            ]), cat_cols)
        ],
        remainder="drop"
    )
    return preprocessor

def model_candidates():
    return {
        "LightGBM": (
            LGBMRegressor(random_state=42),
            {
                "model__n_estimators": [300, 600, 900],
                "model__learning_rate": [0.01, 0.05, 0.1],
                "model__num_leaves": [31, 63, 127],
                "model__subsample": [0.8, 0.9, 1.0],
                "model__colsample_bytree": [0.8, 0.9, 1.0],
            }
        ),
        "XGBoost": (
            XGBRegressor(
                random_state=42,
                objective="reg:squarederror",
                tree_method="hist",
            ),
            {
                "model__n_estimators": [300, 600, 900],
                "model__learning_rate": [0.01, 0.05, 0.1],
                "model__max_depth": [3, 5, 7],
                "model__subsample": [0.8, 0.9, 1.0],
                "model__colsample_bytree": [0.8, 0.9, 1.0],
            }
        ),
        "CatBoost": (
            CatBoostRegressor(
                random_state=42,
                verbose=0
            ),
            {
                "model__iterations": [300, 600, 900],
                "model__learning_rate": [0.01, 0.05, 0.1],
                "model__depth": [4, 6, 8],
            }
        ),
        "ExtraTrees": (
            ExtraTreesRegressor(random_state=42),
            {
                "model__n_estimators": [300, 600, 900],
                "model__max_depth": [None, 10, 20],
                "model__min_samples_split": [2, 5, 10],
            }
        )
    }

def evaluate(y_true, y_pred):
    mae = mean_absolute_error(y_true, y_pred)
    rmse = math.sqrt(mean_squared_error(y_true, y_pred))
    r2 = r2_score(y_true, y_pred)
    return mae, rmse, r2

def main():
    os.makedirs(MODEL_DIR, exist_ok=True)

    df = pd.read_csv(CSV_PATH)
    df = add_features(df)

    # Drop Patient_ID if exists
    if "Patient_ID" in df.columns:
        df = df.drop(columns=["Patient_ID"])

    # Ensure targets exist
    missing = [t for t in TARGETS if t not in df.columns]
    if missing:
        raise ValueError(f"Missing targets in CSV: {missing}")

    X = df.drop(columns=TARGETS)
    Y = df[TARGETS].copy()

    X_train, X_test, Y_train, Y_test = train_test_split(
        X, Y, test_size=0.2, random_state=42
    )

    preprocessor = build_preprocessor(X_train)

    results = {}
    best_models = {}

    for target in TARGETS:
        print(f"\n========== Target: {target} ==========")

        best_mae = float("inf")
        best_pipe = None
        best_name = None

        for name, (base_model, param_dist) in model_candidates().items():
            pipe = Pipeline(steps=[
                ("preprocess", preprocessor),
                ("model", base_model)
            ])

            search = RandomizedSearchCV(
                pipe,
                param_distributions=param_dist,
                n_iter=15,
                scoring="neg_mean_absolute_error",
                cv=3,
                random_state=42,
                n_jobs=-1,
                verbose=0
            )

            search.fit(X_train, Y_train[target])

            y_pred = search.best_estimator_.predict(X_test)
            mae, rmse, r2 = evaluate(Y_test[target], y_pred)

            print(f"{name:10s} | MAE={mae:.2f} RMSE={rmse:.2f} R2={r2:.3f}")

            if mae < best_mae:
                best_mae = mae
                best_pipe = search.best_estimator_
                best_name = name
                best_params = search.best_params_

        results[target] = {
            "best_model": best_name,
            "best_mae": float(best_mae),
            "best_params": best_params
        }
        best_models[target] = best_pipe

        # Save best pipeline
        with open(os.path.join(MODEL_DIR, f"{target}.pkl"), "wb") as f:
            pickle.dump(best_pipe, f)

        print(f"[SAVED] Best for {target}: {best_name}")

    run_info = {
        "timestamp": datetime.now().isoformat(timespec="seconds"),
        "targets": TARGETS,
        "results": results
    }

    with open(os.path.join(MODEL_DIR, "last_run.json"), "w") as f:
        json.dump(run_info, f, indent=2)

    with open(os.path.join(MODEL_DIR, "train_log.jsonl"), "a") as f:
        f.write(json.dumps(run_info) + "\n")

    print("\n[DONE] Training complete. Best models saved.")

if __name__ == "__main__":
    main()
