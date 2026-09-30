const pptxgen = require("pptxgenjs");

const NAVY = "1E2761";
const ICE = "CADCFC";
const WHITE = "FFFFFF";
const DARKTXT = "1B1F3B";
const MUTED = "5B6485";
const GREEN = "1A7F37";
const AMBER = "BF8700";
const RED = "CF222E";

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.3 x 7.5
const W = 13.33, H = 7.5;

function darkTitleSlide() {
  const s = pres.addSlide();
  s.background = { color: NAVY };
  return s;
}
function lightSlide(heading, sub) {
  const s = pres.addSlide();
  s.background = { color: WHITE };
  s.addText(heading, {
    x: 0.6, y: 0.45, w: W - 1.2, h: 0.7, fontFace: "Cambria", fontSize: 30,
    bold: true, color: NAVY, isTextBox: true, margin: 0,
  });
  if (sub) {
    s.addText(sub, {
      x: 0.6, y: 1.12, w: W - 1.2, h: 0.4, fontFace: "Calibri", fontSize: 14,
      color: MUTED, isTextBox: true, margin: 0,
    });
  }
  return s;
}
function pageNum(s, n) {
  s.addText(String(n), {
    x: W - 0.7, y: H - 0.5, w: 0.4, h: 0.3, fontFace: "Calibri", fontSize: 10,
    color: MUTED, align: "right", isTextBox: true, margin: 0,
  });
}

// ---------- 1. Title ----------
{
  const s = darkTitleSlide();
  s.addText("AutoWorth AI", {
    x: 0.9, y: 2.7, w: 10.5, h: 1.1, fontFace: "Cambria", fontSize: 48, bold: true,
    color: WHITE, isTextBox: true, margin: 0,
  });
  s.addText("Used Car Price Prediction & Smart Deal Advisor", {
    x: 0.9, y: 3.75, w: 10, h: 0.6, fontFace: "Calibri", fontSize: 20, color: ICE,
    isTextBox: true, margin: 0,
  });
  s.addText("Final Machine Learning Project  ·  Farah Emad\nComputer & Communications Engineering, Alexandria University", {
    x: 0.9, y: 6.4, w: 10, h: 0.7, fontFace: "Calibri", fontSize: 13, color: ICE,
    isTextBox: true, margin: 0, lineSpacingMultiple: 1.3,
  });
}

// ---------- 2. Problem & Pipeline ----------
{
  const s = lightSlide("The Problem", "A regression model that also tells you whether a deal is good");
  s.addText(
    [
      { text: "Given a used-car listing — make, model, year, mileage, transmission, fuel, engine size — ", options: { fontSize: 16, color: DARKTXT } },
      { text: "predict its fair market price", options: { fontSize: 16, color: NAVY, bold: true } },
      { text: ", then compare that estimate to the seller's asking price and rate the deal.", options: { fontSize: 16, color: DARKTXT } },
    ],
    { x: 0.6, y: 1.9, w: 7.0, h: 1.3, isTextBox: true, margin: 0, lineSpacingMultiple: 1.3 }
  );

  const stages = ["Combine", "Clean", "EDA", "Features", "Preprocess", "5 Models", "Tune", "Deal Advisor"];
  const boxW = 1.42, gap = 0.14, startX = 0.6, y = 4.5;
  stages.forEach((label, i) => {
    const x = startX + i * (boxW + gap);
    s.addShape(pres.ShapeType.roundRect, {
      x, y, w: boxW, h: 0.85, rectRadius: 0.08, fill: { color: i % 2 === 0 ? NAVY : "2E3A8C" },
      line: { color: NAVY, width: 0 },
    });
    s.addText(label, {
      x, y, w: boxW, h: 0.85, align: "center", valign: "middle", fontFace: "Calibri",
      fontSize: 11, bold: true, color: WHITE, isTextBox: true, margin: 0,
    });
    if (i < stages.length - 1) {
      s.addText("→", { x: x + boxW - 0.03, y: y + 0.22, w: gap + 0.3, h: 0.4, fontSize: 16, color: MUTED, isTextBox: true, margin: 0 });
    }
  });

  s.addText("Type: supervised regression  ·  Target: Price (GBP)  ·  Data: 100,000 UK Used Car Dataset (Kaggle)", {
    x: 0.6, y: 5.7, w: 11, h: 0.5, fontFace: "Calibri", fontSize: 13, italic: true, color: MUTED,
    isTextBox: true, margin: 0,
  });
  pageNum(s, 2);
}

