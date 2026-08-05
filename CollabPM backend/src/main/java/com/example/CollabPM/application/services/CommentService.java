package com.example.CollabPM.application.services;

import com.example.CollabPM.api.dto.request.CommentDto;
import com.example.CollabPM.api.dto.response.CommentResponse;
import com.example.CollabPM.api.exception.ResourceNotFoundException;
import com.example.CollabPM.api.mapper.CommentMapper;
import com.example.CollabPM.application.interfaces.ICommentService;
import com.example.CollabPM.domain.entities.Comment;
import com.example.CollabPM.domain.entities.Task;
import com.example.CollabPM.domain.entities.User;
import com.example.CollabPM.repository.CommentRepository;
import com.example.CollabPM.repository.TaskRepository;
import com.example.CollabPM.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CommentService implements ICommentService {

    private final CommentRepository commentRepository;
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final CommentMapper commentMapper;

    @Override
    public CommentResponse addComment(CommentDto dto) {
        Task task = taskRepository.findById(dto.getTaskId())
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + dto.getTaskId()));

        User author = userRepository.findById(dto.getAuthorId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + dto.getAuthorId()));

        Comment comment = Comment.builder()
                .content(dto.getContent())
                .task(task)
                .author(author)
                .build();

        return commentMapper.toResponse(commentRepository.save(comment));
    }

    @Override
    public List<CommentResponse> getCommentsByTask(Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + taskId));
        return commentRepository.findByTaskOrderByCreatedAtDesc(task)
                .stream()
                .map(commentMapper::toResponse)
                .toList();
    }

    @Override
    public void deleteComment(Long id) {
        if (!commentRepository.existsById(id))
            throw new ResourceNotFoundException("Comment not found with id: " + id);
        commentRepository.deleteById(id);
    }
}