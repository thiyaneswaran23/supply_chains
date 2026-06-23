package com.example.backend.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String username;
    private String password;
    private String role; // 'SUPPLY_CHAIN_MANAGER' or 'WAREHOUSE_SUPERVISOR'
}