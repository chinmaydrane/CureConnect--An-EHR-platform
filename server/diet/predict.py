"""
predict.py
----------
Run this script to use the already-trained models.

What it does:
- Loads preprocess bundle + models from ./diet_model
- Asks user for a FEW stable inputs:
    Age, Height, Weight, Gender, ActivityLevel, Goal, etc.
- Automatically computes BMI (if model has a BMI column)
- Uses imputers to fill the rest
- Prints predicted calories/protein/carbs/fat
"""

import os
import re
import json
import warnings

warnings.filterwarnings("ignore")

import numpy as np
import pandas as pd
import pickle

CSV_PATH = "Personalized_Diet_Recommendations.csv"
MODEL_DIR = "diet_model"


# ===========================
# LOAD MODELS + PREPROCESSORS
# ===========================

def load_preprocessing(model_dir=MODEL_DIR):
    preproc_path = os.path.join(model_dir, "preprocess.pkl")
    if not os.path.exists(preproc_path):
        raise FileNotFoundError(f"Preprocess file not found at {preproc_path}. Run train.py first.")
    with open(preproc_path, "rb") as f:
        preproc = pickle.load(f)
    return preproc


def load_targets(model_dir=MODEL_DIR):
    last_run_path = os.path.join(model_dir, "last_run.json")
    if not os.path.exists(last_run_path):
        raise FileNotFoundError(f"last_run.json not found in {model_dir}. Run train.py first.")
    with open(last_run_path, "r", encoding="utf-8") as f:
        info = json.load(f)
    return info["targets"]


def load_models(targets, model_dir=MODEL_DIR):
    models = {}
    for t in targets:
        safe_name = t.replace(" ", "_")
        path = os.path.join(model_dir, f"{safe_name}.pkl")
        if not os.path.exists(path):
            raise FileNotFoundError(f"Model file not found for target {t}: {path}")
        with open(path, "rb") as f:
            models[t] = pickle.load(f)
    return models


# ===========================
# PREDICT FUNCTION
# ===========================

def predict_requirements(user_dict,
                         models,
                         num_cols,
                         cat_cols,
                         num_imputer,
                         cat_imputer,
                         ohe,
                         X_columns):
    """
    - Computes BMI from Height & Weight (if BMI column exists)
    - Applies same preprocessing as training
    - Returns a dict of predictions per target
    """
    # --- 0) Compute BMI if training had a BMI column ---
    height_key = None
    weight_key = None
    bmi_key    = None

    for c in num_cols:
        lc = c.lower()
        if "height" in lc and ("cm" in lc or "ht" in lc or "height" in lc):
            height_key = c
        if "weight" in lc or "wt" in lc:
            weight_key = c
        if "bmi" in lc:
            bmi_key = c

    if bmi_key and height_key and weight_key:
        h_val = user_dict.get(height_key, None)
        w_val = user_dict.get(weight_key, None)
        try:
            if h_val is not None and w_val is not None:
                h_m = float(h_val) / 100.0  # assume cm
                if h_m > 0:
                    bmi_val = float(w_val) / (h_m * h_m)
                    user_dict[bmi_key] = bmi_val
                    print(f"[INFO] Computed {bmi_key} from {height_key} & {weight_key}: {bmi_val:.2f}")
        except Exception as e:
            print(f"[WARN] Could not compute BMI automatically: {e}")

    # --- 1) Build DataFrame ---
    x = pd.DataFrame([user_dict])

    # --- 2) Numeric imputation ---
    x_num = pd.DataFrame(
        num_imputer.transform(x.reindex(columns=num_cols, fill_value=np.nan)),
        columns=num_cols
    )

    # --- 3) Categorical imputation + encoding ---
    if cat_cols:
        x_cat = pd.DataFrame(
            cat_imputer.transform(x.reindex(columns=cat_cols, fill_value="missing")),
            columns=cat_cols
        )
        if ohe is not None:
            x_cat_ohe = ohe.transform(x_cat)
            x_proc = pd.concat([x_num, x_cat_ohe], axis=1)
        else:
            x_proc = x_num
    else:
        x_proc = x_num

    # --- 4) Align columns with training X ---
    for col in X_columns:
        if col not in x_proc.columns:
            x_proc[col] = 0
    x_proc = x_proc[X_columns]

    # --- 5) Predict for each target ---
    out = {}
    for t, m in models.items():
        yhat = m.predict(x_proc)
        out[t] = float(np.asarray(yhat).ravel()[0])
    return out


