package com.pos.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "branches")
@Data
public class Branch {

    @Id
    private UUID id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false, unique = true)
    private String code;

    private String address;
    private String phone;

    @ManyToOne
    @JoinColumn(name = "manager_id")
    private User manager;

    @Column(name = "created_at")
    private Instant createdAt;

    @Column(name = "updated_at")
    private Instant updatedAt;

    public Branch() {
    }

    // getters and setters omitted for brevity
}
