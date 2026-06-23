package com.example.backend.dto;

import lombok.Data;

@Data
public class StockUpdateRequest {
    private Integer newStockQuantity;
}