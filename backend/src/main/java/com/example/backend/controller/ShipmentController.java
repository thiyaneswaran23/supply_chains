package com.example.backend.controller;

import com.example.backend.entity.Shipment;
import com.example.backend.service.ShipmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/shipments")
@CrossOrigin(origins = "*")
public class ShipmentController {

    @Autowired
    private ShipmentService shipmentService;

    @GetMapping
    public ResponseEntity<List<Shipment>> getAllActiveOrders() {
        return ResponseEntity.ok(shipmentService.getAllShipments());
    }

    @PostMapping
    public ResponseEntity<Shipment> bookNewOrder(@RequestBody java.util.Map<String, Object> payload) {
        Shipment shipment = new Shipment();

        // Map raw frontend form fields cleanly into your database columns
        shipment.setOrigin((String) payload.get("origin"));
        shipment.setDestination((String) payload.get("destination"));
        shipment.setQuantity((Integer) payload.get("quantity"));
        shipment.setTransportMode((String) payload.get("transportMode"));
        shipment.setStatus("IN_TRANSIT");

        // Parse the incoming date safely or fall back automatically to 3 days out
        if (payload.containsKey("estimatedDelivery") && payload.get("estimatedDelivery") != null && !((String)payload.get("estimatedDelivery")).isEmpty()) {
            shipment.setEstimatedDelivery(LocalDate.parse((String) payload.get("estimatedDelivery")));
        } else {
            shipment.setEstimatedDelivery(LocalDate.now().plusDays(3));
        }

        // Set metadata properties required by Hibernate
        shipment.setCreatedAt(LocalDateTime.now());
        shipment.setDelayProbabilityPct(0.15); // Default 15% standard operational risk score

        // Save entry and return to UI
        Shipment savedShipment = shipmentService.createShipment(shipment);
        return ResponseEntity.ok(savedShipment);
    }

    @PutMapping("/deliver/{id}")
    public ResponseEntity<Shipment> updateStatus(@PathVariable Long id) {
        // 🟢 Clean path variable handling with no trailing request parameters
        return ResponseEntity.ok(shipmentService.updateShipmentStatus(id, "DELIVERED"));
    }

    // 🟢 ADD THIS SECOND PUT MAPPING AS A FALLBACK OVERRIDE INTERCEPTOR
    @PutMapping("/{id}/status")
    public ResponseEntity<Shipment> updateStatusFallback(
            @PathVariable Long id,
            @RequestParam(required = false) String status) {
        // Intercepts the old URL layout seamlessly and maps it straight to your core service routine
        return ResponseEntity.ok(shipmentService.updateShipmentStatus(id, "DELIVERED"));
    }
}