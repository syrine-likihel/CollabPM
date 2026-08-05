package com.example.CollabPM.domain.entities;

import com.example.CollabPM.domain.enums.Role;
import jakarta.persistence.*;
import lombok.*;


import java.time.LocalDateTime;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor 
@Entity
@Builder
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String fullName;

    @Column(nullable = false, unique = true, length = 150)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role = Role.MEMBER;

    @Column(updatable = false)
    private LocalDateTime createdAt ;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}
