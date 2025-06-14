import { useMemo } from "react";
import PostCard from "../../../components/post/post-card";
import type { Post } from "../../../models/post";
import styles from "./posts.module.scss";

export interface PostsProps {
  posts: Post[] | undefined;
}

export default function Posts(props: PostsProps) {
  console.log(props.posts);

  const content = useMemo(() => {
    return props.posts ? (
      props.posts.map((post) => <PostCard key={post.id} data={post} />)
    ) : (
      <div>
        <h1>Posts</h1>
        <p>Nenhum post encontrado.</p>
      </div>
    );
  }, [props.posts]);

  return <div className={styles.postList}>{content}</div>;
}
