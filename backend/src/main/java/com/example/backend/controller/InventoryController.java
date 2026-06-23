package com.example.backend.controller;

import com.example.backend.dto.StockUpdateRequest;
import com.example.backend.entity.Inventory;
import com.example.backend.service.InventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/inventories")
@CrossOrigin(origins = "*") // Cross-origin handling so your React UI port can connect cleanly
public class InventoryController {

    @Autowired
    private InventoryService inventoryService;

    @GetMapping("/warehouse/{warehouseId}")
    public ResponseEntity<List<Inventory>> getWarehouseStock(@PathVariable Long warehouseId) {
        return ResponseEntity.ok(inventoryService.getInventoryByWarehouse(warehouseId));
    }

    @GetMapping("/low-stock")
    public ResponseEntity<List<Inventory>> getAlerts() {
        return ResponseEntity.ok(inventoryService.getLowStockItems());
    }

    @PutMapping("/warehouse/{warehouseId}/product/{productId}/stock")
    public ResponseEntity<Inventory> adjustStock(
            @PathVariable Long warehouseId,
            @PathVariable Long productId,
            @RequestBody StockUpdateRequest request) {
        Inventory updated = inventoryService.updateStock(warehouseId, productId, request.getNewStockQuantity());
        return ResponseEntity.ok(updated);
    }
}