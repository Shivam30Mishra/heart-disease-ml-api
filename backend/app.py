from __future__ import annotations

import json
import os
from datetime import datetime, timezone
from urllib import error, request as urlrequest

import joblib
import numpy as np
from flask import Flask, jsonify, request

try:
    from dotenv import load_dotenv
except ImportError:  # pragma: no cover
    load_dotenv = None


app = Flask(__name__)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "model.pkl")
if load_dotenv is not None:
    load_dotenv(os.path.join(BASE_DIR, ".env"))

FEATURE_ORDER = [
    "age",
    "sex",
    "cp",
    "trestbps",
    "chol",
    "fbs",
    "restecg",
    "thalach",
    "exang",
    "oldpeak",
    "slope",
    "ca",
    "thal",
]

FEATURE_LABELS = {
    "age": "Age",
    "sex": "Sex",
    "cp": "Chest pain type",
    "trestbps": "Resting blood pressure",
    "chol": "Cholesterol",
    "fbs": "Fasting blood sugar",
    "restecg": "Resting ECG",
    "thalach": "Max heart rate",
    "exang": "Exercise angina",
    "oldpeak": "ST depression",
    "slope": "ST slope",
    "ca": "Major vessels",
    "thal": "Thalassemia",
}

FEATURE_HELP = {
    "cp": {
        0: "Typical angina pattern present",
        1: "Atypical angina pattern",
        2: "Non-anginal chest pain",
        3: "No chest pain pattern reported",
    },
    "sex": {0: "Female", 1: "Male"},
    "fbs": {0: "Below 120 mg/dl", 1: "Above 120 mg/dl"},
    "restecg": {
        0: "Normal ECG",
        1: "ST-T abnormality",
        2: "Left ventricular hypertrophy pattern",
    },
    "exang": {0: "No exercise angina", 1: "Exercise angina present"},
    "slope": {
        0: "Upsloping ST segment",
        1: "Flat ST segment",
        2: "Downsloping ST segment",
    },
    "thal": {
        0: "Unknown",
        1: "Fixed defect",
        2: "Normal",
        3: "Reversible defect",
    },
}

RISK_BANDS = [
    (18, "Low", "Your current pattern looks reassuring, but healthy routines still matter."),
    (39, "Guarded", "Some signals need attention. Small changes now can lower future risk."),
    (64, "Elevated", "Several markers are concerning and deserve follow-up soon."),
    (100, "High", "Your pattern suggests meaningful risk and should be reviewed by a clinician."),
]

model = joblib.load(MODEL_PATH)
CORS_ALLOW_ORIGIN = os.environ.get("CORS_ALLOW_ORIGIN", "*")


def _as_float(value):
    try:
        return float(value)
    except (TypeError, ValueError):
        raise ValueError("Invalid numeric value received.")


def _normalize_payload(payload):
    if payload is None:
        raise ValueError("Missing request body.")

    if "patient" in payload and isinstance(payload["patient"], dict):
        patient = payload["patient"]
    elif "features" in payload and isinstance(payload["features"], list):
        if len(payload["features"]) != len(FEATURE_ORDER):
            raise ValueError("Feature list must contain 13 values.")
        patient = dict(zip(FEATURE_ORDER, payload["features"]))
    else:
        patient = payload

    missing = [feature for feature in FEATURE_ORDER if feature not in patient]
    if missing:
        raise ValueError(f"Missing fields: {', '.join(missing)}")

    normalized = {}
    for feature in FEATURE_ORDER:
        value = _as_float(patient[feature])
        if feature in {"sex", "cp", "fbs", "restecg", "exang", "slope", "ca", "thal"}:
            value = int(round(value))
        normalized[feature] = value
    return normalized


def _risk_band(risk_percentage):
    for threshold, label, summary in RISK_BANDS:
        if risk_percentage <= threshold:
            return {
                "label": label,
                "summary": summary,
                "color": {
                    "Low": "#10b981",
                    "Guarded": "#f59e0b",
                    "Elevated": "#fb7185",
                    "High": "#dc2626",
                }[label],
            }
    return {"label": "High", "summary": RISK_BANDS[-1][2], "color": "#dc2626"}


