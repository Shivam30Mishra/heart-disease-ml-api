import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Activity,
  Bot,
  BrainCircuit,
  CalendarCheck2,
  Download,
  HeartPulse,
  LoaderCircle,
  MessageCircleHeart,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  dailyChecklist,
  defaultPatient,
  featureSections,
  quickQuestions,
  resourceCards,
  simulatorConfig,
} from "./data/heartConfig";
import { downloadHeartReport } from "./utils/report";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:5000";
const HISTORY_KEY = "heartwise-history";
const CHECKLIST_KEY = "heartwise-checklist";
const heroImage =
  "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80";
const lifestyleImage =
  "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80";

const statCards = [
  { label: "Probability-led screening", value: "predict_proba()", tone: "from-rose-500/15 to-rose-500/5" },
  { label: "Daily habit prompts", value: "6 touchpoints", tone: "from-sky-500/15 to-sky-500/5" },
  { label: "Actionable explanation", value: "Top 4 drivers", tone: "from-emerald-500/15 to-emerald-500/5" },
];

const formatDate = () =>
  new Date().toLocaleDateString(undefined, { month: "short", day: "numeric" });

const buildFactorChart = (result) =>
  (result?.top_risk_drivers || []).map((item) => ({
    name: item.label,
    value: Math.max(item.impact, 0.05),
  }));

const MetricChip = ({ label, value }) => (
  <div className="rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3">
    <p className="text-xs uppercase tracking-[0.22em] text-slate-400">{label}</p>
    <p className="mt-2 text-lg font-semibold text-white">{value}</p>
  </div>
);

const Panel = ({ eyebrow, title, description, dark = false, children }) => (
  <section
    className={`rounded-[36px] border p-6 sm:p-7 ${
      dark ? "border-white/10 bg-[var(--ink)] text-white" : "border-slate-200/70 bg-[var(--card)] text-slate-900"
    }`}
  >
    <p className={`text-xs uppercase tracking-[0.24em] ${dark ? "text-slate-400" : "text-slate-500"}`}>{eyebrow}</p>
    <h2 className={`mt-3 text-2xl font-semibold ${dark ? "text-white" : "text-slate-950"}`}>{title}</h2>
    <p className={`mt-2 text-sm leading-6 ${dark ? "text-slate-300" : "text-slate-600"}`}>{description}</p>
    <div className="mt-6">{children}</div>
  </section>
);

const EmptyState = ({ text, dark = false }) => (
  <div className={`rounded-2xl border px-4 py-5 text-sm ${dark ? "border-white/10 bg-white/5 text-slate-400" : "border-slate-200 bg-white text-slate-500"}`}>
    {text}
  </div>
);