# ===========================
# USER INPUT
# ===========================

def collect_user_input(df: pd.DataFrame, num_cols, cat_cols):
    """
    Ask user for a small, meaningful subset of features.
    Others will be filled with training medians/modes.
    """

    # We try to use these if they exist; otherwise we fall back to first few.
    PREFERRED_NUM = [
        "Age", "age",
        "Height_cm", "Height", "height",
        "Weight_kg", "Weight", "weight"
    ]
    PREFERRED_CAT = [
        "Gender", "Sex",
        "ActivityLevel", "PhysicalActivity",
        "Goal",
        "DietPreference", "Diet_Preference",
        "ChronicDisease", "Chronic_Disease",
        "HasDiabetes", "Diabetes",
        "HasHypertension", "Hypertension"
    ]

    num_features = [c for c in PREFERRED_NUM if c in num_cols]
    cat_features = [c for c in PREFERRED_CAT if c in cat_cols]

    if not num_features:
        num_features = num_cols[:4]
    if not cat_features:
        cat_features = cat_cols[:4]

    print("\n[INPUT] Provide your details (press Enter to use default shown in brackets)\n")
    print("Numeric features used:", num_features)
    print("Categorical features used:", cat_features)

    # Defaults from training data
    defaults = {}
    for c in num_features:
        try:
            defaults[c] = float(pd.to_numeric(df[c], errors="coerce").median())
        except Exception:
            defaults[c] = 0.0
    for c in cat_features:
        try:
            defaults[c] = str(df[c].mode(dropna=True).iloc[0])
        except Exception:
            defaults[c] = ""

    def ask_numeric(name, default):
        while True:
            raw = input(f"{name} [{default}]: ").strip()
            if raw == "":
                return float(default)
            try:
                return float(raw)
            except ValueError:
                print("  Please enter a number.")

    def ask_categorical(name, default):
        raw = input(f"{name} [{default}]: ").strip()
        return raw if raw != "" else default

    user = {}
    for c in num_features:
        user[c] = ask_numeric(c, defaults.get(c, 0.0))
    for c in cat_features:
        val = ask_categorical(c, defaults.get(c, ""))
        # simple normalization for yes/no chronic flags
        if c.lower().startswith("has") or c.lower() in ["diabetes", "hypertension"]:
            if val.lower() in ["yes", "y", "true", "1"]:
                user[c] = 1
            elif val.lower() in ["no", "n", "false", "0"]:
                user[c] = 0
            else:
                user[c] = val  # leave as string if unsure
        else:
            user[c] = val

    return user


# ===========================
# MAIN
# ===========================

def main():
    # Load preprocessing + models
    preproc = load_preprocessing(MODEL_DIR)
    targets = load_targets(MODEL_DIR)
    models  = load_models(targets, MODEL_DIR)

    num_cols    = preproc["num_cols"]
    cat_cols    = preproc["cat_cols"]
    num_imputer = preproc["num_imputer"]
    cat_imputer = preproc["cat_imputer"]
    ohe         = preproc["ohe"]
    X_columns   = preproc["X_columns"]

    # Load dataset just to get medians/modes for defaults
    if not os.path.exists(CSV_PATH):
        raise FileNotFoundError(f"Dataset not found at {CSV_PATH} (needed for sensible defaults).")
    df = pd.read_csv(CSV_PATH)

    print("[INFO] Models and preprocessors loaded. Ready for input.\n")

    while True:
        user = collect_user_input(df, num_cols, cat_cols)

        preds = predict_requirements(
            user_dict=user,
            models=models,
            num_cols=num_cols,
            cat_cols=cat_cols,
            num_imputer=num_imputer,
            cat_imputer=cat_imputer,
            ohe=ohe,
            X_columns=X_columns
        )

        print("\n===== PREDICTED DAILY REQUIREMENTS =====")
        print(json.dumps(preds, indent=2))

        again = input("\nRun another prediction? (y/n) [n]: ").strip().lower()
        if again != "y":
            break


if __name__ == "__main__":
    main()
