package com.example.CollabPM.domain.entities;

import com.example.CollabPM.domain.enums.Priority;
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
@Table(name = "tasks")
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Priority priority= Priority.MEDIUM;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TaskStatus status=TaskStatus.TO_DO;

    @Column(nullable = false)
    private LocalDate dueDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id" , nullable = false)
    private Project project;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="assignedTo")
    private User assignedTo;

    @Column(updatable = false)
    private LocalDateTime createdAt ;

    private LocalDateTime updatedAt;
    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL , orphanRemoval = true)
    private List<Comment> comments=new ArrayList<>();

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate(){
        this.updatedAt=LocalDateTime.now();
    }
//le task est en retard
    public boolean isOverdue(){
        return this.status!=TaskStatus.DONE && LocalDate.now().isAfter(this.dueDate);
    }
}