function App() {
  const assessmentRef = useRef(null);
  const simulatorRef = useRef(null);
  const chatRef = useRef(null);
  const reportRef = useRef(null);
  const chatInputRef = useRef(null);
  const [patient, setPatient] = useState(defaultPatient);
  const [simulationValues, setSimulationValues] = useState(defaultPatient);
  const [result, setResult] = useState(null);
  const [simulationResult, setSimulationResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [checklistState, setChecklistState] = useState({});
  const [chatMessages, setChatMessages] = useState([
    {
      role: "assistant",
      content:
        "I can explain your score, suggest doctor questions, and translate medical language into simple guidance.",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [simLoading, setSimLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [error, setError] = useState("");
  const [backendStatus, setBackendStatus] = useState({
    reachable: false,
    geminiConfigured: false,
  });

  useEffect(() => {
    const storedHistory = window.localStorage.getItem(HISTORY_KEY);
    const storedChecklist = window.localStorage.getItem(CHECKLIST_KEY);
    if (storedHistory) setHistory(JSON.parse(storedHistory));
    if (storedChecklist) setChecklistState(JSON.parse(storedChecklist));
  }, []);

  useEffect(() => {
    window.localStorage.setItem(CHECKLIST_KEY, JSON.stringify(checklistState));
  }, [checklistState]);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/health`);
        setBackendStatus({
          reachable: data.status === "healthy",
          geminiConfigured: Boolean(data.gemini_configured),
        });
      } catch {
        setBackendStatus({
          reachable: false,
          geminiConfigured: false,
        });
      }
    };

    checkHealth();
  }, []);

  const scrollToSection = (ref, focusInput = false) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    if (focusInput) {
      window.setTimeout(() => chatInputRef.current?.focus(), 450);
    }
  };

  const updateField = (key, value) => {
    const parsed = Number(value);
    setPatient((current) => ({ ...current, [key]: parsed }));
    setSimulationValues((current) => ({ ...current, [key]: parsed }));
  };

  const runAssessment = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await axios.post(`${API_BASE_URL}/predict`, { patient });
      setResult(data);
      setSimulationResult(null);
      const nextHistory = [...history, { risk: data.risk, wellness: data.wellness_score, date: formatDate() }].slice(-7);
      setHistory(nextHistory);
      window.localStorage.setItem(HISTORY_KEY, JSON.stringify(nextHistory));
    } catch (assessmentError) {
      setError(assessmentError.response?.data?.error || "Start the Flask API to use the assessment.");
    } finally {
      setLoading(false);
    }
  };

  const runSimulation = async () => {
    setSimLoading(true);
    try {
      const { data } = await axios.post(`${API_BASE_URL}/predict`, { patient: simulationValues });
      setSimulationResult(data);
    } catch (simulationError) {
      setError(simulationError.response?.data?.error || "Simulation is unavailable right now.");
    } finally {
      setSimLoading(false);
    }
  };

  const sendMessage = async (override) => {
    const question = (override || chatInput).trim();
    if (!question) return;
    setChatMessages((current) => [...current, { role: "user", content: question }]);
    setChatInput("");
    setChatLoading(true);
    try {
      const { data } = await axios.post(`${API_BASE_URL}/chat`, {
        question,
        context: { risk: result?.risk, risk_level: result?.risk_level, recommendations: result?.recommendations, patient },
      });
      setChatMessages((current) => [...current, { role: "assistant", content: data.answer, badge: data.source === "gemini" ? "Gemini" : "Local guide" }]);
    } catch {
      setChatMessages((current) => [...current, { role: "assistant", content: "The assistant is unavailable right now.", badge: "Error" }]);
    } finally {
      setChatLoading(false);
    }
  };

  const factorChart = buildFactorChart(result);
  const checklistDone = dailyChecklist.filter((item) => checklistState[item]).length;
  const hasResult = Boolean(result);

  return (
    <div className="min-h-screen bg-[var(--surface)] text-slate-100">
      <div className="mx-auto max-w-[1440px] px-4 py-4 sm:px-6 lg:px-8">
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-[36px] border border-white/10 bg-[#081120] p-6 sm:p-8 lg:p-10"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(66,153,225,0.28),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(244,114,182,0.18),_transparent_26%)]" />
          <div className="relative grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <div className="mb-5 flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-100">
                  <ShieldCheck size={14} />
                  Product-Ready Preventive Care
                </span>
                <span className="rounded-full border border-white/10 px-4 py-2 text-xs text-slate-300">React frontend first</span>
                <span className={`rounded-full border px-4 py-2 text-xs ${backendStatus.reachable ? "border-emerald-300/20 bg-emerald-400/10 text-emerald-100" : "border-amber-300/20 bg-amber-400/10 text-amber-100"}`}>
                  {backendStatus.reachable ? "Backend connected" : "Backend offline"}
                </span>
                <span className={`rounded-full border px-4 py-2 text-xs ${backendStatus.geminiConfigured ? "border-sky-300/20 bg-sky-400/10 text-sky-100" : "border-white/10 text-slate-300"}`}>
                  {backendStatus.geminiConfigured ? "Gemini ready" : "Gemini key missing"}
                </span>
              </div>
              <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
                HeartWise turns a model demo into a daily-use heart health product.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                Users get risk percentage, plain-language explanations, simulations, downloadable reports, trend memory, a prevention checklist, and a Gemini-ready assistant.
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {statCards.map((card) => (
                  <div key={card.label} className={`rounded-[28px] border border-white/10 bg-gradient-to-br p-4 ${card.tone}`}>
                    <p className="text-xs uppercase tracking-[0.18em] text-white/60">{card.label}</p>
                    <p className="mt-3 text-2xl font-semibold text-white">{card.value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <button onClick={() => { scrollToSection(assessmentRef); runAssessment(); }} className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-slate-900">
                  {loading ? <LoaderCircle size={18} className="animate-spin" /> : <HeartPulse size={18} />}
                  Run Risk Assessment
                </button>
                <button onClick={() => { scrollToSection(chatRef, true); sendMessage(hasResult ? "What does my risk percentage actually mean?" : "How should I use this heart health dashboard before my first assessment?"); }} className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 font-semibold text-white">
                  <Bot size={18} />
                  Ask the AI assistant
                </button>
              </div>
              <div className="mt-5 flex flex-wrap gap-2 text-xs text-slate-300">
                <button onClick={() => scrollToSection(assessmentRef)} className="rounded-full border border-white/10 px-4 py-2 transition hover:bg-white/5">Assessment</button>
                <button onClick={() => scrollToSection(simulatorRef)} className="rounded-full border border-white/10 px-4 py-2 transition hover:bg-white/5">Simulator</button>
                <button onClick={() => scrollToSection(chatRef, true)} className="rounded-full border border-white/10 px-4 py-2 transition hover:bg-white/5">Chat</button>
                <button onClick={() => scrollToSection(reportRef)} className="rounded-full border border-white/10 px-4 py-2 transition hover:bg-white/5">Report</button>
              </div>
            </div>
            <div className="grid gap-4">
              <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 p-4">
                <img src={heroImage} alt="Doctor consulting a patient about heart health" className="h-72 w-full rounded-[24px] object-cover" />
                <div className="absolute bottom-8 left-8 right-8 rounded-[24px] border border-white/15 bg-slate-950/60 p-5 backdrop-blur">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-300">Clinical intelligence</p>
                  <p className="mt-3 text-3xl font-semibold text-white">{result ? `${result.risk}%` : "12-64%"}</p>
                  <p className="mt-2 text-sm text-slate-300">{result ? result.risk_summary : "Probability-led risk with explanations and next steps."}</p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <button onClick={() => scrollToSection(simulatorRef)} className="rounded-[28px] border border-white/10 bg-white/5 p-5 text-left text-white transition hover:border-cyan-300/40 hover:bg-white/10">
                  <TrendingDown size={20} className="text-cyan-200" />
                  <p className="mt-4 text-lg font-semibold">What-if simulator</p>
                  <p className="mt-2 text-sm text-slate-300">Show how healthier vitals could change projected risk.</p>
                </button>
                <button onClick={() => scrollToSection(reportRef)} className="rounded-[28px] border border-white/10 bg-white/5 p-5 text-left text-white transition hover:border-cyan-300/40 hover:bg-white/10">
                  <Download size={20} className="text-cyan-200" />
                  <p className="mt-4 text-lg font-semibold">PDF report</p>
                  <p className="mt-2 text-sm text-slate-300">Download a doctor-friendly summary of the assessment.</p>
                </button>
              </div>
            </div>
          </div>
        </motion.section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="grid gap-6">
            <div ref={assessmentRef}>
            <Panel eyebrow="Smart Intake" title="Heart risk assessment" description="A polished frontend around the 13 features your model expects.">
              <div className="space-y-6">
                <div className="rounded-[28px] border border-cyan-100 bg-gradient-to-r from-cyan-50 to-white p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-700">Sample presets</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button onClick={() => { setPatient(defaultPatient); setSimulationValues(defaultPatient); }} className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white">Balanced profile</button>
                    <button onClick={() => {
                      const profile = { age: 58, sex: 1, cp: 0, trestbps: 154, chol: 286, fbs: 1, restecg: 1, thalach: 118, exang: 1, oldpeak: 2.7, slope: 2, ca: 2, thal: 3 };
                      setPatient(profile);
                      setSimulationValues(profile);
                    }} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">Higher-risk example</button>
                    <button onClick={() => {
                      const profile = { age: 34, sex: 0, cp: 3, trestbps: 112, chol: 174, fbs: 0, restecg: 0, thalach: 178, exang: 0, oldpeak: 0.2, slope: 0, ca: 0, thal: 2 };
                      setPatient(profile);
                      setSimulationValues(profile);
                    }} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">Lower-risk example</button>
                  </div>
                </div>
                {featureSections.map((section) => (
                  <div key={section.title} className="rounded-[28px] border border-slate-200/60 bg-white p-5">
                    <h3 className="text-lg font-semibold text-slate-900">{section.title}</h3>
                    <p className="mb-4 text-sm text-slate-500">{section.description}</p>
                    <div className="grid gap-4 md:grid-cols-2">
                      {section.fields.map((field) => (
                        <label key={field.key} className="block">
                          <span className="mb-2 block text-sm font-medium text-slate-700">{field.label}</span>
                          {field.type === "select" ? (
                            <select value={patient[field.key]} onChange={(event) => updateField(field.key, event.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none">
                              {field.options.map((option) => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                              ))}
                            </select>
                          ) : (
                            <input type="number" min={field.min} max={field.max} step={field.step} value={patient[field.key]} onChange={(event) => updateField(field.key, event.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none" />
                          )}
                          {field.helper ? <span className="mt-2 block text-xs text-slate-500">{field.helper}</span> : null}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <button onClick={runAssessment} className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3 font-semibold text-white">
                  {loading ? <LoaderCircle size={18} className="animate-spin" /> : <Activity size={18} />}
                  Analyze my heart risk
                </button>
                <button onClick={() => { setPatient(defaultPatient); setSimulationValues(defaultPatient); }} className="rounded-full border border-slate-300 px-6 py-3 font-semibold text-slate-700">Reset demo values</button>
              </div>
              {error ? <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}
            </Panel>
            </div>

            <Panel eyebrow="Daily Use" title="Prevention checklist" description="Simple enough for daily retention, useful enough to feel product-ready.">
              <div className="mb-5 flex items-center justify-between rounded-[28px] bg-[var(--ink)] p-5 text-white">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-300">Today&apos;s progress</p>
                  <p className="mt-2 text-3xl font-semibold">{checklistDone}/{dailyChecklist.length}</p>
                </div>
                <CalendarCheck2 size={28} className="text-cyan-300" />
              </div>
              <div className="space-y-3">
                {dailyChecklist.map((item) => (
                  <button key={item} onClick={() => setChecklistState((current) => ({ ...current, [item]: !current[item] }))} className={`flex w-full items-center justify-between rounded-2xl border px-4 py-4 text-left ${checklistState[item] ? "border-emerald-200 bg-emerald-50 text-emerald-900" : "border-slate-200 bg-slate-50 text-slate-700"}`}>
                    <span className="font-medium">{item}</span>
                    <span className="text-sm">{checklistState[item] ? "Done" : "Pending"}</span>
                  </button>
                ))}
              </div>
            </Panel>
          </div>

          <div className="grid gap-6">
            <Panel eyebrow="Insight Layer" title="Risk story, not just a prediction" description="Friendly explanation of model output with recommendations and report export." dark>
              <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
                <div ref={reportRef} className="rounded-[32px] border border-white/10 bg-white/5 p-6">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Current estimate</p>
                  <p className="mt-4 text-6xl font-semibold text-white">{result ? `${result.risk}%` : "--"}</p>
                  <p className="mt-3 text-sm text-slate-300">{result?.risk_summary || "Run an assessment to unlock your score."}</p>
                  <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/30 p-4">
                    <div className="flex items-center justify-between text-sm text-slate-300">
                      <span>Assessment status</span>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${hasResult ? "bg-emerald-500/20 text-emerald-200" : "bg-white/10 text-slate-300"}`}>{hasResult ? "Live result ready" : "Awaiting first run"}</span>
                    </div>
                  </div>
                  <div className="mt-5 grid gap-3">
                    <MetricChip label="Risk band" value={result?.risk_level || "Pending"} />
                    <MetricChip label="Wellness score" value={result ? `${result.wellness_score}/100` : "Pending"} />
                    <MetricChip label="Safer pattern" value={result ? `${result.safe_probability}%` : "Pending"} />
                  </div>
                  {result ? (
                    <button onClick={() => downloadHeartReport({ patient, result, simulation: simulationResult, history })} className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 font-semibold text-slate-900">
                      <Download size={18} />
                      Download PDF report
                    </button>
                  ) : null}
                </div>
                <div className="grid gap-5">
                  <div className="rounded-[32px] border border-white/10 bg-white/5 p-6">
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <p className="text-lg font-semibold text-white">Top risk drivers</p>
                        <p className="text-sm text-slate-400">Most influential inputs for the current score.</p>
                      </div>
                      <BrainCircuit size={22} className="text-cyan-300" />
                    </div>
                    {factorChart.length ? (
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={factorChart}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                            <XAxis dataKey="name" tick={{ fill: "#cbd5e1", fontSize: 12 }} />
                            <YAxis tick={{ fill: "#cbd5e1", fontSize: 12 }} />
                            <Tooltip contentStyle={{ background: "#0f172a", borderRadius: 16, border: "1px solid rgba(255,255,255,0.08)", color: "#fff" }} />
                            <Bar dataKey="value" radius={[8, 8, 0, 0]}>{factorChart.map((entry) => <Cell key={entry.name} fill="#38bdf8" />)}</Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    ) : <EmptyState text="Risk drivers appear after the first assessment." dark />}
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
                      <p className="text-lg font-semibold text-white">Drivers to watch</p>
                      <div className="mt-4 space-y-3">
                        {result?.top_risk_drivers?.length ? result.top_risk_drivers.map((item) => (
                          <div key={item.label} className="rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3 text-sm text-slate-200">{item.label}: {item.value}</div>
                        )) : <EmptyState text="No items yet." dark />}
                      </div>
                    </div>
                    <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
                      <p className="text-lg font-semibold text-white">Protective signals</p>
                      <div className="mt-4 space-y-3">
                        {result?.protective_signals?.length ? result.protective_signals.map((item) => (
                          <div key={item.label} className="rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3 text-sm text-slate-200">{item.label}: {item.value}</div>
                        )) : <EmptyState text="No items yet." dark />}
                      </div>
                    </div>
                  </div>
                  <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
                    <p className="text-lg font-semibold text-white">Personal action plan</p>
                    <div className="mt-4 space-y-3">
                      {result?.recommendations?.length ? result.recommendations.map((item) => (
                        <div key={item} className="rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3 text-sm text-slate-200">{item}</div>
                      )) : <EmptyState text="Recommendations appear after the first assessment." dark />}
                    </div>
                  </div>
                  <div className="rounded-[28px] border border-amber-300/20 bg-amber-400/10 p-5 text-amber-50">
                    <div className="flex items-start gap-3">
                      <Stethoscope size={20} className="mt-1 text-amber-200" />
                      <p className="text-sm leading-6">{result?.triage_note || "This product supports awareness, not diagnosis or emergency care."}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Panel>

            <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
              <div ref={simulatorRef}>
              <Panel eyebrow="Simulation" title="What-if risk reduction lab" description="Users can try healthier values and compare the projected score.">
                <div className="space-y-5">
                  {simulatorConfig.map((item) => (
                    <div key={item.key}>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="font-medium text-slate-800">{item.label}</span>
                        <span className="text-slate-500">{simulationValues[item.key]}{item.unit ? ` ${item.unit}` : ""}</span>
                      </div>
                      <input type="range" min={item.min} max={item.max} step={item.step} value={simulationValues[item.key]} onChange={(event) => setSimulationValues((current) => ({ ...current, [item.key]: Number(event.target.value) }))} className="w-full accent-slate-900" />
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <button onClick={runSimulation} className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 font-semibold text-white">
                    {simLoading ? <LoaderCircle size={18} className="animate-spin" /> : <Sparkles size={18} />}
                    Simulate healthier scenario
                  </button>
                  {simulationResult && result ? <span className="inline-flex items-center rounded-full bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">Delta: {(result.risk - simulationResult.risk).toFixed(2)}%</span> : null}
                </div>
                <div className="mt-6 rounded-[28px] border border-slate-200 bg-slate-50 p-5">
                  {simulationResult ? (
                    <>
                      <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Projected outcome</p>
                      <p className="mt-2 text-4xl font-semibold text-slate-950">{simulationResult.risk}%</p>
                      <p className="mt-2 text-sm text-slate-600">{simulationResult.risk_summary}</p>
                      {result ? <p className="mt-3 text-sm font-medium text-emerald-700">Projected improvement: {(result.risk - simulationResult.risk).toFixed(2)} percentage points</p> : null}
                    </>
                  ) : <EmptyState text="Run a simulation to compare outcomes." />}
                </div>
              </Panel>
              </div>

              <Panel eyebrow="History" title="Recent assessment trend" description="The app remembers progress so users can revisit it weekly.">
                {history.length ? (
                  <div className="h-[320px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={history.map((item, index) => ({ name: `Run ${index + 1}`, risk: item.risk, wellness: item.wellness }))}>
                        <defs>
                          <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#fb7185" stopOpacity={0.55} />
                            <stop offset="95%" stopColor="#fb7185" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="wellnessGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.45} />
                            <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="name" tick={{ fill: "#475569" }} />
                        <YAxis tick={{ fill: "#475569" }} />
                        <Tooltip />
                        <Area type="monotone" dataKey="risk" stroke="#fb7185" fill="url(#riskGradient)" strokeWidth={3} />
                        <Area type="monotone" dataKey="wellness" stroke="#22c55e" fill="url(#wellnessGradient)" strokeWidth={3} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                ) : <EmptyState text="The last seven assessments will appear here." />}
              </Panel>
            </div>

            <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
              <div ref={chatRef}>
              <Panel eyebrow="Health Assistant" title="Small chatbot with Gemini-ready backend" description="Set GEMINI_API_KEY in Flask to use Gemini. Without it, the app falls back to local coaching responses.">
                <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-4">
                  <div className="max-h-[300px] space-y-3 overflow-auto pr-1">
                    {chatMessages.map((message, index) => (
                      <div key={`${message.role}-${index}`} className={`${message.role === "assistant" ? "bg-white text-slate-700" : "ml-auto bg-slate-950 text-white"} max-w-[92%] rounded-3xl px-4 py-3`}>
                        {message.badge ? <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">{message.badge}</div> : null}
                        <p className="text-sm leading-6">{message.content}</p>
                      </div>
                    ))}
                    {chatLoading ? <div className="rounded-3xl bg-white px-4 py-3 text-sm text-slate-500">Assistant is thinking...</div> : null}
                  </div>
                  <div className="mt-4 flex gap-3">
                    <input ref={chatInputRef} value={chatInput} onChange={(event) => setChatInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") sendMessage(); }} placeholder="Ask about your score, cholesterol, blood pressure, or next steps." className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none" />
                    <button onClick={() => sendMessage()} className="rounded-2xl bg-slate-950 px-4 py-3 font-semibold text-white">Send</button>
                  </div>
                </div>
                <div className="mt-4 rounded-[24px] border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-800">
                  Gemini key location: add `GEMINI_API_KEY` in the backend environment only. Never place it inside React.
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {quickQuestions.map((question) => (
                    <button key={question} onClick={() => sendMessage(question)} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700">
                      {question}
                    </button>
                  ))}
                </div>
              </Panel>
              </div>

              <Panel eyebrow="Trust & Guidance" title="More than 7 product features beyond prediction" description="The frontend now carries the product experience rather than acting like a thin wrapper over the model.">
                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    [<HeartPulse size={20} />, "Probability score", "Uses predict_proba instead of a blunt label."],
                    [<BrainCircuit size={20} />, "Feature explanations", "Shows top risk drivers and protective signals."],
                    [<TrendingDown size={20} />, "What-if simulator", "Lets users see projected improvement."],
                    [<Download size={20} />, "PDF export", "Creates a polished report for sharing or follow-up."],
                    [<CalendarCheck2 size={20} />, "Habit tracker", "Adds a reason to return daily."],
                    [<MessageCircleHeart size={20} />, "Gemini chat", "Answers questions in simple language."],
                    [<TrendingUp size={20} />, "Progress memory", "Stores recent trends locally."],
                    [<ShieldCheck size={20} />, "Safety prompts", "Keeps the product medically responsible."],
                  ].map(([icon, title, text]) => (
                    <div key={title} className="rounded-[24px] border border-slate-200 bg-white p-4">
                      <div className="inline-flex rounded-2xl bg-slate-950 p-3 text-white">{icon}</div>
                      <p className="mt-4 text-lg font-semibold text-slate-900">{title}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 overflow-hidden rounded-[32px] border border-slate-200 bg-slate-50">
                  <img src={lifestyleImage} alt="Healthy running routine that supports preventive heart care" className="h-56 w-full object-cover" />
                  <div className="grid gap-4 p-5 md:grid-cols-3">
                    {resourceCards.map((card) => (
                      <div key={card.title} className="rounded-[24px] bg-white p-4">
                        <p className="font-semibold text-slate-900">{card.title}</p>
                        <p className="mt-2 text-sm leading-6 text-slate-600">{card.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </Panel>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;
