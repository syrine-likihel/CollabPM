package com.example.CollabPM.api.controller;

import com.example.CollabPM.api.dto.request.CommentDto;
import com.example.CollabPM.api.dto.response.CommentResponse;
import com.example.CollabPM.application.interfaces.ICommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
public class CommentController {
    private final ICommentService commentService;
    @PostMapping
    public ResponseEntity<CommentResponse> add(@Valid
                                               @RequestBody
                                               CommentDto dto){
        return  ResponseEntity.status(HttpStatus.CREATED).body(commentService.addComment(dto));
    }
     @GetMapping("/task/{taskId}")
    public ResponseEntity<List<CommentResponse>>getByTask(@PathVariable long taskId){
        return ResponseEntity.ok(commentService.getCommentsByTask(taskId));
     }

     @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id){
        commentService.deleteComment(id);
        return ResponseEntity.noContent().build();
     }
}