def _format_feature_value(feature, value):
    if feature in FEATURE_HELP:
        return FEATURE_HELP[feature].get(int(value), str(int(value)))
    if feature == "oldpeak":
        return f"{value:.1f}"
    return str(int(value)) if float(value).is_integer() else f"{value:.1f}"


def _feature_contributions(patient):
    values = np.array([patient[feature] for feature in FEATURE_ORDER], dtype=float)
    coefficients = getattr(model, "coef_", np.zeros((1, len(FEATURE_ORDER))))[0]
    raw_contributions = values * coefficients

    items = []
    for feature, score, value in zip(FEATURE_ORDER, raw_contributions, values):
        items.append(
            {
                "feature": feature,
                "label": FEATURE_LABELS[feature],
                "value": _format_feature_value(feature, value),
                "impact": round(float(score), 4),
                "direction": "risk_up" if score >= 0 else "risk_down",
            }
        )

    risk_up = sorted(
        [item for item in items if item["impact"] >= 0],
        key=lambda item: item["impact"],
        reverse=True,
    )[:4]
    risk_down = sorted(
        [item for item in items if item["impact"] < 0],
        key=lambda item: item["impact"],
    )[:3]

    return risk_up, risk_down


def _recommendations(patient, risk_percentage):
    actions = []

    if patient["trestbps"] >= 140:
        actions.append("Review your blood pressure with a clinician and track it weekly.")
    if patient["chol"] >= 240:
        actions.append("Focus on cholesterol reduction through diet quality, exercise, and medical follow-up.")
    if patient["fbs"] == 1:
        actions.append("Your fasting blood sugar is concerning. Consider glucose monitoring and professional advice.")
    if patient["exang"] == 1:
        actions.append("Exercise-related chest discomfort should not be ignored. Ask a cardiologist for a guided plan.")
    if patient["thalach"] < 120:
        actions.append("Build light daily cardio gradually to improve heart rate response and stamina.")
    if patient["oldpeak"] >= 2:
        actions.append("ST depression is a meaningful signal. Clinical review is recommended before hard exercise.")
    if patient["ca"] >= 2:
        actions.append("Multiple major vessels showing concern deserves more urgent specialist attention.")

    if risk_percentage < 20:
        actions.append("Keep a preventive routine: sleep well, stay active, and repeat screening if symptoms change.")
    elif risk_percentage < 40:
        actions.append("Aim for 150 minutes of weekly activity and reduce ultra-processed, high-salt meals.")
    else:
        actions.append("Book a medical review soon and bring this report with you for context.")

    unique_actions = []
    for action in actions:
        if action not in unique_actions:
            unique_actions.append(action)

    return unique_actions[:5]


def _wellness_score(patient, risk_percentage):
    score = 100 - risk_percentage
    if patient["trestbps"] < 130:
        score += 4
    if patient["chol"] < 200:
        score += 4
    if patient["thalach"] >= 150:
        score += 4
    if patient["exang"] == 0:
        score += 4
    if patient["fbs"] == 0:
        score += 2
    return int(max(0, min(100, round(score))))


def _create_prediction_response(patient):
    vector = np.array([patient[feature] for feature in FEATURE_ORDER], dtype=float).reshape(1, -1)
    prediction = int(model.predict(vector)[0])
    probability = float(model.predict_proba(vector)[0][1])
    risk_percentage = round(probability * 100, 2)
    safe_percentage = round(100 - risk_percentage, 2)
    band = _risk_band(risk_percentage)
    risk_up, risk_down = _feature_contributions(patient)
    recommendations = _recommendations(patient, risk_percentage)
    timestamp = datetime.now(timezone.utc).isoformat()

    return {
        "prediction": prediction,
        "risk": risk_percentage,
        "safe_probability": safe_percentage,
        "risk_level": band["label"],
        "risk_summary": band["summary"],
        "accent": band["color"],
        "wellness_score": _wellness_score(patient, risk_percentage),
        "top_risk_drivers": risk_up,
        "protective_signals": risk_down,
        "recommendations": recommendations,
        "triage_note": (
            "This tool supports awareness, not diagnosis. Seek urgent care for chest pain, fainting, or severe breathlessness."
        ),
        "generated_at": timestamp,
        "patient": patient,
    }


