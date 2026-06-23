package com.example.backend.entity;

import jakarta.persistence.*;

@Entity
public class Warehouse {


        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        @Column(name = "warehouse_id")
        private Long warehouseId;

        @Column(nullable = false, length = 100)
        private String name;

        @Column(nullable = false, length = 100)
        private String location;

        @Column(name = "total_capacity", nullable = false)
        private Integer totalCapacity;

        public Long getWarehouseId() {
                return warehouseId;
        }

        public void setWarehouseId(Long warehouseId) {
                this.warehouseId = warehouseId;
        }

        public Integer getTotalCapacity() {
                return totalCapacity;
        }

        public void setTotalCapacity(Integer totalCapacity) {
                this.totalCapacity = totalCapacity;
        }

        public String getLocation() {
                return location;
        }

        public void setLocation(String location) {
                this.location = location;
        }

        public String getName() {
                return name;
        }

        public void setName(String name) {
                this.name = name;
        }
}

