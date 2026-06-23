package com.example.backend.controller;


import com.example.backend.service.MLIntegrationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "*")
public class AnalyticsController {

    @Autowired
    private MLIntegrationService mlIntegrationService;

    @GetMapping("/forecast/{productId}") // MUST BE @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getProductDemandForecast(@PathVariable Long productId) {
        return ResponseEntity.ok(mlIntegrationService.getDemandForecast(productId));
    }

    @PostMapping("/predict-delay/{shipmentId}")
    public ResponseEntity<Map<String, Object>> getShipmentDelayRisk(@PathVariable Long shipmentId) {
        Double risk = mlIntegrationService.getShipmentDelayPrediction(shipmentId);
        return ResponseEntity.ok(Map.of("shipment_id", shipmentId, "delay_probability", risk));
    }
}