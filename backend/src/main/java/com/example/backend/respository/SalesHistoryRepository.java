package com.example.backend.respository;

import com.example.backend.entity.Saleshistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface SalesHistoryRepository extends JpaRepository<Saleshistory, Long> {

    @Query("SELECT s FROM Saleshistory s WHERE s.product.productId = :productId ORDER BY s.saleDate")
    List<Saleshistory> findByProductOrderBySaleDate(@Param("productId") long productId);
}