from flask import Flask, request, jsonify
import numpy as np
import joblib
import os

port = int(os.environ.get("PORT", 5000))
app.run(host="0.0.0.0", port=port)

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
    
    return jsonify({
        "prediction": int(prediction),
        "result": "Heart Disease" if prediction == 1 else "No Heart Disease"
    })

if __name__ == "__main__":
    app.run()