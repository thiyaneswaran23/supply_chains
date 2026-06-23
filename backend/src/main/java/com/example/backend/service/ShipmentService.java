package com.example.backend.service;

import com.example.backend.entity.Inventory;
import com.example.backend.entity.Shipment;

import com.example.backend.respository.InventoryRepository;
import com.example.backend.respository.ShipmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ShipmentService {

    @Autowired
    private ShipmentRepository shipmentRepository;

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private MLIntegrationService mlIntegrationService;

    public List<Shipment> getAllShipments() {
        return shipmentRepository.findAll();
    }

    public Shipment createShipment(Shipment shipment) {
        // 🛡️ SAFELY VALIDATE THE NOT-NULL PROPERTY BEFORE COMMITTING TO HIBERNATE
        if (shipment.getEstimatedDelivery() == null) {
            // If the UI drops the field, default it seamlessly to 3 days from now
            shipment.setEstimatedDelivery(LocalDate.now().plusDays(3));
        }

        // Populate standard transaction generation timestamps
        if (shipment.getCreatedAt() == null) {
            shipment.setCreatedAt(LocalDateTime.now());
        }

        // Assign a mock AI evaluation risk percentage variable if Python metrics are tracking
        if (shipment.getDelayProbabilityPct() == null) {
            shipment.setDelayProbabilityPct(0.15); // 15% Standard Baseline Risk
        }

        return shipmentRepository.save(shipment);
    }
    @Transactional
    public Shipment updateShipmentStatus(Long shipmentId, String newStatus) {
        Shipment shipment = shipmentRepository.findById(shipmentId)
                .orElseThrow(() -> new RuntimeException("Shipment tracking entity not found"));

        shipment.setStatus(newStatus.toUpperCase());

        // Enterprise Workflow Logic: Trigger Auto-Replenishment upon confirmation of delivery
        if ("DELIVERED".equalsIgnoreCase(newStatus)) {
            shipment.setActualDelivery(LocalDate.now());

            // 🛡️ SAFE CHECK: Verify relational entities exist before triggering inventory adjustments
            if (shipment.getWarehouse() != null && shipment.getProduct() != null) {
                Inventory inventory = inventoryRepository.findByWarehouseWarehouseIdAndProductProductId(
                        shipment.getWarehouse().getWarehouseId(),
                        shipment.getProduct().getProductId()
                ).orElseGet(() -> {
                    Inventory newInventory = new Inventory();
                    newInventory.setWarehouse(shipment.getWarehouse());
                    newInventory.setProduct(shipment.getProduct());
                    newInventory.setCurrentStock(0);
                    newInventory.setLowStockThreshold(10);
                    return newInventory;
                });

                // Replenish physical stock counts seamlessly
                inventory.setCurrentStock(inventory.getCurrentStock() + shipment.getQuantity());
                inventoryRepository.save(inventory);
            }
        }

        return shipmentRepository.save(shipment);
    }
}