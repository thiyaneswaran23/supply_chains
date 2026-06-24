package com.example.backend.entity;

import jakarta.persistence.*;


@Entity
public class Supplier {


        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        @Column(name = "supplier_id")
        private Long supplierId;

        @Column(nullable = false, length = 100)
        private String name;

        @Column(name = "contact_email", length = 100)
        private String contactEmail;

        @Column(length = 20)
        private String phone;

        @Column(nullable = false, length = 100)
        private String location;

        @Column(name = "risk_score")
        private Double riskScore = 0.0;

        @Column(name = "reliability_tier", length = 20)
        private String reliabilityTier = "UNKNOWN";
        public Supplier() {}

        public Long getSupplierId() { return supplierId; }
        public void setSupplierId(Long supplierId) { this.supplierId = supplierId; }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getContactEmail() { return contactEmail; }
        public void setContactEmail(String contactEmail) { this.contactEmail = contactEmail; }

        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }

        public String getLocation() { return location; }
        public void setLocation(String location) { this.location = location; }

        public Double getRiskScore() { return riskScore; }
        public void setRiskScore(Double riskScore) { this.riskScore = riskScore; }

        public String getReliabilityTier() { return reliabilityTier; }
        public void setReliabilityTier(String reliabilityTier) { this.reliabilityTier = reliabilityTier; }
    }

