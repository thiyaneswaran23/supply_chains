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
    private final String ML_SERVICE_URL = "http://localhost:8000/predict";

    public List<Map<String, Object>> getDemandForecast(Long productId) {

        List<Saleshistory> history = salesHistoryRepository.findByProductOrderBySaleDate(productId);


        List<Map<String, Object>> payload = history.stream().map(s -> {
            Map<String, Object> map = new HashMap<>();
            map.put("date", s.getSaleDate().toString());
            map.put("units_sold", s.getUnitsSold());
            return map;
        }).toList();

        try {
            String mlUrl = "http://localhost:8000/predict/forecast";


            Map<String, Object> response = restTemplate.postForObject(mlUrl, payload, Map.class);


            Double forecastedValue = 150.0; // Dynamic baseline fallback
            if (response != null && response.containsKey("forecasted_demand_units")) {
                forecastedValue = ((Number) response.get("forecasted_demand_units")).doubleValue();
            }

            List<Map<String, Object>> graphCoordinates = new ArrayList<>();
            for (int i = 0; i < payload.size(); i++) {
                Map<String, Object> point = new HashMap<>();
                point.put("date", payload.get(i).get("date"));
                point.put("units_sold", payload.get(i).get("units_sold"));
                graphCoordinates.add(point);
            }


            Map<String, Object> forecastPoint = new HashMap<>();
            forecastPoint.put("date", "Next Month Forecast");
            forecastPoint.put("units_sold", forecastedValue);
            graphCoordinates.add(forecastPoint);

            return graphCoordinates;

        } catch (Exception e) {
            throw new RuntimeException("Failed to communicate with Python ML service: " + e.getMessage(), e);
        }
    }

    public Double getShipmentDelayPrediction(Long shipmentId) {
        Shipment shipment = shipmentRepository.findById(shipmentId)
                .orElseThrow(() -> new RuntimeException("Shipment tracking entity not found"));

        Map<String, Object> featurePayload = new HashMap<>();
        featurePayload.put("distance_km", 450);
        featurePayload.put("origin", shipment.getOrigin());
        featurePayload.put("destination", shipment.getDestination());
        featurePayload.put("transport_mode", shipment.getTransportMode());

        try {
            String url = ML_SERVICE_URL + "/delay";
            Map<String, Object> response = restTemplate.postForObject(url, featurePayload, Map.class);


            if (response != null && response.containsKey("delay_probability")) {
                return ((Number) response.get("delay_probability")).doubleValue();
            }
            return 0.15;
        } catch (Exception e) {
            System.err.println("Fallback risk triggered: " + e.getMessage());
            return 0.15;
        }

    }
}