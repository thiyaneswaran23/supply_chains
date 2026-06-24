from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Dict, Any
from app.predictor import SupplyChainPredictor

app = FastAPI(title="SupplyLens AI - Machine Learning Microservice")
predictor = SupplyChainPredictor()

class DelayRequest(BaseModel):
    distance_km: int
    origin: str
    destination: str
    transport_mode: str

@app.get("/")
def read_root():
    return {"status": "ONLINE", "service": "SupplyLens ML Microservice Pipeline"}

@app.post("/predict/forecast")
def forecast_demand(payload: List[Dict[str, Any]]):
    
    print("INCOMING REQUEST: DEMAND FORECAST")
    print(f"Total History Data Points Received: {len(payload)}")
    if payload:
        print(f"Sample History Point (Latest): {payload[-1]}")
        
    predicted_units = predictor.predict_demand_forecast(payload)
    
    print(f"AI FORECAST DEMAND RESULT: {predicted_units} Units")
  
    return {"forecasted_demand_units": predicted_units}

@app.post("/predict/delay")
def predict_delay(payload: DelayRequest):
    
    print("INCOMING REQUEST: TRANSIT DELAY RISK")
    print(f"Route Manifest: {payload.origin} --- {payload.destination}")
    print(f"Transport Mode: {payload.transport_mode}")
    print(f" Route Distance:  {payload.distance_km} km")
    
    probability = predictor.predict_transit_delay(
        distance_km=payload.distance_km,
        transport_mode=payload.transport_mode
    )
    
    print(f"AI TRANSIT DELAY PROBABILITY: {probability * 100:.2f}% Risk Status")
  
    return {"delay_probability": probability}