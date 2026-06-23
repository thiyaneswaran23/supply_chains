import os
import numpy as np
import pandas as pd
import joblib
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestClassifier

# Ensure path directories exist safely
MODEL_DIR = os.path.join(os.path.dirname(__file__), "models")
os.makedirs(MODEL_DIR, exist_ok=True)

def train_and_serialize_models():
    print("🚀 Initializing Production ML Model Training Pipeline...")

    # --- 1. TRAIN DEMAND MODEL (Time-Series Regression Linear Trends) ---
    # Simulating standard growth sales patterns over a 24-month horizon
    time_indices = np.arange(24).reshape(-1, 1)
    # Target trend formula with a bit of random variation
    simulated_sales = 100 + (time_indices.flatten() * 4.5) + np.random.normal(0, 5, 24)

    demand_model = LinearRegression()
    demand_model.fit(time_indices, simulated_sales)
    
    joblib.dump(demand_model, os.path.join(MODEL_DIR, "demand_model.pkl"))
    print("💾 Demand Forecasting Model serialized into /models/demand_model.pkl")

    # --- 2. TRAIN TRANSIT DELAY MODEL (Random Forest Multi-Feature Classification) ---
    # Generate mock shipment histories to teach the model how distance and transport mode impact delays
    np.random.seed(42)
    sample_size = 500
    
    distances = np.random.randint(50, 2000, sample_size)
    modes = np.random.randint(0, 4, sample_size) # 0:ROAD, 1:RAIL, 2:SEA, 3:AIR
    
    # Generate ground-truth labels: high distances + road/sea travel = high chance of delay (1)
    delay_score = (distances * 0.0003) + (modes == 0) * 0.25 + (modes == 2) * 0.40 + np.random.normal(0, 0.1, sample_size)
    is_delayed = (delay_score > 0.5).astype(int)

    X_transit = np.column_stack((distances, modes))
    y_transit = is_delayed

    delay_model = RandomForestClassifier(n_estimators=50, max_depth=5, random_state=42)
    delay_model.fit(X_transit, y_transit)

    joblib.dump(delay_model, os.path.join(MODEL_DIR, "delay_model.pkl"))
    print("💾 Logistics Transit Delay Model serialized into /models/delay_model.pkl")
    print("✨ ML pipeline training successfully complete!")

if __name__ == "__main__":
    train_and_serialize_models()