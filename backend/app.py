from flask import Flask, request, jsonify
import numpy as np
import joblib
import os

app = Flask(__name__)

model = joblib.load("model.pkl")

@app.route("/")
def home():
    return "Heart Disease Prediction API"

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json["features"]
    
    data = np.array(data).reshape(1, -1)

    prediction = model.predict(data)[0]
    probability = model.predict_proba(data)[0][1]  # 🔥 THIS IS IMPORTANT

    return jsonify({
        "prediction": int(prediction),
        "risk": round(probability * 100, 2)
    })

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)