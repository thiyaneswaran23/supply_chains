package com.example.backend.respository;

import com.example.backend.entity.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Long> {
    List<Inventory> findByWarehouseWarehouseId(Long warehouseId);
    Optional<Inventory> findByWarehouseWarehouseIdAndProductProductId(Long warehouseId, Long productId);

    // Custom query to find all inventories where current stock hits or drops below the threshold
    @Query("SELECT i FROM Inventory i WHERE i.currentStock <= i.lowStockThreshold")
    List<Inventory> findLowStockInventories();
}