import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import type { Comment } from "../../models/comment";
import { upvoteComment, downvoteComment } from "../../api/comments";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import CommentForm from "./comment-form";
import styles from "./comments-modal.module.scss";

export interface CommentItemProps {
  comment: Comment;
  postId: string;
  onReplySubmit?: () => void;
}

export default function CommentItem({
  comment,
  postId,
  onReplySubmit,
}: CommentItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const queryClient = useQueryClient();
  const { data: user } = useCurrentUser();

  const upvoteMutation = useMutation({
    mutationFn: () => upvoteComment(comment.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
    onError: (error) => {
      console.error("Failed to upvote comment:", error);
    },
  });

  const downvoteMutation = useMutation({
    mutationFn: () => downvoteComment(comment.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
    onError: (error) => {
      console.error("Failed to downvote comment:", error);
    },
  });

  const handleUpvote = useCallback(() => {
    upvoteMutation.mutate();
  }, [upvoteMutation]);

  const handleDownvote = useCallback(() => {
    downvoteMutation.mutate();
  }, [downvoteMutation]);

  const handleReplyClick = useCallback(() => {
    setShowReplyForm(!showReplyForm);
  }, [showReplyForm]);

  const handleReplySuccess = useCallback(() => {
    setShowReplyForm(false);
    onReplySubmit?.();
  }, [onReplySubmit]);

  return (
    <div
      className={styles.commentItem}
      style={{ marginLeft: `${comment.level * 20}px` }}
    >
      <div className={styles.commentContent}>
        <div className={styles.commentHeader}>
          <div className={styles.authorInfo}>
            {comment.author.avatar && (
              <Avatar
                image={comment.author.avatar}
                size="normal"
                shape="circle"
                className={styles.avatar}
              />
            )}
            <span className={styles.username}>{comment.author.username}</span>
            <span className={styles.date}>
              {new Date(comment.createdAt).toLocaleDateString()}
              {" às "}
              {new Date(comment.createdAt).toLocaleTimeString()}
            </span>
          </div>
        </div>

        <div className={styles.commentText}>{comment.content}</div>

        <div className={styles.commentActions}>
          {user && (
            <div className={styles.voteButtons}>
              <Button
                icon="pi pi-thumbs-up"
                onClick={handleUpvote}
                loading={upvoteMutation.isPending}
                className="p-button-text p-button-sm"
                size="small"
              />
              <span className={styles.votesCount}>{comment.votesCount}</span>
              <Button
                icon="pi pi-thumbs-down"
                onClick={handleDownvote}
                loading={downvoteMutation.isPending}
                className="p-button-text p-button-sm"
                size="small"
              />
            </div>
          )}
          {!user && (
            <div className={styles.voteButtons}>
              <span className={styles.votesCount}>{comment.votesCount}</span>
            </div>
          )}

          {user && (
            <Button
              label="Responder"
              icon="pi pi-reply"
              className="p-button-text p-button-sm"
              onClick={handleReplyClick}
              size="small"
            />
          )}
        </div>

        {showReplyForm && (
          <div className={styles.replyForm}>
            <CommentForm
              postId={postId}
              parentId={comment.id}
              onSuccess={handleReplySuccess}
              onCancel={() => setShowReplyForm(false)}
              placeholder={`Respondendo para ${comment.author.username}...`}
            />
          </div>
        )}
      </div>

      {comment.replies && comment.replies.length > 0 && (
        <div className={styles.replies}>
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              postId={postId}
              onReplySubmit={onReplySubmit}
            />
          ))}
        </div>
      )}
    </div>
  );
}
