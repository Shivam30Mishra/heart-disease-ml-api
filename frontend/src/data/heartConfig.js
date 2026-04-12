export const featureSections = [
  {
    title: "Profile",
    description: "Basic profile details used by the model.",
    fields: [
      {
        key: "age",
        label: "Age",
        type: "number",
        min: 18,
        max: 100,
        step: 1,
        helper: "Years",
      },
      {
        key: "sex",
        label: "Sex",
        type: "select",
        options: [
          { value: 1, label: "Male" },
          { value: 0, label: "Female" },
        ],
      },
      {
        key: "cp",
        label: "Chest pain type",
        type: "select",
        options: [
          { value: 0, label: "Typical angina" },
          { value: 1, label: "Atypical angina" },
          { value: 2, label: "Non-anginal pain" },
          { value: 3, label: "Asymptomatic" },
        ],
      },
    ],
  },
  {
    title: "Vitals",
    description: "Clinical markers that strongly shape risk probability.",
    fields: [
      {
        key: "trestbps",
        label: "Resting blood pressure",
        type: "number",
        min: 80,
        max: 220,
        step: 1,
        helper: "mm Hg",
      },
      {
        key: "chol",
        label: "Cholesterol",
        type: "number",
        min: 100,
        max: 600,
        step: 1,
        helper: "mg/dl",
      },
      {
        key: "fbs",
        label: "Fasting blood sugar",
        type: "select",
        options: [
          { value: 0, label: "Below 120 mg/dl" },
          { value: 1, label: "Above 120 mg/dl" },
        ],
      },
      {
        key: "restecg",
        label: "Resting ECG",
        type: "select",
        options: [
          { value: 0, label: "Normal" },
          { value: 1, label: "ST-T abnormality" },
          { value: 2, label: "Left ventricular hypertrophy" },
        ],
      },
    ],
  },
  {
    title: "Performance",
    description: "Exercise response and stress-related indicators.",
    fields: [
      {
        key: "thalach",
        label: "Maximum heart rate",
        type: "number",
        min: 60,
        max: 220,
        step: 1,
        helper: "bpm",
      },
      {
        key: "exang",
        label: "Exercise angina",
        type: "select",
        options: [
          { value: 0, label: "No" },
          { value: 1, label: "Yes" },
        ],
      },
      {
        key: "oldpeak",
        label: "ST depression",
        type: "number",
        min: 0,
        max: 7,
        step: 0.1,
        helper: "exercise induced",
      },
      {
        key: "slope",
        label: "ST slope",
        type: "select",
        options: [
          { value: 0, label: "Upsloping" },
          { value: 1, label: "Flat" },
          { value: 2, label: "Downsloping" },
        ],
      },
      {
        key: "ca",
        label: "Major vessels",
        type: "select",
        options: [
          { value: 0, label: "0" },
          { value: 1, label: "1" },
          { value: 2, label: "2" },
          { value: 3, label: "3" },
          { value: 4, label: "4" },
        ],
      },
      {
        key: "thal",
        label: "Thalassemia",
        type: "select",
        options: [
          { value: 1, label: "Fixed defect" },
          { value: 2, label: "Normal" },
          { value: 3, label: "Reversible defect" },
        ],
      },
    ],
  },
];

export const defaultPatient = {
  age: 45,
  sex: 1,
  cp: 2,
  trestbps: 128,
  chol: 210,
  fbs: 0,
  restecg: 0,
  thalach: 156,
  exang: 0,
  oldpeak: 1.1,
  slope: 1,
  ca: 0,
  thal: 2,
};

export const simulatorConfig = [
  { key: "trestbps", label: "Lower blood pressure", min: 90, max: 200, step: 1, unit: "mm Hg" },
  { key: "chol", label: "Reduce cholesterol", min: 120, max: 400, step: 1, unit: "mg/dl" },
  { key: "thalach", label: "Improve max heart rate", min: 80, max: 210, step: 1, unit: "bpm" },
  { key: "oldpeak", label: "Improve stress response", min: 0, max: 6, step: 0.1, unit: "" },
];

export const dailyChecklist = [
  "10-minute walk after meals",
  "2 liters of water",
  "One low-salt meal choice",
  "7+ hours of sleep target",
  "Medication check-in",
  "Stretch or breathing break",
];

export const quickQuestions = [
  "What does my risk percentage actually mean?",
  "How can I reduce cholesterol naturally?",
  "Is it safe for me to start cardio training?",
  "What food swaps help blood pressure the most?",
];

export const resourceCards = [
  {
    title: "Cardiology review prep",
    description: "Bring your PDF report, symptom history, and recent lab values to a doctor visit.",
  },
  {
    title: "Daily prevention",
    description: "Use the simulator weekly to see how blood pressure and cholesterol improvements change risk.",
  },
  {
    title: "Urgent symptoms",
    description: "Chest pain, fainting, or severe shortness of breath should be treated as urgent medical concerns.",
  },
];
