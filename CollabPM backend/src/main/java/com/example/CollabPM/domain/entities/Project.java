package com.example.CollabPM.domain.entities;

import com.example.CollabPM.domain.enums.ProjectStatus;
import com.example.CollabPM.domain.enums.TaskStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
@Table(name = "projects")
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @Column(nullable = false,length = 100)
    private  String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private LocalDate startDate;

    @Column(nullable = false)
    private  LocalDate endDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProjectStatus status = ProjectStatus.PLANNED;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name="owner_id", nullable = false)
    private User owner;

    @Column(updatable = false)
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "project" , cascade = CascadeType.ALL,orphanRemoval = true)
    private List<Task> tasks =new ArrayList<>();

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate(){
        this.updatedAt=LocalDateTime.now();
    }
//calcul du progression du projet

    public double calculateProgress() {
        if (tasks == null || tasks.isEmpty()) return 0.0;
        long doneTasks = tasks.stream()
                .filter(t -> t.getStatus() == TaskStatus.DONE)
                .count();
        return Math.round((doneTasks * 100.0 / tasks.size()) * 10.0) / 10.0;
    }
    //le projet a des taches en retard ou non
    public boolean isLate() {
        return this.status != ProjectStatus.COMPLETED && LocalDate.now().isAfter(this.endDate);
    }
}
