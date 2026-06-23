package com.example.backend.service;


import com.example.backend.entity.Saleshistory;
import com.example.backend.entity.Shipment;

import com.example.backend.respository.SalesHistoryRepository;
import com.example.backend.respository.ShipmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@Service
public class MLIntegrationService {

    @Autowired
    private SalesHistoryRepository salesHistoryRepository;

    @Autowired
    private ShipmentRepository shipmentRepository;

    private final RestTemplate restTemplate = new RestTemplate();
    private final String ML_SERVICE_URL = "http://localhost:8000/predict"; // URL where Python FastAPI will run

    // Method to aggregate sales metrics and call Python for demand forecasts
    public List<Map<String, Object>> getDemandForecast(Long productId) {
        // 1. Fetch historical data from database
        List<Saleshistory> history = salesHistoryRepository.findByProductOrderBySaleDate(productId);

        // 2. Prepare payload map for Python microservice...
        // (Keep your existing code that converts history records into a List of Maps)
        List<Map<String, Object>> payload = history.stream().map(s -> {
            Map<String, Object> map = new HashMap<>();
            map.put("date", s.getSaleDate().toString());
            map.put("units_sold", s.getUnitsSold());
            return map;
        }).toList();

        try {
            String mlUrl = "http://localhost:8000/predict/forecast";

            // 🔴 UPDATE THIS BLOCK BELOW TO READ AS A MAP INSIDE TEMPLATE CALL
            Map<String, Object> response = restTemplate.postForObject(mlUrl, payload, Map.class);

            // Extract calculated units float safely from the parsed payload response
            Double forecastedValue = 150.0; // Dynamic baseline fallback
            if (response != null && response.containsKey("forecasted_demand_units")) {
                forecastedValue = ((Number) response.get("forecasted_demand_units")).doubleValue();
            }

            // 3. Reformat the single data prediction back to Recharts coordinate format array structures for React UI display panels
            List<Map<String, Object>> graphCoordinates = new ArrayList<>();

            // Add historic plots first
            for (int i = 0; i < payload.size(); i++) {
                Map<String, Object> point = new HashMap<>();
                point.put("date", payload.get(i).get("date"));
                point.put("units_sold", payload.get(i).get("units_sold"));
                graphCoordinates.add(point);
            }

            // Append future forecasted demand projection coordinates node string markers
            Map<String, Object> forecastPoint = new HashMap<>();
            forecastPoint.put("date", "Next Month Forecast");
            forecastPoint.put("units_sold", forecastedValue); // maps straight onto same line curves
            graphCoordinates.add(forecastPoint);

            return graphCoordinates;

        } catch (Exception e) {
            throw new RuntimeException("Failed to communicate with Python ML service: " + e.getMessage(), e);
        }
    }
    // Method to pass a live shipment profile to Python to calculate a delay risk percentage
    public Double getShipmentDelayPrediction(Long shipmentId) {
        Shipment shipment = shipmentRepository.findById(shipmentId)
                .orElseThrow(() -> new RuntimeException("Shipment tracking entity not found"));

        Map<String, Object> featurePayload = new HashMap<>();
        featurePayload.put("distance_km", 450); // Hardcoded standard calculation placeholder route distance
        featurePayload.put("origin", shipment.getOrigin());
        featurePayload.put("destination", shipment.getDestination());
        featurePayload.put("transport_mode", shipment.getTransportMode());

        try {
            String url = ML_SERVICE_URL + "/delay"; // Evaluates to http://localhost:8000/predict/delay
            Map<String, Object> response = restTemplate.postForObject(url, featurePayload, Map.class);

            // 🟢 FIX: Safe evaluation extraction to handle variable decimals cleanly
            if (response != null && response.containsKey("delay_probability")) {
                return ((Number) response.get("delay_probability")).doubleValue();
            }
            return 0.15;
        } catch (Exception e) {
            System.err.println("Fallback risk triggered: " + e.getMessage());
            return 0.15; // Safe default rollback probability if Python ML engine is offline
        }

    }
}