package com.example.backend.entity;

import jakarta.persistence.*;


@Entity
public class Inventory {


        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        @Column(name = "inventory_id")
        private Long inventoryId;

        @ManyToOne
        @JoinColumn(name = "warehouse_id", nullable = false)
        private Warehouse warehouse;

        @ManyToOne
        @JoinColumn(name = "product_id", nullable = false)
        private Product product;

        @Column(name = "current_stock", nullable = false)
        private Integer currentStock = 0;

        @Column(name = "low_stock_threshold", nullable = false)
        private Integer lowStockThreshold = 10;

        public Long getInventoryId() {
                return inventoryId;
        }

        public Warehouse getWarehouse() {
                return warehouse;
        }

        public Product getProduct() {
                return product;
        }

        public Integer getCurrentStock() {
                return currentStock;
        }

        public Integer getLowStockThreshold() {
                return lowStockThreshold;
        }

        public void setInventoryId(Long inventoryId) {
                this.inventoryId = inventoryId;
        }

        public void setLowStockThreshold(Integer lowStockThreshold) {
                this.lowStockThreshold = lowStockThreshold;
        }

        public void setCurrentStock(Integer currentStock) {
                this.currentStock = currentStock;
        }

        public void setProduct(Product product) {
                this.product = product;
        }

        public void setWarehouse(Warehouse warehouse) {
                this.warehouse = warehouse;
        }
}

