import os
import joblib
import pandas as pd
import streamlit as st

import features

st.set_page_config(
    page_title="AutoWorth AI",
    page_icon="🚗",
    layout="centered"
)

HERE = os.path.dirname(os.path.abspath(__file__))


@st.cache_resource
def load_model():
    path = os.path.join(HERE, "models", "autoworth_model.joblib")
    return joblib.load(path)


@st.cache_data
def load_options():
    path = os.path.join(HERE, "autoworth_clean.csv")
    df = pd.read_csv(path)

    models_by_make = (
        df.groupby("Make")["Model"]
        .unique()
        .apply(sorted)
        .to_dict()
    )

    medians = df.groupby(
        ["Make", "Model"]
    )[["EngineSize", "MPG", "Tax"]].median()

    transmissions = sorted(df["Transmission"].unique())
    fuels = sorted(df["FuelType"].unique())

    return df, models_by_make, medians, transmissions, fuels


model = load_model()
df, models_by_make, medians, transmissions, fuels = load_options()


st.title("🚗 AutoWorth AI")

st.caption(
    "Used-car price estimator and deal advisor — "
    "trained on 97,703 UK listings (test R² 0.972, MAE £1,023)"
)


c1, c2 = st.columns(2)

with c1:
    make = st.selectbox("Make", sorted(models_by_make))
    car_model = st.selectbox("Model", models_by_make[make])
    year = st.slider("Year", 1997, 2020, 2017)
    mileage = st.number_input(
        "Mileage", 0, 200_000, 30_000, step=1_000
    )

with c2:
    transmission = st.selectbox("Transmission", transmissions)
    fuel = st.selectbox("Fuel type", fuels)

    try:
        d = medians.loc[(make, car_model)]
        d_eng = float(d["EngineSize"])
        d_mpg = float(d["MPG"])
        d_tax = float(d["Tax"])
    except KeyError:
        d_eng, d_mpg, d_tax = 1.6, 50.0, 145.0

    engine = st.number_input(
        "Engine size (L)", 0.6, 6.6, d_eng, step=0.1
    )

    mpg = st.number_input(
        "MPG", 10.0, 140.0, d_mpg, step=0.1
    )

    tax = st.number_input(
        "Road tax (£/yr)", 0.0, 600.0, d_tax, step=5.0
    )


seller_price = st.number_input(
    "🏷️ Seller's asking price (£)",
    500, 100_000, 15_000, step=250
)


if st.button("Evaluate this deal", type="primary", use_container_width=True):

    car = pd.DataFrame([{
        "Make": make,
        "Model": car_model,
        "Year": year,
        "Transmission": transmission,
        "Mileage": mileage,
        "FuelType": fuel,
        "EngineSize": engine,
        "MPG": mpg,
        "Tax": tax
    }])

    est = float(model.predict(car)[0])

    diff = seller_price - est
    pct = 100 * diff / est

    if pct < -10:
        rating, colour, icon = "GREAT DEAL", "#1a7f37", "🟢"
    elif pct < -5:
        rating, colour, icon = "GOOD DEAL", "#2da44e", "🟢"
    elif pct <= 5:
        rating, colour, icon = "FAIR PRICE", "#bf8700", "🟡"
    elif pct <= 10:
        rating, colour, icon = "SLIGHTLY OVERPRICED", "#d1730a", "🟠"
    else:
        rating, colour, icon = "OVERPRICED", "#cf222e", "🔴"

    st.divider()

    m1, m2, m3 = st.columns(3)

    m1.metric("Estimated market price", f"£{est:,.0f}")
    m2.metric("Seller price", f"£{seller_price:,.0f}")
    m3.metric(
        "Difference",
        f"£{abs(diff):,.0f} {'more' if diff > 0 else 'cheaper'}",
        f"{pct:+.1f}%"
    )

    st.markdown(
        f"<div style='background:{colour};color:white;padding:18px;"
        f"border-radius:10px;text-align:center;font-size:24px;"
        f"font-weight:700'>{icon} {rating}</div>",
        unsafe_allow_html=True
    )

    if abs(diff) < 1023:
        st.warning(
            "This difference is within the model's typical error "
            "(MAE £1,023), so it may not be a real bargain."
        )

    if est > 40000:
        st.info(
            "For cars above £40,000, the model may under-predict because "
            "the dataset does not include trim or optional features."
        )


with st.expander("How the rating works"):
    st.markdown("""
    | Difference vs estimate | Rating |
    |---|---|
    | More than 10% cheaper | 🟢 Great Deal |
    | 5–10% cheaper | 🟢 Good Deal |
    | Within ±5% | 🟡 Fair Price |
    | 5–10% more expensive | 🟠 Slightly Overpriced |
    | More than 10% above | 🔴 Overpriced |
    """)