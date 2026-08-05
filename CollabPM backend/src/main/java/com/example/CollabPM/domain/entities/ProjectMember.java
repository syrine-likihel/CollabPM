package com.example.CollabPM.domain.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@Entity
@Builder
@Table(name = "project_members")
public class ProjectMember {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="user_id" , nullable = false)
    private User user;

    @Column(nullable = false,length = 100)
    private String roleInProject;

    @Column(updatable = false)
    private LocalDateTime joinedAt;
    @PrePersist
    public void prePersist() {
        this.joinedAt = LocalDateTime.now();
    }



}
