package com.example.backend.entity;

import jakarta.persistence.*;


import java.math.BigDecimal;

@Entity
public class Product {


        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        @Column(name = "product_id")
        private Long productId;

        @Column(unique = true, nullable = false, length = 50)
        private String sku;

        @Column(nullable = false, length = 100)
        private String name;

        @Column(length = 50)
        private String category;

        @Column(nullable = false, precision = 10, scale = 2)
        private BigDecimal price;
        public Product() {}


        public Long getProductId() { return productId; }
        public void setProductId(Long productId) { this.productId = productId; }

        public String getSku() { return sku; }
        public void setSku(String sku) { this.sku = sku; }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }

        public BigDecimal getPrice() { return price; }
        public void setPrice(BigDecimal price) { this.price = price; }
    }

