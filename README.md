# 🚗 AutoWorth AI — Used Car Price & Deal Advisor

Final Machine Learning project · Farah Emad · Computer & Communications Engineering, Alexandria University

Predicts the fair market price of a used UK car and rates whether a seller's asking price is a good
deal, using a tuned XGBoost model trained on ~98k listings from nine manufacturers.

| Metric (untouched test set, 14,656 rows) | Value |
|---|---|
| R² | **0.9717** |
| MAE | **£1,020** |
| RMSE | **£1,616** |
| MAPE | **6.38%** |

## Project structure

```
final project/
├── finalproject.ipynb       # full pipeline: clean -> EDA -> features -> models -> tuning -> advisor
├── features.py               # shared feature engineering, imported by the notebook and the app
├── app.py                    # Streamlit deal advisor
├── audi.csv, bmw.csv, ford.csv, hyundi.csv, merc.csv,
│   skoda.csv, toyota.csv, vauxhall.csv, vw.csv   # the 9 raw manufacturer CSVs
├── autoworth_clean.csv       # cleaned, combined dataset (written by the notebook)
├── models/autoworth_model.joblib  # trained pipeline (preprocessing + XGBoost), written by the notebook
└── presentation/             # slide deck summarising the project
```

## Pipeline

Raw CSVs → Combine → Clean → EDA → Split (70/15/15) → Feature Engineering → Preprocessing →
5 Models → Evaluate & Learning Curves → Tune → Final Model → Deal Advisor → Streamlit App

Everything that learns from data (imputer medians, scaler means, the one-hot vocabulary) lives
**inside** an sklearn `Pipeline`, fit only on the training split, so leakage into validation/test is
structurally impossible rather than something to remember. The target is trained in log-space via
`TransformedTargetRegressor`, since price is strongly right-skewed.

## Data

[100,000 UK Used Car Dataset](https://www.kaggle.com/datasets/adityadesai13/used-car-dataset-ford-and-mercedes)
(Kaggle). Only the nine standard-schema manufacturer files are used — `cclass.csv`/`focus.csv` are
excluded because they are subsets already contained in `merc.csv`/`ford.csv` (merging them would let
the same car land in both train and test), and the `unclean_*.csv` files are a separate cleaning
exercise, not additional data.

## Models compared

Linear Regression, Decision Tree, Random Forest, Gradient Boosting, XGBoost (tuned via
`RandomizedSearchCV`). XGBoost was selected: tied with Random Forest on validation accuracy, but with
a much smaller train/validation gap (better generalisation) and ~10× faster to fit — which matters
once hyperparameter search multiplies the fit count by 36. Learning curves (train vs. cross-validation
R² as training size grows) confirm the pattern: the single Decision Tree overfits clearly, Random
Forest still has room to improve with more data, and Gradient Boosting/XGBoost already generalise well.

## What drives price (permutation importance)

Engine size (0.240 drop in R² when shuffled) and registration year (0.228) dominate, followed by
brand (`Make` + `Model` ≈ 0.256 combined) and MPG (0.156, an inverse performance proxy). Mileage
matters less than intuition suggests (0.078) because it is highly correlated with year. Full
discussion, including where gain importance and permutation importance disagree, is in the notebook.

## Smart Deal Advisor

Compares the model's estimate to the seller's asking price:

| Difference vs estimate | Rating |
|---|---|
| more than 10% cheaper | 🟢 Great Deal |
| 5–10% cheaper | 🟢 Good Deal |
| within ±5% | 🟡 Fair Price |
| 5–10% more expensive | 🟠 Slightly Overpriced |
| more than 10% above | 🔴 Overpriced |

## Running it

```bash
python3 -m venv .venv && source .venv/bin/activate
pip install pandas numpy scikit-learn xgboost scipy joblib streamlit

# 1. (optional) regenerate autoworth_clean.csv and models/autoworth_model.joblib
jupyter nbconvert --to notebook --execute finalproject.ipynb --output finalproject.ipynb

# 2. run the app (needs autoworth_clean.csv and models/autoworth_model.joblib to already exist)
streamlit run app.py
```

The repo ships with `autoworth_clean.csv` and `models/autoworth_model.joblib` already built, so
step 2 works on its own without re-running the notebook.

## Notes on this repo

The feature-engineering function (`add_features`) lives in `features.py` at the repo root, imported by
both the notebook and `app.py`. This matters because the trained model is a pickled scikit-learn
pipeline that includes a `FunctionTransformer(add_features)` step — the pickle stores a reference to
`features.add_features`, not the function's code, so it must be importable from that same path
wherever the model is loaded. Defining the function inline in the notebook instead (as an early draft
of this project did) breaks `app.py`, which loads the model in a different process.
