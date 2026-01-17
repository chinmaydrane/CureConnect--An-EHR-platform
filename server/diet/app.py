from flask import Flask, request, jsonify, send_from_directory
import pickle, pandas as pd, numpy as np, json, os

app = Flask(__name__)
MODEL_DIR = "diet_model"

TARGETS = [
    "Recommended_Calories",
    "Recommended_Protein",
    "Recommended_Carbs",
    "Recommended_Fats"
]

# Load best pipelines
pipelines = {}
for t in TARGETS:
    path = os.path.join(MODEL_DIR, f"{t}.pkl")
    if not os.path.exists(path):
        raise FileNotFoundError(f"Missing model pipeline: {path}. Run train.py first.")
    with open(path, "rb") as f:
        pipelines[t] = pickle.load(f)

def feature_engineering(user: dict) -> dict:
    u = dict(user)

    # BMI_calc
    if "Height_cm" in u and "Weight_kg" in u:
        try:
            h = float(u["Height_cm"]) / 100.0
            w = float(u["Weight_kg"])
            if h > 0:
                u["BMI_calc"] = w / (h*h)
        except:
            pass

    # Pulse pressure & MAP
    if "Blood_Pressure_Systolic" in u and "Blood_Pressure_Diastolic" in u:
        try:
            s = float(u["Blood_Pressure_Systolic"])
            d = float(u["Blood_Pressure_Diastolic"])
            u["Pulse_Pressure"] = s - d
            u["MAP"] = (2*d + s) / 3.0
        except:
            pass

    # Risk flags
    if "Blood_Sugar_Level" in u:
        try:
            u["High_Sugar"] = int(float(u["Blood_Sugar_Level"]) >= 126)
        except:
            pass

    if "Cholesterol_Level" in u:
        try:
            u["High_Cholesterol"] = int(float(u["Cholesterol_Level"]) >= 240)
        except:
            pass

    if "Blood_Pressure_Systolic" in u and "Blood_Pressure_Diastolic" in u:
        try:
            s = float(u["Blood_Pressure_Systolic"])
            d = float(u["Blood_Pressure_Diastolic"])
            u["High_BP"] = int((s >= 140) or (d >= 90))
        except:
            pass

    if "Daily_Steps" in u and "Exercise_Frequency" in u:
        try:
            u["Activity_Index"] = float(u["Daily_Steps"]) * float(u["Exercise_Frequency"])
        except:
            pass

    if "Sleep_Hours" in u:
        try:
            u["Sleep_Deficit"] = max(0.0, 7.0 - float(u["Sleep_Hours"]))
        except:
            pass

    return u

@app.route("/")
def home():
    return send_from_directory(".", "index.html")

@app.route("/predict", methods=["POST"])
def predict_api():
    try:
        user = request.json
        user = feature_engineering(user)

        X = pd.DataFrame([user])

        # ADD THIS BLOCK 👇
        expected = pipelines[TARGETS[0]].feature_names_in_
        missing_cols = set(expected) - set(X.columns)

        for col in missing_cols:
            X[col] = np.nan

        X = X[list(expected)]
        # END BLOCK ✅

        out = {}
        for t, pipe in pipelines.items():
            out[t] = float(pipe.predict(X)[0])

        return jsonify(out)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    print("Running at http://localhost:5000")
    app.run(port=5000, debug=True)
