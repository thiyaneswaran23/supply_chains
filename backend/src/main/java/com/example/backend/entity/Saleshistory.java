package com.example.backend.entity;

import jakarta.persistence.*;


import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
public class Saleshistory {


        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        @Column(name = "sales_id")
        private Long salesId;

        @ManyToOne
        @JoinColumn(name = "product_id", nullable = false)
        private Product product;

        @ManyToOne
        @JoinColumn(name = "warehouse_id", nullable = false)
        private Warehouse warehouse;

        @Column(name = "sale_date", nullable = false)
        private LocalDate saleDate;

        @Column(name = "units_sold", nullable = false)
        private Integer unitsSold;

        @Column(nullable = false, precision = 12, scale = 2)
        private BigDecimal revenue;

        public Long getSalesId() {
                return salesId;
        }

        public void setSalesId(Long salesId) {
                this.salesId = salesId;
        }

        public BigDecimal getRevenue() {
                return revenue;
        }

        public void setRevenue(BigDecimal revenue) {
                this.revenue = revenue;
        }

        public Integer getUnitsSold() {
                return unitsSold;
        }

        public void setUnitsSold(Integer unitsSold) {
                this.unitsSold = unitsSold;
        }

        public LocalDate getSaleDate() {
                return saleDate;
        }

        public void setSaleDate(LocalDate saleDate) {
                this.saleDate = saleDate;
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
}

