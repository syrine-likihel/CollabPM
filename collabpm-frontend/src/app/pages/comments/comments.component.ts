import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { TopbarComponent } from '../../components/topbar/topbar.component';

import { CommentService } from '../../services/comment.service';
import { TaskService } from '../../services/task.service';
import { AuthService } from '../../services/auth.service';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [
    SidebarComponent,
    TopbarComponent,
    FormsModule
  ],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.css'
})
export class CommentsComponent implements OnInit {

  taskId: number | null = null;
  task: any = null;
  comments: any[] = [];
  newComment = '';
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private commentService: CommentService,
    private taskService: TaskService,
    public authService: AuthService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('taskId');

    if (id) {
      this.taskId = Number(id);

      this.loadTask(this.taskId);
      this.loadComments(this.taskId);
    } else {
      this.loading = false;
      console.error('No taskId found in URL');
    }
  }

  loadTask(id: number): void {
    this.taskService.getById(id).subscribe({
      next: (data) => {
        this.task = data;
      },
      error: (err) => {
        console.error('Error loading task:', err);
      }
    });
  }

  loadComments(taskId: number): void {
    this.loading = true;

    this.commentService.getByTask(taskId).subscribe({
      next: (data) => {
        this.comments = data ?? [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading comments:', err);
        this.comments = [];
        this.loading = false;
      }
    });
  }

  addComment(): void {
    if (!this.newComment.trim() || !this.taskId) {
      return;
    }

    const user = this.authService.getUser();

    if (!user?.id) {
      this.alertService.error('User information not found. Please login again.');
      return;
    }

    const dto = {
      content: this.newComment.trim(),
      taskId: this.taskId,
      authorId: user.id
    };

    this.commentService.add(dto).subscribe({
      next: () => {
        this.newComment = '';
        this.alertService.success('Comment added successfully!');
        this.loadComments(this.taskId!);
      },
      error: (err) => {
        console.error('Error adding comment:', err);
      }
    });
  }

  deleteComment(id: number): void {
    if (!this.taskId) {
      return;
    }

    if (!confirm('Delete this comment?')) {
      return;
    }

    this.commentService.delete(id).subscribe({
      next: () => {
        this.alertService.success('Comment deleted successfully!');
        this.loadComments(this.taskId!);
      },
      error: (err) => {
        console.error('Error deleting comment:', err);
      }
    });
  }

  getInitials(name: string): string {
    if (!name?.trim()) {
      return 'UN';
    }

    return name
      .trim()
      .split(/\s+/)
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }
}