// ---------- 3. The Data ----------
{
  const s = lightSlide("The Data", "Nine manufacturer files, deliberately not thirteen");
  const makes = [
    ["Audi", "10,668"], ["BMW", "10,781"], ["Ford", "17,965"], ["Hyundai", "4,860"],
    ["Mercedes", "13,119"], ["Skoda", "6,267"], ["Toyota", "6,738"], ["Vauxhall", "13,632"], ["Volkswagen", "15,157"],
  ];
  const cols = 3, cardW = 3.55, cardH = 0.62, gx = 0.15, gy = 0.15, startX = 0.6, startY = 1.85;
  makes.forEach(([name, rows], i) => {
    const col = i % cols, row = Math.floor(i / cols);
    const x = startX + col * (cardW + gx), y = startY + row * (cardH + gy);
    s.addShape(pres.ShapeType.roundRect, { x, y, w: cardW, h: cardH, rectRadius: 0.06, fill: { color: "F4F6FC" }, line: { color: ICE, width: 1 } });
    s.addText(name, { x: x + 0.15, y, w: 2.2, h: cardH, valign: "middle", fontFace: "Calibri", fontSize: 13, bold: true, color: NAVY, isTextBox: true, margin: 0 });
    s.addText(rows + " rows", { x: x + 1.9, y, w: cardW - 2.0, h: cardH, valign: "middle", align: "right", fontFace: "Calibri", fontSize: 13, color: MUTED, isTextBox: true, margin: 0 });
  });

  s.addText("99,187 rows total, before cleaning", {
    x: 0.6, y: startY + 3 * (cardH + gy) + 0.05, w: 8, h: 0.35, fontFace: "Calibri", fontSize: 12, italic: true, color: MUTED, isTextBox: true, margin: 0,
  });

  s.addShape(pres.ShapeType.roundRect, { x: 0.6, y: 5.75, w: 11.8, h: 1.35, rectRadius: 0.08, fill: { color: "FFF7E8" }, line: { color: "F0D9A8", width: 1 } });
  s.addText([
    { text: "Excluded on purpose: ", options: { bold: true, color: "8A5A00" } },
    { text: "cclass.csv / focus.csv are subsets already inside merc.csv / ford.csv — merging them risks the same car landing in both train and test (a leakage trap). unclean_cclass / unclean_focus are a separate cleaning exercise, not extra data.", options: { color: "5B4400" } },
  ], { x: 0.85, y: 5.85, w: 11.3, h: 1.15, fontFace: "Calibri", fontSize: 13, isTextBox: true, margin: 0, lineSpacingMultiple: 1.25 });
  pageNum(s, 3);
}

// ---------- 4. Data Cleaning ----------
{
  const s = lightSlide("Data Cleaning", "Investigate, don't just delete");
  const rows = [
    ["Duplicate rows", "1,475", "Drop", "Same listing scraped twice"],
    ["Year = 2060 / < 1997", "5", "Drop", "Typo, or too rare to teach a pattern"],
    ["EngineSize = 0", "273", "Impute (Make+Model median)", "Physically impossible — missingness in disguise"],
    ["MPG ≤ 10", "34", "Impute (Make+Model median)", "A 1.1 mpg car does not exist"],
    ["MPG > p99.5", "351", "Cap, not delete", "Real plug-in hybrids — WLTP quotes absurd figures"],
    ["Price < £500 / > p99.9", "4 / 98", "Drop / Cap", "Placeholder listings vs. genuine AMGs & M-cars"],
    ["Mileage > p99.9", "97", "Cap", "Same logic — keep the car, limit its leverage"],
    ["Tax = 0", "6,294", "Keep untouched", "Not an error — zero-rated EVs & pre-2017 low-emission cars"],
  ];
  const colX = [0.6, 4.35, 5.55, 8.05];
  const colW = [3.75, 1.2, 2.5, 3.7];
  const headers = ["Problem", "Count", "Decision", "Reasoning"];
  let y = 1.85;
  headers.forEach((h, i) => {
    s.addText(h, { x: colX[i], y, w: colW[i], h: 0.35, fontFace: "Calibri", fontSize: 12, bold: true, color: WHITE, fill: { color: NAVY }, align: i === 1 ? "center" : "left", valign: "middle", isTextBox: true, margin: 4 });
  });
  y += 0.35;
  const rowH = 0.535;
  rows.forEach((r, ri) => {
    const bg = ri % 2 === 0 ? "F4F6FC" : WHITE;
    r.forEach((val, ci) => {
      s.addText(val, {
        x: colX[ci], y, w: colW[ci], h: rowH, fontFace: "Calibri", fontSize: 10.5,
        color: DARKTXT, fill: { color: bg }, align: ci === 1 ? "center" : "left", valign: "middle",
        isTextBox: true, margin: 4,
      });
    });
    y += rowH;
  });
  s.addText("Result: 99,187 → 97,703 rows — only 1.50% removed", {
    x: 0.6, y: y + 0.1, w: 11, h: 0.4, fontFace: "Calibri", fontSize: 13, bold: true, color: NAVY, isTextBox: true, margin: 0,
  });
  pageNum(s, 4);
}

