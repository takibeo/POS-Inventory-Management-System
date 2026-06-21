package com.pos.repository;

import com.pos.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.domain.Pageable;

import java.util.Optional;
import java.util.UUID;

public interface ProductRepository extends JpaRepository<Product, UUID> {
    boolean existsBySku(String sku);
    boolean existsBySkuAndIdNot(String sku, UUID id);

    @Query("SELECT p FROM Product p " +
            "LEFT JOIN FETCH p.category c " +
            "LEFT JOIN FETCH p.supplier s " +
            "WHERE (:categoryId IS NULL OR c.id = :categoryId) " +
            "AND (:isActive IS NULL OR p.isActive = :isActive)")
    Page<Product> findAllWithFilters(
            @Param("categoryId") UUID categoryId,
            @Param("isActive") Boolean isActive,
            Pageable pageable);

    @Query("SELECT p FROM Product p " +
            "LEFT JOIN FETCH p.category " +
            "LEFT JOIN FETCH p.supplier " +
            "WHERE p.id = :id")
    Optional<Product> findByIdWithRelations(@Param("id") UUID id);
    @Query("SELECT p FROM Product p " +
            "LEFT JOIN p.category c " +
            "LEFT JOIN p.supplier s " +
            "WHERE (:q IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%',:q,'%')) " +
            "OR LOWER(p.sku) LIKE LOWER(CONCAT('%',:q,'%'))) ")
    Page<Product> searchByNameOrSku(@Param("q") String q, Pageable pageable);

}