def _fallback_chat(question, patient_context):
    risk = patient_context.get("risk")
    recommendations = patient_context.get("recommendations") or []

    if risk is None:
        return (
            "I can explain heart-health basics, but I work best after an assessment. "
            "Complete the risk form first so I can answer with context."
        )

    answer = [
        f"Your latest estimated heart-risk score is {risk}%.",
        "The most useful next steps are to follow the top recommendations in your report and review any symptoms with a clinician.",
    ]

    if recommendations:
        answer.append(f"Priority action: {recommendations[0]}")

    lowered = question.lower()
    if "cholesterol" in lowered:
        answer.append("For cholesterol, focus on fiber-rich meals, reducing fried food frequency, and regular follow-up testing.")
    if "exercise" in lowered or "workout" in lowered:
        answer.append("Choose low to moderate intensity activity first, especially if you reported exercise-related discomfort.")
    if "food" in lowered or "diet" in lowered:
        answer.append("A plate built around vegetables, lean protein, whole grains, and lower sodium choices is a strong default.")

    return " ".join(answer)


def _gemini_chat(question, patient_context):
    api_key = os.environ.get("GEMINI_API_KEY")
    model_name = os.environ.get("GEMINI_MODEL", "gemini-1.5-flash")
    if not api_key:
        return _fallback_chat(question, patient_context), False

    prompt = (
        "You are a supportive heart health assistant inside a preventive care dashboard. "
        "Be concise, practical, and safety-minded. Do not diagnose. Encourage medical care for urgent symptoms. "
        f"Patient context: {json.dumps(patient_context)}. "
        f"User question: {question}"
    )

    body = json.dumps(
        {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {"temperature": 0.4, "maxOutputTokens": 350},
        }
    ).encode("utf-8")

    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={api_key}"
    req = urlrequest.Request(
        url,
        data=body,
        headers={"Content-Type": "application/json"},
        method="POST",
    )

    try:
        with urlrequest.urlopen(req, timeout=20) as response:
            payload = json.loads(response.read().decode("utf-8"))
            text = payload["candidates"][0]["content"]["parts"][0]["text"]
            return text, True
    except (KeyError, IndexError, error.URLError, TimeoutError, json.JSONDecodeError):
        return _fallback_chat(question, patient_context), False


@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = CORS_ALLOW_ORIGIN
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    response.headers["Access-Control-Allow-Methods"] = "GET,POST,OPTIONS"
    return response


@app.route("/", methods=["GET"])
def home():
    return jsonify(
        {
            "service": "Heart Disease Prediction API",
            "status": "ok",
            "endpoints": ["/predict", "/chat", "/health"],
        }
    )


@app.route("/health", methods=["GET"])
def health():
    return jsonify(
        {
            "status": "healthy",
            "model_loaded": model is not None,
            "gemini_configured": bool(os.environ.get("GEMINI_API_KEY")),
        }
    )


@app.route("/predict", methods=["POST", "OPTIONS"])
def predict():
    if request.method == "OPTIONS":
        return ("", 204)

    try:
        patient = _normalize_payload(request.get_json(silent=True))
        prediction = _create_prediction_response(patient)
        return jsonify(prediction)
    except ValueError as exc:
        return jsonify({"error": str(exc)}), 400
    except Exception as exc:  # pragma: no cover
        return jsonify({"error": f"Prediction failed: {exc}"}), 500


@app.route("/chat", methods=["POST", "OPTIONS"])
def chat():
    if request.method == "OPTIONS":
        return ("", 204)

    payload = request.get_json(silent=True) or {}
    question = (payload.get("question") or "").strip()
    patient_context = payload.get("context") or {}

    if not question:
        return jsonify({"error": "Question is required."}), 400

    answer, live_model = _gemini_chat(question, patient_context)
    return jsonify(
        {
            "answer": answer,
            "source": "gemini" if live_model else "local-fallback",
        }
    )


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(
        host="0.0.0.0",
        port=port,
        debug=os.environ.get("FLASK_DEBUG", "true").lower() == "true",
    )
