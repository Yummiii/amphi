import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useCallback } from "react";
import { createComment } from "../../api/comments";
import type { CreateCommentRequest } from "../../models/comment";
import styles from "./comments-modal.module.scss";

export interface CommentFormProps {
  postId: string;
  parentId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  placeholder?: string;
}

export default function CommentForm({ 
  postId, 
  parentId, 
  onSuccess, 
  onCancel, 
  placeholder = "Escreva seu comentário..." 
}: CommentFormProps) {
  const [content, setContent] = useState("");
  const queryClient = useQueryClient();

  const createCommentMutation = useMutation({
    mutationFn: (data: CreateCommentRequest) => createComment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      setContent("");
      onSuccess?.();
    },
    onError: (error) => {
      console.error("Failed to create comment:", error);
    },
  });

  const handleSubmit = useCallback(() => {
    if (!content.trim()) return;
    
    createCommentMutation.mutate({
      content: content.trim(),
      postId,
      parentId,
    });
  }, [content, postId, parentId, createCommentMutation]);

  const handleCancel = useCallback(() => {
    setContent("");
    onCancel?.();
  }, [onCancel]);

  return (
    <div className={styles.commentForm}>
      <InputTextarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className={styles.commentInput}
        autoResize
      />
      <div className={styles.formActions}>
        <Button
          label="Comentar"
          icon="pi pi-send"
          onClick={handleSubmit}
          loading={createCommentMutation.isPending}
          disabled={!content.trim()}
          size="small"
        />
        {onCancel && (
          <Button
            label="Cancelar"
            icon="pi pi-times"
            className="p-button-text"
            onClick={handleCancel}
            size="small"
          />
        )}
      </div>
    </div>
  );
} 