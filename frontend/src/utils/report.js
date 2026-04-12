import { jsPDF } from "jspdf";

const line = (doc, text, x, y, options = {}) => {
  doc.setFont("helvetica", options.weight || "normal");
  doc.setFontSize(options.size || 11);
  doc.setTextColor(...(options.color || [22, 30, 46]));
  doc.text(text, x, y);
};

export const downloadHeartReport = ({ patient, result, simulation, history }) => {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const margin = 42;
  let y = 56;

  doc.setFillColor(11, 18, 32);
  doc.roundedRect(24, 24, 548, 92, 24, 24, "F");
  line(doc, "HeartWise Preventive Report", margin, y, { size: 22, weight: "bold", color: [255, 255, 255] });
  y += 24;
  line(
    doc,
    `Risk score: ${result.risk}%   |   Risk band: ${result.risk_level}   |   Wellness score: ${result.wellness_score}/100`,
    margin,
    y,
    { size: 11, color: [205, 217, 240] }
  );
  y += 18;
  line(doc, result.risk_summary, margin, y, { size: 11, color: [205, 217, 240] });

  y = 146;
  line(doc, "Assessment Snapshot", margin, y, { size: 15, weight: "bold" });
  y += 20;

  const details = [
    ["Age", patient.age],
    ["Sex", patient.sex === 1 ? "Male" : "Female"],
    ["Blood pressure", `${patient.trestbps} mm Hg`],
    ["Cholesterol", `${patient.chol} mg/dl`],
    ["Max heart rate", `${patient.thalach} bpm`],
    ["Exercise angina", patient.exang === 1 ? "Yes" : "No"],
  ];

  details.forEach(([label, value], index) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    const boxX = margin + col * 250;
    const boxY = y + row * 48;
    doc.setFillColor(244, 247, 251);
    doc.roundedRect(boxX, boxY, 220, 38, 12, 12, "F");
    line(doc, label, boxX + 12, boxY + 14, { size: 10, color: [95, 107, 128] });
    line(doc, String(value), boxX + 12, boxY + 28, { size: 12, weight: "bold" });
  });

  y += 160;
  line(doc, "Top Recommendations", margin, y, { size: 15, weight: "bold" });
  y += 18;

  result.recommendations.forEach((recommendation, index) => {
    line(doc, `${index + 1}. ${recommendation}`, margin, y, { size: 11 });
    y += 18;
  });

  y += 6;
  line(doc, "Risk Drivers", margin, y, { size: 15, weight: "bold" });
  y += 18;

  result.top_risk_drivers.forEach((driver) => {
    line(doc, `${driver.label}: ${driver.value}`, margin, y, { size: 11 });
    y += 16;
  });

  if (simulation) {
    y += 10;
    line(doc, "What-if Simulation", margin, y, { size: 15, weight: "bold" });
    y += 18;
    line(
      doc,
      `Projected risk after improvements: ${simulation.risk}% (${simulation.risk_level})`,
      margin,
      y,
      { size: 11 }
    );
    y += 16;
  }

  if (history?.length) {
    y += 10;
    line(doc, "Recent Trend", margin, y, { size: 15, weight: "bold" });
    y += 18;
    const recent = history.slice(-4);
    recent.forEach((item) => {
      line(doc, `${item.date}: ${item.risk}%`, margin, y, { size: 11 });
      y += 16;
    });
  }

  y += 12;
  line(
    doc,
    "Important: This report is educational and should not replace diagnosis or emergency care.",
    margin,
    y,
    { size: 10, color: [120, 67, 33] }
  );

  doc.save("heartwise-report.pdf");
};