// ---------- 5. EDA ----------
{
  const s = lightSlide("What the Data Shows", "Two findings that decided the modelling approach");

  // Left card: price distribution / log transform
  s.addShape(pres.ShapeType.roundRect, { x: 0.6, y: 1.85, w: 5.75, h: 4.9, rectRadius: 0.08, fill: { color: "F4F6FC" }, line: { color: ICE, width: 1 } });
  s.addText("1 · Price is right-skewed", { x: 0.9, y: 2.05, w: 5.2, h: 0.4, fontFace: "Calibri", fontSize: 15, bold: true, color: NAVY, isTextBox: true, margin: 0 });
  s.addChart(pres.ChartType.bar, [{
    name: "Skew",
    labels: ["Raw price", "log(price)"],
    values: [1.90, -0.08],
  }], {
    x: 0.9, y: 2.55, w: 5.2, h: 2.1, chartColors: [NAVY], showTitle: false, showLegend: false,
    showValue: true, dataLabelPosition: "outEnd", dataLabelColor: DARKTXT, dataLabelFontSize: 11,
    dataLabelFormatCode: "0.00",
    catAxisLabelColor: MUTED, valAxisLabelColor: MUTED, valAxisHidden: true,
    catGridLine: { style: "none" }, valGridLine: { style: "none" }, barDir: "col",
  });
  s.addText("Median £14,472 vs mean £16,749. Training on log(Price) makes the model optimise relative error — exactly what a deal advisor needs.", {
    x: 0.9, y: 4.85, w: 5.2, h: 1.75, fontFace: "Calibri", fontSize: 12.5, color: DARKTXT, isTextBox: true, margin: 0, lineSpacingMultiple: 1.3,
  });

  // Right card: depreciation interacts with brand
  s.addShape(pres.ShapeType.roundRect, { x: 6.6, y: 1.85, w: 6.1, h: 4.9, rectRadius: 0.08, fill: { color: "F4F6FC" }, line: { color: ICE, width: 1 } });
  s.addText("2 · Age interacts with brand", { x: 6.9, y: 2.05, w: 5.5, h: 0.4, fontFace: "Calibri", fontSize: 15, bold: true, color: NAVY, isTextBox: true, margin: 0 });
  s.addChart(pres.ChartType.line, [
    { name: "Mercedes", labels: ["0", "4", "8", "12"], values: [45000, 27000, 16000, 9500] },
    { name: "Ford", labels: ["0", "4", "8", "12"], values: [19000, 12000, 7500, 5000] },
  ], {
    x: 6.9, y: 2.55, w: 5.5, h: 2.5, chartColors: [NAVY, "97BC62"], showTitle: false,
    showLegend: true, legendPos: "b", legendColor: DARKTXT, legendFontSize: 10,
    catAxisLabelColor: MUTED, valAxisLabelColor: MUTED, valAxisLabelFormatCode: "£#,##0",
    catGridLine: { style: "none" }, valGridLine: { color: "E3E7F5", size: 1 }, lineSize: 2.5, lineDataSymbol: "circle",
  });
  s.addText("Premium brands start higher and shed more absolute value per year — the curves aren't parallel. A linear model can't express that; tree ensembles split on Make, then age, for free.", {
    x: 6.9, y: 5.3, w: 5.5, h: 1.3, fontFace: "Calibri", fontSize: 12.5, color: DARKTXT, isTextBox: true, margin: 0, lineSpacingMultiple: 1.3,
  });
  pageNum(s, 5);
}

