# SupplyLens Hub 🚚💨

SupplyLens Hub is an enterprise-grade, data-driven Supply Chain Analytics ecosystem designed to provide managers and warehouse personnel with real-time operational visibility and predictive business intelligence.

The architecture combines a robust enterprise backend framework with localized machine learning microservices to predict asset metrics dynamically based on live transactions instead of unchangeable static datasets.

---

## 🛠️ Architecture & Data Engineering Pipeline

The system operates as a fully integrated distributed architecture:

```text
  [ React UI (Vite) ] 
         │  ▲
   HTTP  │  │ JSON + JWT Auth Bearer Tokens
         ▼  │
  [ Java Spring Boot REST API ] <=====> [ Local MySQL Instance ]
         │  ▲
   HTTP  │  │ JSON Vectors (History Timelines & Features)
         ▼  │
  [ Python FastAPI ML Microservice ] <--- Trained scikit-learn Models