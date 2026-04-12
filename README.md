# HeartWise - Heart Disease Prediction Dashboard

A full-stack preventive care application that transforms a machine learning model into a daily-use heart health product. Users receive risk assessments, plain-language explanations, simulations, downloadable reports, and an AI-powered health assistant.

## Core Idea

HeartWise takes a trained heart disease prediction model and wraps it with a production-ready frontend that makes ML useful for end users. Instead of just showing a prediction label, it provides:

- **Probability-based scoring** - Uses `predict_proba()` for meaningful risk percentages
- **Explainable AI** - Shows top risk drivers and protective signals
- **What-if simulator** - Lets users explore how lifestyle changes could improve their score
- **PDF reports** - Generates shareable summaries for medical follow-ups
- **Daily habit tracker** - Encourages daily engagement with preventive routines
- **AI assistant** - Gemini-powered chat for personalized health guidance (optional)

## How It's Implemented

### Backend (Flask)
- **API Endpoint** (`/predict`): Accepts patient data, returns probability score, risk level, risk drivers, protective signals, recommendations, and wellness score
- **Chat Endpoint** (`/chat`): Provides health Q&A with optional Gemini integration
- **ML Model**: Loads a pre-trained model (`model.pkl`) using joblib
- **Feature Processing**: Handles 13 clinical features (age, sex, chest pain type, blood pressure, cholesterol, etc.)
- **Risk Interpretation**: Maps probability to risk bands (Low/Guarded/Elevated/High) with color-coded UI feedback

### Frontend (React)
- **Smart Intake Form**: Polished input form with 13 features organized into sections
- **Sample Presets**: Pre-filled profiles for quick testing (balanced, higher-risk, lower-risk)
- **Result Visualization**: Charts showing risk drivers, wellness score, and safe probability
- **What-if Simulator**: Sliders to adjust values and see projected risk changes
- **History Tracking**: Stores last 7 assessments locally for trend analysis
- **PDF Export**: Generates professional reports using jsPDF
- **Prevention Checklist**: Daily habit tracker for engagement
- **AI Chat**: Chatbot with Gemini integration (falls back to rule-based responses)

### Tech Stack
- **Backend**: Python/Flask, scikit-learn, joblib, NumPy
- **Frontend**: React 19, Recharts, Framer Motion, Lucide Icons, jsPDF
- **ML Model**: Logistic Regression trained on heart disease data

## Local Setup Instructions

### Prerequisites
- Python 3.8+
- Node.js 18+
- npm or yarn

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Heart-Disease-Prediction
```

### 2. Set Up the Backend

```bash
cd backend

# Create virtual environment (optional but recommended)
python -m venv venv
# On Windows: venv\Scripts\activate
# On Mac/Linux: source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# (Optional) Configure Gemini API for AI chat
# Copy .env.example to .env and add your GEMINI_API_KEY
# cp .env.example .env
# Edit .env and set GEMINI_API_KEY=your_api_key_here

# Start the Flask server
python app.py
```

The backend will run at `http://127.0.0.1:5000`

### 3. Set Up the Frontend

Open a new terminal:

```bash
cd frontend

# Install dependencies
npm install

# Start the React development server
npm start
```

The frontend will run at `http://localhost:3000`

### 4. Use the Application

1. Open `http://localhost:3000` in your browser
2. Fill in the heart risk assessment form (use sample presets for quick testing)
3. Click "Analyze my heart risk" to get your prediction
4. Explore the simulator, chat assistant, and PDF export features

## Environment Variables

### Backend (.env)
```
PORT=5000
FLASK_DEBUG=true
CORS_ALLOW_ORIGIN=*
# Optional: GEMINI_API_KEY=your_google_gemini_api_key
```

### Frontend
The frontend expects the backend at `http://127.0.0.1:5000` by default. To change this, set the `REACT_APP_API_BASE_URL` environment variable before building.

## Project Structure

```
Heart-Disease-Prediction/
├── backend/
│   ├── app.py              # Flask API server
│   ├── model.pkl           # Trained ML model
│   ├── requirements.txt    # Python dependencies
│   └── .env.example        # Environment variables template
├── frontend/
│   ├── src/
│   │   ├── App.js          # Main React application
│   │   ├── data/
│   │   │   └── heartConfig.js  # Configuration and data
│   │   └── utils/
│   │       └── report.js   # PDF generation
│   ├── package.json        # Node dependencies
│   └── tailwind.config.js  # Tailwind CSS config
└── README.md               # This file
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | API info |
| `/health` | GET | Health check |
| `/predict` | POST | Run heart risk prediction |
| `/chat` | POST | AI health assistant chat |

## Notes

- This tool supports health awareness, not diagnosis. Always consult healthcare professionals for medical advice.
- The ML model is a demo and should not be used for actual medical diagnosis without proper validation and medical oversight.
- For AI chat features, obtain a Gemini API key from Google Cloud Console and add it to the backend .env file.