// ---------- 6. Feature Engineering ----------
{
  const s = lightSlide("Feature Engineering", "Four new features — all row-wise, all leak-free");
  const feats = [
    ["1", "CarAge", "2021 − Year", "2021 chosen since listings were scraped in early 2021; guarantees CarAge ≥ 1, handling the divide-by-zero structurally."],
    ["2", "MileagePerYear", "Mileage / CarAge", "Age and mileage correlate at −0.75; their ratio isolates usage intensity neither column carries alone."],
    ["3", "PowerProxy", "EngineSize / MPG", "No horsepower column exists — displacement per unit of economy approximates performance."],
    ["4", "IsPremium", "Make ∈ {Audi, BMW, Mercedes}", "A 2.2× median-price gap over Vauxhall; gives Linear Regression an explicit brand-tier term."],
  ];
  const cardW = 5.75, cardH = 2.3, gx = 0.3, gy = 0.3, startX = 0.6, startY = 1.85;
  feats.forEach((f, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = startX + col * (cardW + gx), y = startY + row * (cardH + gy);
    s.addShape(pres.ShapeType.roundRect, { x, y, w: cardW, h: cardH, rectRadius: 0.08, fill: { color: "F4F6FC" }, line: { color: ICE, width: 1 } });
    s.addShape(pres.ShapeType.ellipse, { x: x + 0.25, y: y + 0.25, w: 0.55, h: 0.55, fill: { color: NAVY }, line: { color: NAVY, width: 0 } });
    s.addText(f[0], { x: x + 0.25, y: y + 0.25, w: 0.55, h: 0.55, align: "center", valign: "middle", fontFace: "Cambria", fontSize: 20, bold: true, color: WHITE, isTextBox: true, margin: 0 });
    s.addText(f[1], { x: x + 0.95, y: y + 0.22, w: cardW - 1.2, h: 0.35, fontFace: "Calibri", fontSize: 15, bold: true, color: NAVY, isTextBox: true, margin: 0 });
    s.addText(f[2], { x: x + 0.95, y: y + 0.55, w: cardW - 1.2, h: 0.3, fontFace: "Courier New", fontSize: 11, color: MUTED, isTextBox: true, margin: 0 });
    s.addText(f[3], { x: x + 0.25, y: y + 1.0, w: cardW - 0.5, h: cardH - 1.15, fontFace: "Calibri", fontSize: 11.5, color: DARKTXT, isTextBox: true, margin: 0, lineSpacingMultiple: 1.25 });
  });
  pageNum(s, 6);
}

// ---------- 7. Leak-free preprocessing ----------
{
  const s = lightSlide("Leak-Free Preprocessing", "Split first, fit only on train, wrap everything in one Pipeline");

  const splits = [["Train", "68,392", "70%", NAVY], ["Validation", "14,655", "15%", "2E3A8C"], ["Test", "14,656", "15%", "5B6485"]];
  let x = 0.6;
  const totalW = 11.8, gap = 0.2;
  const widths = [totalW * 0.7 - gap, totalW * 0.15 - gap, totalW * 0.15];
  splits.forEach(([label, n, pct, color], i) => {
    const w = widths[i];
    s.addShape(pres.ShapeType.roundRect, { x, y: 1.85, w, h: 1.1, rectRadius: 0.06, fill: { color } });
    s.addText(`${label}\n${n} rows (${pct})`, { x, y: 1.85, w, h: 1.1, align: "center", valign: "middle", fontFace: "Calibri", fontSize: 13, bold: true, color: WHITE, isTextBox: true, margin: 0, lineSpacingMultiple: 1.2 });
    x += w + gap;
  });
  s.addText("Test set untouched until the final model is chosen.", { x: 0.6, y: 3.05, w: 11, h: 0.35, fontFace: "Calibri", fontSize: 12, italic: true, color: MUTED, isTextBox: true, margin: 0 });

  const steps = [
    ["Numerical", "Year, Mileage, EngineSize, MPG, Tax + 4 engineered → median impute → StandardScaler"],
    ["Categorical", "Make, Model, Transmission, FuelType → most-frequent impute → OneHotEncoder(handle_unknown=\"ignore\")"],
    ["Target", "TransformedTargetRegressor(log, exp) — train in log-space, predict() still returns pounds"],
  ];
  let y = 3.65;
  steps.forEach(([label, desc]) => {
    s.addShape(pres.ShapeType.roundRect, { x: 0.6, y, w: 11.8, h: 0.85, rectRadius: 0.06, fill: { color: "F4F6FC" }, line: { color: ICE, width: 1 } });
    s.addText(label, { x: 0.85, y, w: 2.0, h: 0.85, valign: "middle", fontFace: "Calibri", fontSize: 13, bold: true, color: NAVY, isTextBox: true, margin: 0 });
    s.addText(desc, { x: 2.9, y, w: 9.3, h: 0.85, valign: "middle", fontFace: "Calibri", fontSize: 12, color: DARKTXT, isTextBox: true, margin: 0 });
    y += 1.0;
  });
  s.addText("Imputer medians, scaler means, and the one-hot vocabulary are all fit on training rows only — leakage becomes structurally impossible.", {
    x: 0.6, y: y + 0.05, w: 11.8, h: 0.5, fontFace: "Calibri", fontSize: 12, italic: true, color: MUTED, isTextBox: true, margin: 0,
  });
  pageNum(s, 7);
}

