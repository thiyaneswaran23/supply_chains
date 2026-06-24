package com.example.backend.entity;

import jakarta.persistence.*;


import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
public class Shipment {


        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        @Column(name = "shipment_id")
        private Long shipmentId;

        @ManyToOne
        @JoinColumn(name = "supplier_id")
        private Supplier supplier;

        @ManyToOne
        @JoinColumn(name = "warehouse_id")
        private Warehouse warehouse;

        @ManyToOne
        @JoinColumn(name = "product_id")
        private Product product;

        @Column(nullable = false)
        private Integer quantity;

        @Column(nullable = false, length = 100)
        private String origin;

        @Column(nullable = false, length = 100)
        private String destination;

        @Column(name = "transport_mode", nullable = false, length = 20)
        private String transportMode;

        @Column(nullable = false, length = 30)
        private String status = "PENDING";

        @Column(name = "estimated_delivery", nullable = false)
        private LocalDate estimatedDelivery;

        @Column(name = "actual_delivery")
        private LocalDate actualDelivery;

        @Column(name = "delay_probability_pct")
        private Double delayProbabilityPct = 0.0;

        @Column(name = "created_at", updatable = false)
        private LocalDateTime createdAt;

        @PrePersist
        protected void onCreate() {
            this.createdAt = LocalDateTime.now();
        }

        public Long getShipmentId() {
                return shipmentId;
        }

        public void setShipmentId(Long shipmentId) {
                this.shipmentId = shipmentId;
        }

        public Supplier getSupplier() {
                return supplier;
        }

        public void setSupplier(Supplier supplier) {
                this.supplier = supplier;
        }

        public Warehouse getWarehouse() {
                return warehouse;
        }

        public void setWarehouse(Warehouse warehouse) {
                this.warehouse = warehouse;
        }

        public Product getProduct() {
                return product;
        }

        public void setProduct(Product product) {
                this.product = product;
        }

        public Integer getQuantity() {
                return quantity;
        }

        public void setQuantity(Integer quantity) {
                this.quantity = quantity;
        }

        public String getOrigin() {
                return origin;
        }

        public void setOrigin(String origin) {
                this.origin = origin;
        }

        public String getDestination() {
                return destination;
        }

        public void setDestination(String destination) {
                this.destination = destination;
        }

        public String getTransportMode() {
                return transportMode;
        }

        public void setTransportMode(String transportMode) {
                this.transportMode = transportMode;
        }

        public String getStatus() {
                return status;
        }

        public void setStatus(String status) {
                this.status = status;
        }

        public LocalDate getEstimatedDelivery() {
                return estimatedDelivery;
        }

        public void setEstimatedDelivery(LocalDate estimatedDelivery) {
                this.estimatedDelivery = estimatedDelivery;
        }

        public LocalDate getActualDelivery() {
                return actualDelivery;
        }

        public void setActualDelivery(LocalDate actualDelivery) {
                this.actualDelivery = actualDelivery;
        }

        public Double getDelayProbabilityPct() {
                return delayProbabilityPct;
        }

        public void setDelayProbabilityPct(Double delayProbabilityPct) {
                this.delayProbabilityPct = delayProbabilityPct;
        }

        public LocalDateTime getCreatedAt() {
                return createdAt;
        }

        public void setCreatedAt(LocalDateTime createdAt) {
                this.createdAt = createdAt;
        }
}

