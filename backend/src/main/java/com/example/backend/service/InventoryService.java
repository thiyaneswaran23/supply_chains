package com.example.backend.service;

import com.example.backend.entity.Inventory;

import com.example.backend.respository.InventoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class InventoryService {

    @Autowired
    private InventoryRepository inventoryRepository;

    public List<Inventory> getInventoryByWarehouse(Long warehouseId) {
        return inventoryRepository.findByWarehouseWarehouseId(warehouseId);
    }

    public List<Inventory> getLowStockItems() {
        return inventoryRepository.findLowStockInventories();
    }

    public Inventory updateStock(Long warehouseId, Long productId, Integer newStock) {
        Inventory inventory = inventoryRepository.findByWarehouseWarehouseIdAndProductProductId(warehouseId, productId)
                .orElseThrow(() -> new RuntimeException("Inventory record not found for this warehouse and product match"));

        inventory.setCurrentStock(newStock);
        return inventoryRepository.save(inventory);
    }
}