// ---------- 8. Model comparison ----------
{
  const s = lightSlide("Comparing Five Models", "Validation set, 14,655 rows");
  const labels = ["Linear\nRegression", "Decision\nTree", "Gradient\nBoosting", "Random\nForest", "XGBoost"];
  const r2 = [0.9325, 0.9424, 0.9504, 0.9645, 0.9650];
  const mae = [1588, 1437, 1380, 1145, 1161];

  s.addText("Validation R²", { x: 0.6, y: 1.8, w: 5.6, h: 0.35, fontFace: "Calibri", fontSize: 13, bold: true, color: NAVY, isTextBox: true, margin: 0 });
  s.addChart(pres.ChartType.bar, [{ name: "R²", labels, values: r2 }], {
    x: 0.6, y: 2.15, w: 5.9, h: 4.6, barDir: "col", chartColors: [NAVY],
    showTitle: false, showLegend: false, showValue: true, dataLabelPosition: "outEnd",
    dataLabelFormatCode: "0.0000", dataLabelFontSize: 10, dataLabelColor: DARKTXT,
    catAxisLabelColor: MUTED, catAxisLabelFontSize: 10, valAxisHidden: true,
    catGridLine: { style: "none" }, valGridLine: { style: "none" }, valAxisMinVal: 0.9,
  });

  s.addText("Validation MAE (£)", { x: 6.8, y: 1.8, w: 5.6, h: 0.35, fontFace: "Calibri", fontSize: 13, bold: true, color: NAVY, isTextBox: true, margin: 0 });
  s.addChart(pres.ChartType.bar, [{ name: "MAE", labels, values: mae }], {
    x: 6.8, y: 2.15, w: 5.9, h: 4.6, barDir: "col", chartColors: ["97BC62"],
    showTitle: false, showLegend: false, showValue: true, dataLabelPosition: "outEnd",
    dataLabelFormatCode: "£#,##0", dataLabelFontSize: 10, dataLabelColor: DARKTXT,
    catAxisLabelColor: MUTED, catAxisLabelFontSize: 10, valAxisHidden: true,
    catGridLine: { style: "none" }, valGridLine: { style: "none" },
  });
  pageNum(s, 8);
}

// ---------- 9. Overfitting & selection ----------
{
  const s = lightSlide("Overfitting Check", "Train vs. validation R² — the gap tells the real story");
  const labels = ["Decision\nTree", "Random\nForest", "XGBoost", "Gradient\nBoosting", "Linear\nRegression"];
  const trainR2 = [0.9996, 0.9934, 0.9711, 0.9534, 0.9276];
  const valR2 = [0.9424, 0.9645, 0.9650, 0.9504, 0.9325];
  s.addChart(pres.ChartType.bar, [
    { name: "Train R²", labels, values: trainR2 },
    { name: "Validation R²", labels, values: valR2 },
  ], {
    x: 0.6, y: 1.85, w: 11.8, h: 4.1, barDir: "col", barGrouping: "clustered",
    chartColors: [ICE, NAVY], showTitle: false, showLegend: true, legendPos: "t", legendColor: DARKTXT,
    catAxisLabelColor: MUTED, valAxisLabelColor: MUTED, valAxisMinVal: 0.9,
    catGridLine: { style: "none" }, valGridLine: { color: "E3E7F5", size: 1 },
  });
  s.addText([
    { text: "Decision Tree memorises training data (gap +0.057). ", options: { color: DARKTXT } },
    { text: "XGBoost generalises best of the strong models", options: { bold: true, color: NAVY } },
    { text: " — same validation accuracy as Random Forest with a gap 4× smaller, and ~10× faster to fit. Taken forward for tuning.", options: { color: DARKTXT } },
  ], { x: 0.6, y: 6.15, w: 11.8, h: 0.9, fontFace: "Calibri", fontSize: 13, isTextBox: true, margin: 0, lineSpacingMultiple: 1.3 });
  pageNum(s, 9);
}

// ---------- 10. Tuning ----------
{
  const s = lightSlide("Tuning the Final Model", "RandomizedSearchCV — 12 candidates × 3 folds = 36 fits");
  const metrics = [
    ["R²", "0.9650", "0.9698", "+0.0048"],
    ["MAE", "£1,161", "£1,055", "−£106 (9.1%)"],
    ["RMSE", "£1,832", "£1,701", "−£131"],
  ];
  let x = 0.6;
  const cw = 3.75, gap = 0.2;
  metrics.forEach(([label, before, after, delta]) => {
    s.addShape(pres.ShapeType.roundRect, { x, y: 1.9, w: cw, h: 2.3, rectRadius: 0.08, fill: { color: "F4F6FC" }, line: { color: ICE, width: 1 } });
    s.addText(label, { x, y: 2.05, w: cw, h: 0.4, align: "center", fontFace: "Calibri", fontSize: 14, bold: true, color: NAVY, isTextBox: true, margin: 0 });
    s.addText([
      { text: before, options: { fontSize: 20, color: MUTED, strike: true } },
      { text: "  →  ", options: { fontSize: 20, color: MUTED } },
      { text: after, options: { fontSize: 24, color: NAVY, bold: true } },
    ], { x, y: 2.55, w: cw, h: 0.7, align: "center", fontFace: "Calibri", isTextBox: true, margin: 0 });
    s.addText(delta, { x, y: 3.3, w: cw, h: 0.5, align: "center", fontFace: "Calibri", fontSize: 15, bold: true, color: "1A7F37", isTextBox: true, margin: 0 });
    x += cw + gap;
  });

  s.addShape(pres.ShapeType.roundRect, { x: 0.6, y: 4.55, w: 11.8, h: 1.9, rectRadius: 0.08, fill: { color: NAVY } });
  s.addText("Best parameters found", { x: 0.9, y: 4.75, w: 11, h: 0.35, fontFace: "Calibri", fontSize: 13, bold: true, color: ICE, isTextBox: true, margin: 0 });
  s.addText("n_estimators=1061   max_depth=8   learning_rate=0.134   subsample=0.917\ncolsample_bytree=0.623   min_child_weight=3   reg_lambda=0.726", {
    x: 0.9, y: 5.15, w: 11, h: 1.1, fontFace: "Courier New", fontSize: 14, color: WHITE, isTextBox: true, margin: 0, lineSpacingMultiple: 1.5,
  });
  pageNum(s, 10);
}

