import { useMemo } from "react";
import PostCard from "../../../components/post/post-card";
import BoardMembersList from "../../../components/board-members-list/board-members-list";
import type { Post } from "../../../models/post";
import type { BoardMember } from "../../../models/board";
import styles from "./posts.module.scss";

export interface PostsProps {
  posts: Post[] | undefined;
  boardSlug: string;
  members: BoardMember[] | undefined;
}

export default function Posts(props: PostsProps) {
  const postContent = useMemo(() => {
    return props.posts ? (
      props.posts.map((post) => <PostCard key={post.id} data={post} boardSlug={props.boardSlug} />)
    ) : (
      <div>
        <h1>Posts</h1>
        <p>Nenhum post encontrado.</p>
      </div>
    );
  }, [props.posts, props.boardSlug]);

  return (
    <div className={styles.postsContainer}>
      <div className={styles.postList}>
        <div className={styles.postsScrollContainer}>{postContent}</div>
      </div>

      <BoardMembersList members={props.members} />
    </div>
  );
}
