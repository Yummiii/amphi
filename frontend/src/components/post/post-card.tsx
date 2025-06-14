import {
  Panel,
  type PanelFooterTemplateOptions,
  type PanelHeaderTemplateOptions,
} from "primereact/panel";
import { Button } from "primereact/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Post } from "../../models/post";
import { useCallback } from "react";
import { Avatar } from "primereact/avatar";
import { upvotePost, downvotePost } from "../../api/posts";
import styles from "./post-card.module.scss";

export interface PostProps {
  data: Post;
  boardSlug?: string;
}

const isImageUrl = (url: string): boolean => {
  return /\.(jpg|jpeg|png|gif|webp|bmp|svg)(\?.*)?$/i.test(url);
};

const isVideoUrl = (url: string): boolean => {
  return /\.(mp4|webm|mpeg)(\?.*)?$/i.test(url);
};

export default function PostCard(props: PostProps) {
  const queryClient = useQueryClient();

  const upvoteMutation = useMutation({
    mutationFn: () => upvotePost(props.data.id),
    onSuccess: () => {
      if (props.boardSlug) {
        queryClient.invalidateQueries({ queryKey: ["board", props.boardSlug] });
      }
      console.log("Post upvoted successfully!");
    },
    onError: (error) => {
      console.error("Failed to upvote post:", error);
    },
  });

  const downvoteMutation = useMutation({
    mutationFn: () => downvotePost(props.data.id),
    onSuccess: () => {
      if (props.boardSlug) {
        queryClient.invalidateQueries({ queryKey: ["board", props.boardSlug] });
      }
      console.log("Post downvoted successfully!");
    },
    onError: (error) => {
      console.error("Failed to downvote post:", error);
    },
  });

  const handleUpvote = useCallback(() => {
    upvoteMutation.mutate();
  }, [upvoteMutation]);

  const handleDownvote = useCallback(() => {
    downvoteMutation.mutate();
  }, [downvoteMutation]);

  const headerTemplate = useCallback(
    (options: PanelHeaderTemplateOptions) => {
      return (
        <div className={`${options.className}`}>
          <div>
            <div className={styles.author}>
              {props.data.author.avatar && (
                <Avatar
                  image={props.data.author.avatar}
                  size="normal"
                  shape="circle"
                />
              )}
              <span>{props.data.author.username}</span>
            </div>
          </div>
          {options.togglerElement}
        </div>
      );
    },
    [props.data],
  );

  const footerTemplate = useCallback(
    (options: PanelFooterTemplateOptions) => {
      return (
        <div className={`${options.className} ${styles.footerContainer}`}>
          <div className={styles.voteButtons}>
            <Button
              icon="pi pi-thumbs-up"
              onClick={handleUpvote}
              loading={upvoteMutation.isPending}
              className="p-button-text"
              size="small"
            />
            <Button
              icon="pi pi-thumbs-down"
              onClick={handleDownvote}
              loading={downvoteMutation.isPending}
              className="p-button-text"
              size="small"
            />
          </div>
          <span className={styles.date}>
            {new Date(props.data.createdAt).toLocaleDateString()}
            {" às "}
            {new Date(props.data.createdAt).toLocaleTimeString()}
          </span>
        </div>
      );
    },
    [
      props.data,
      handleUpvote,
      handleDownvote,
      upvoteMutation.isPending,
      downvoteMutation.isPending,
    ],
  );

  const renderAttachment = () => {
    if (!props.data.attachment) return null;

    if (isImageUrl(props.data.attachment)) {
      return (
        <div className={styles.attachmentContainer}>
          <img
            src={props.data.attachment}
            alt="Post attachment"
            className={styles.attachment}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
            }}
            loading="lazy"
            decoding="async"
          />
        </div>
      );
    }

    if (isVideoUrl(props.data.attachment)) {
      return (
        <div className={styles.attachmentContainer}>
          <video
            src={props.data.attachment}
            controls
            className={styles.attachment}
            onError={(e) => {
              const target = e.target as HTMLVideoElement;
              target.style.display = "none";
            }}
          />
        </div>
      );
    }
  };

  return (
    <Panel
      className={styles.postCard}
      headerTemplate={headerTemplate}
      footerTemplate={footerTemplate}
      toggleable
    >
      {props.data.content && (
        <p className={styles.content}>{props.data.content}</p>
      )}
      {renderAttachment()}
    </Panel>
  );
}