// ---------- 11. Final results ----------
{
  const s = darkTitleSlide();
  s.addText("Final Test Results", { x: 0.9, y: 0.6, w: 11, h: 0.7, fontFace: "Cambria", fontSize: 30, bold: true, color: WHITE, isTextBox: true, margin: 0 });
  s.addText("14,656 untouched rows — never seen until this evaluation", { x: 0.9, y: 1.3, w: 11, h: 0.4, fontFace: "Calibri", fontSize: 14, color: ICE, isTextBox: true, margin: 0 });

  const stats = [["0.9717", "R²"], ["£1,020", "MAE"], ["£1,616", "RMSE"], ["6.38%", "MAPE"]];
  const cw = 2.75, gap = 0.25, startX = 0.9;
  stats.forEach(([val, label], i) => {
    const x = startX + i * (cw + gap);
    s.addShape(pres.ShapeType.roundRect, { x, y: 2.2, w: cw, h: 2.1, rectRadius: 0.1, fill: { color: "2E3A8C" } });
    s.addText(val, { x, y: 2.4, w: cw, h: 1.1, align: "center", fontFace: "Cambria", fontSize: 40, bold: true, color: WHITE, isTextBox: true, margin: 0 });
    s.addText(label, { x, y: 3.55, w: cw, h: 0.5, align: "center", fontFace: "Calibri", fontSize: 15, color: ICE, isTextBox: true, margin: 0 });
  });

  s.addText("Comfortably past the R² > 0.90 target. Test R² lands above validation (0.9698) because the final model was refit on train+validation — 20% more data — not because of leakage.", {
    x: 0.9, y: 4.7, w: 11, h: 0.7, fontFace: "Calibri", fontSize: 13, color: ICE, isTextBox: true, margin: 0, lineSpacingMultiple: 1.3,
  });
  s.addText("RMSE (£1,616) is 58% larger than MAE (£1,020) — most predictions are good, and a minority are badly wrong. Next: which ones, and why.", {
    x: 0.9, y: 5.5, w: 11, h: 0.7, fontFace: "Calibri", fontSize: 13, color: ICE, isTextBox: true, margin: 0, lineSpacingMultiple: 1.3,
  });
  pageNum(s, 11);
}

// ---------- 12. Feature importance ----------
{
  const s = lightSlide("What Actually Drives Price", "Permutation importance — R² drop when a column is shuffled");
  const labels = ["EngineSize", "Year", "Make", "MPG", "Model", "Mileage", "Transmission", "FuelType", "Tax"];
  const values = [0.240, 0.228, 0.157, 0.156, 0.099, 0.078, 0.074, 0.017, 0.006];
  s.addChart(pres.ChartType.bar, [{ name: "R² drop", labels, values }], {
    x: 0.6, y: 1.85, w: 7.3, h: 4.9, barDir: "bar", chartColors: [NAVY],
    showTitle: false, showLegend: false, showValue: true, dataLabelPosition: "outEnd",
    dataLabelFormatCode: "0.000", dataLabelFontSize: 11, dataLabelColor: DARKTXT,
    catAxisLabelColor: DARKTXT, catAxisLabelFontSize: 12, valAxisHidden: true,
    catGridLine: { style: "none" }, valGridLine: { style: "none" },
  });
  s.addText([
    { text: "Engine size and year dominate", options: { bold: true, color: NAVY } },
    { text: " (0.240, 0.228). Brand (Make+Model ≈ 0.256) beats mileage (0.078) — two cars of the same year tend to have similar mileage, so once the model knows the year, mileage adds less than intuition suggests.\n\n", options: { color: DARKTXT } },
    { text: "Gain importance disagreed sharply", options: { bold: true, color: NAVY } },
    { text: " — it ranked Mileage at 0.003 and EngineSize sixth, both wrong. Correlated features make the default feature_importances_ actively misleading; permutation importance is the trustworthy answer.", options: { color: DARKTXT } },
  ], { x: 8.2, y: 2.0, w: 4.5, h: 4.6, fontFace: "Calibri", fontSize: 13, isTextBox: true, margin: 0, lineSpacingMultiple: 1.3 });
  pageNum(s, 12);
}

