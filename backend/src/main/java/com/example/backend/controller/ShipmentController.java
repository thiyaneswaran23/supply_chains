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

        shipment.setOrigin((String) payload.get("origin"));
        shipment.setDestination((String) payload.get("destination"));
        shipment.setQuantity((Integer) payload.get("quantity"));
        shipment.setTransportMode((String) payload.get("transportMode"));
        shipment.setStatus("IN_TRANSIT");

        if (payload.containsKey("estimatedDelivery") && payload.get("estimatedDelivery") != null && !((String)payload.get("estimatedDelivery")).isEmpty()) {
            shipment.setEstimatedDelivery(LocalDate.parse((String) payload.get("estimatedDelivery")));
        } else {
            shipment.setEstimatedDelivery(LocalDate.now().plusDays(3));
        }

        shipment.setCreatedAt(LocalDateTime.now());
        shipment.setDelayProbabilityPct(0.15);

        Shipment savedShipment = shipmentService.createShipment(shipment);
        return ResponseEntity.ok(savedShipment);
    }

    @PutMapping("/deliver/{id}")
    public ResponseEntity<Shipment> updateStatus(@PathVariable Long id) {

        return ResponseEntity.ok(shipmentService.updateShipmentStatus(id, "DELIVERED"));
    }


    @PutMapping("/{id}/status")
    public ResponseEntity<Shipment> updateStatusFallback(
            @PathVariable Long id,
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(shipmentService.updateShipmentStatus(id, "DELIVERED"));
    }
}