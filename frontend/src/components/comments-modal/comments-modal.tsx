import { Dialog } from "primereact/dialog";
import { ProgressSpinner } from "primereact/progressspinner";
import { Message } from "primereact/message";
import { Divider } from "primereact/divider";
import { useQuery } from "@tanstack/react-query";
import { getPostComments } from "../../api/comments";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import CommentForm from "./comment-form";
import CommentItem from "./comment-item";
import styles from "./comments-modal.module.scss";

export interface CommentsModalProps {
  visible: boolean;
  onHide: () => void;
  postId: string;
  postTitle?: string;
}

export default function CommentsModal({
  visible,
  onHide,
  postId,
  postTitle,
}: CommentsModalProps) {
  const { data: user } = useCurrentUser();

  const {
    data: commentsData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["comments", postId],
    queryFn: () => getPostComments(postId),
    enabled: visible,
  });

  const handleCommentSuccess = () => {
    refetch();
  };

  const modalHeader = (
    <div className={styles.modalHeader}>
      <h3>Comentários</h3>
      {postTitle && <span className={styles.postTitle}>{postTitle}</span>}
    </div>
  );

  return (
    <Dialog
      header={modalHeader}
      visible={visible}
      onHide={onHide}
      modal
      className={styles.commentsModal}
      style={{ width: "90vw", maxWidth: "800px" }}
      contentClassName={styles.modalContent}
    >
      <div className={styles.commentsContainer}>
        {user && (
          <>
            <div className={styles.newCommentSection}>
              <h4>Adicionar comentário</h4>
              <CommentForm postId={postId} onSuccess={handleCommentSuccess} />
            </div>
            <Divider />
          </>
        )}

        <div className={styles.commentsSection}>
          {isLoading && (
            <div className={styles.loadingContainer}>
              <ProgressSpinner />
              <span>Carregando comentários...</span>
            </div>
          )}

          {error && (
            <Message
              severity="error"
              text="Erro ao carregar comentários. Tente novamente."
              className={styles.errorMessage}
            />
          )}

          {commentsData && !isLoading && (
            <>
              <div className={styles.commentsHeader}>
                <h4>
                  {commentsData.totalCount === 0
                    ? "Nenhum comentário"
                    : `${commentsData.totalCount} comentário${commentsData.totalCount > 1 ? "s" : ""}`}
                </h4>
              </div>

              {commentsData.comments.length === 0 && (
                <div className={styles.noComments}>
                  <p>Seja o primeiro a comentar!</p>
                </div>
              )}

              {commentsData.comments.map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  postId={postId}
                  onReplySubmit={handleCommentSuccess}
                />
              ))}
            </>
          )}
        </div>
      </div>
    </Dialog>
  );
}