// ---------- 13. Error analysis ----------
{
  const s = lightSlide("Where the Model Fails — and Why", "Honest limits, found by inspecting the ten largest errors");
  const cards = [
    ["Missing trim/spec data", "8 of 10 worst errors are specced-up premium cars, under-predicted 24–41%. A base and an M-Sport 4 Series are the same row — no algorithm can recover information the dataset doesn't contain."],
    ["Rare trim × drivetrain", "Two 2019 Mercedes S-Class Hybrids are over-predicted by 28–33% — too few comparable rows, so the model falls back to the dominant petrol/diesel price level."],
    ["Outside the fleet's age range", "A 1998 Toyota Land Cruiser (100k miles) is predicted at −77%: 23 years old, priced by a collector market that ordinary depreciation features don't capture."],
  ];
  const cardW = 3.75, gap = 0.25, startX = 0.6, y = 1.9, cardH = 3.4;
  cards.forEach(([title, body], i) => {
    const x = startX + i * (cardW + gap);
    s.addShape(pres.ShapeType.roundRect, { x, y, w: cardW, h: cardH, rectRadius: 0.08, fill: { color: "F4F6FC" }, line: { color: ICE, width: 1 } });
    s.addText(String(i + 1), { x: x + 0.25, y: y + 0.2, w: 0.6, h: 0.6, fontFace: "Cambria", fontSize: 26, bold: true, color: ICE, isTextBox: true, margin: 0 });
    s.addText(title, { x: x + 0.25, y: y + 0.85, w: cardW - 0.5, h: 0.7, fontFace: "Calibri", fontSize: 14.5, bold: true, color: NAVY, isTextBox: true, margin: 0, lineSpacingMultiple: 1.15 });
    s.addText(body, { x: x + 0.25, y: y + 1.55, w: cardW - 0.5, h: cardH - 1.7, fontFace: "Calibri", fontSize: 11.5, color: DARKTXT, isTextBox: true, margin: 0, lineSpacingMultiple: 1.3 });
  });
  s.addText("Relative error is actually highest on the cheapest cars (5.6% under £10k) and lowest on the most expensive (4.4% over £50k) — the opposite of what the residual plot suggests at a glance, because the same absolute pound error matters far less as a percentage of a higher price.", {
    x: 0.6, y: 5.55, w: 11.8, h: 0.9, fontFace: "Calibri", fontSize: 12.5, italic: true, color: MUTED, isTextBox: true, margin: 0, lineSpacingMultiple: 1.3,
  });
  pageNum(s, 13);
}

