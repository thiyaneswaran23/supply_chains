import os
import joblib
import numpy as np
import pandas as pd

MODEL_DIR = os.path.join(os.path.dirname(__file__), "..", "models")

class SupplyChainPredictor:
    def __init__(self):
        self.demand_model_path = os.path.join(MODEL_DIR, "demand_model.pkl")
        self.delay_model_path = os.path.join(MODEL_DIR, "delay_model.pkl")
    
        self.demand_model = joblib.load(self.demand_model_path) if os.path.exists(self.demand_model_path) else None
        self.delay_model = joblib.load(self.delay_model_path) if os.path.exists(self.delay_model_path) else None
        
        print("SUPPLY_LENS PREDICTOR REBOOT CONTEXT STATUS:")
        print(f"Demand Regression Model Loaded: {'TRUE' if self.demand_model else 'FALSE (Using Math Fallback)'}")
        print(f"Transit Classification Model Loaded: {'TRUE' if self.delay_model else 'FALSE (Using Math Fallback)'}")
        

    def predict_demand_forecast(self, historical_sales):
        if not historical_sales:
            print("Predictor warning: Empty history list array parameter context. Returning 150.0")
            return 150.0

        try:
            df = pd.DataFrame(historical_sales)
            df = df.sort_values(by='date')
            
            timeline_index = np.arange(len(df)).reshape(-1, 1)
            actual_sales = df['units_sold'].values

            if self.demand_model:
                next_step = np.array([[len(df)]])
                prediction = self.demand_model.predict(next_step)[0]
                print(" Processing via serialized LinearRegression Binary Matrix file.")
                return float(max(0.0, round(prediction, 2)))
            else:
                from sklearn.linear_model import LinearRegression
                temp_model = LinearRegression()
                temp_model.fit(timeline_index, actual_sales)
                next_step = np.array([[len(df)]])
                prediction = temp_model.predict(next_step)[0]
                print("Dynamically calculating Linear slope from current live database array variables.")
                return float(max(0.0, round(prediction, 2)))
                
        except Exception as e:
            print(f"Demand model internal computation failure trace: {e}")
            return 150.0

    def predict_transit_delay(self, distance_km, transport_mode):
        mode_map = {'ROAD': 0, 'RAIL': 1, 'SEA': 2, 'AIR': 3}
        mode_encoded = mode_map.get(transport_mode.upper(), 0)
        features = np.array([[distance_km, mode_encoded]])

        if self.delay_model:
            try:
                probability = self.delay_model.predict_proba(features)[0][1]
                print(" [INFO] Calculating classification weights via active RandomForest model.")
                return float(round(probability, 4))
            except Exception as e:
                print(f"Delay model binary evaluation exception: {e}")
                return 0.15
        else:
           
            print(" Model file not generated yet. Running dynamic multiplier mapping calculations.")
            factor = 0.0002 * distance_km
            if mode_encoded == 0: factor += 0.12 
            if mode_encoded == 2: factor += 0.22  
            return float(min(max(factor, 0.05), 0.95))