// ---------- 14. Smart Deal Advisor ----------
{
  const s = lightSlide("The Smart Deal Advisor", "Compare the estimate to the asking price, rate the gap");
  const bands = [
    ["> 10% cheaper", "GREAT DEAL", GREEN],
    ["5–10% cheaper", "GOOD DEAL", GREEN],
    ["within ±5%", "FAIR PRICE", AMBER],
    ["5–10% pricier", "SLIGHTLY OVERPRICED", "D1730A"],
    ["> 10% pricier", "OVERPRICED", RED],
  ];
  const rowH = 0.62, startY = 1.9;
  bands.forEach(([range, rating, color], i) => {
    const y = startY + i * (rowH + 0.1);
    s.addShape(pres.ShapeType.roundRect, { x: 0.6, y, w: 6.6, h: rowH, rectRadius: 0.06, fill: { color: "F4F6FC" } });
    s.addText(range, { x: 0.85, y, w: 3.0, h: rowH, valign: "middle", fontFace: "Calibri", fontSize: 13, color: DARKTXT, isTextBox: true, margin: 0 });
    s.addShape(pres.ShapeType.roundRect, { x: 4.0, y: y + 0.06, w: 3.05, h: rowH - 0.12, rectRadius: 0.05, fill: { color } });
    s.addText(rating, { x: 4.0, y: y + 0.06, w: 3.05, h: rowH - 0.12, align: "center", valign: "middle", fontFace: "Calibri", fontSize: 12, bold: true, color: WHITE, isTextBox: true, margin: 0 });
  });

  s.addShape(pres.ShapeType.roundRect, { x: 7.6, y: 1.9, w: 4.8, h: 3.5, rectRadius: 0.08, fill: { color: NAVY } });
  s.addText("Worked example — 2016 Audi A4", { x: 7.9, y: 2.1, w: 4.2, h: 0.4, fontFace: "Calibri", fontSize: 13, bold: true, color: ICE, isTextBox: true, margin: 0 });
  s.addText("Estimated: £16,000", { x: 7.9, y: 2.6, w: 4.2, h: 0.4, fontFace: "Calibri", fontSize: 14, color: WHITE, isTextBox: true, margin: 0 });
  const worked = [["£14,190", "−11.3%", "GREAT DEAL"], ["£18,030", "+12.7%", "OVERPRICED"]];
  worked.forEach(([ask, pct, rating], i) => {
    s.addText(`Asking ${ask}  (${pct})  →  ${rating}`, {
      x: 7.9, y: 3.15 + i * 0.5, w: 4.4, h: 0.4, fontFace: "Calibri", fontSize: 12.5, color: ICE, isTextBox: true, margin: 0,
    });
  });
  s.addText("A single 5% flag sits inside the model's own ±6.4% typical error — the advisor surfaces that honestly rather than projecting false confidence.", {
    x: 7.9, y: 4.25, w: 4.2, h: 1.1, fontFace: "Calibri", fontSize: 11, italic: true, color: ICE, isTextBox: true, margin: 0, lineSpacingMultiple: 1.3,
  });

  s.addText("Deployed as a Streamlit app (app.py) — loads the pickled pipeline directly, so feature engineering, scaling, encoding and the log-inverse never need to be duplicated in the app.", {
    x: 0.6, y: 6.0, w: 11.8, h: 0.6, fontFace: "Calibri", fontSize: 12, color: MUTED, isTextBox: true, margin: 0, lineSpacingMultiple: 1.25,
  });
  pageNum(s, 14);
}

// ---------- 15. Conclusions ----------
{
  const s = darkTitleSlide();
  s.addText("Conclusions & What's Next", { x: 0.9, y: 0.6, w: 11, h: 0.7, fontFace: "Cambria", fontSize: 30, bold: true, color: WHITE, isTextBox: true, margin: 0 });

  s.addText("What worked", { x: 0.9, y: 1.6, w: 5.6, h: 0.4, fontFace: "Calibri", fontSize: 15, bold: true, color: ICE, isTextBox: true, margin: 0 });
  const worked = [
    "Log-target transform mattered more than model choice — it changed what the model optimises, not just how well.",
    "XGBoost: best generalisation, ~10x faster than Random Forest, cheapest to tune.",
    "Leak-free pipeline: every fitted step lives inside sklearn's Pipeline, trained on the split only.",
  ];
  s.addText(worked.map((t) => ({ text: t, options: { bullet: { code: "2022" }, breakLine: true, color: WHITE, paraSpaceAfter: 10 } })), {
    x: 0.9, y: 2.05, w: 5.6, h: 3.0, fontFace: "Calibri", fontSize: 13, isTextBox: true, margin: 0,
  });

  s.addText("What I'd do next", { x: 6.9, y: 1.6, w: 5.6, h: 0.4, fontFace: "Calibri", fontSize: 15, bold: true, color: ICE, isTextBox: true, margin: 0 });
  const next = [
    "Add a trim/spec column — the single largest remaining error source.",
    "Give rare trim x drivetrain combinations (e.g. hybrid variants) more training signal.",
    "Time-aware validation: train on older listings, validate on newer ones, since market prices drift.",
  ];
  s.addText(next.map((t) => ({ text: t, options: { bullet: { code: "2022" }, breakLine: true, color: WHITE, paraSpaceAfter: 10 } })), {
    x: 6.9, y: 2.05, w: 5.6, h: 3.0, fontFace: "Calibri", fontSize: 13, isTextBox: true, margin: 0,
  });

  s.addShape(pres.ShapeType.roundRect, { x: 0.9, y: 5.3, w: 11.5, h: 1.4, rectRadius: 0.1, fill: { color: "2E3A8C" } });
  s.addText([
    { text: "R² 0.9717   MAE £1,020   RMSE £1,616   MAPE 6.38%", options: { fontSize: 20, bold: true, color: WHITE } },
  ], { x: 0.9, y: 5.55, w: 11.5, h: 0.5, align: "center", fontFace: "Cambria", isTextBox: true, margin: 0 });
  s.addText("Full pipeline, Streamlit app & notebook in the project's GitHub repository", {
    x: 0.9, y: 6.1, w: 11.5, h: 0.4, align: "center", fontFace: "Calibri", fontSize: 12, color: ICE, isTextBox: true, margin: 0,
  });
  pageNum(s, 15);
}

pres.writeFile({ fileName: "AutoWorth_AI.pptx" }).then(() => console.log("wrote AutoWorth_AI.pptx"));
