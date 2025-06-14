import {
  Panel,
  type PanelFooterTemplateOptions,
  type PanelHeaderTemplateOptions,
} from "primereact/panel";
import type { Post } from "../../models/post";
import { useCallback } from "react";
import { Avatar } from "primereact/avatar";
import styles from "./post-card.module.scss";

export interface PostProps {
  data: Post;
}

export default function PostCard(props: PostProps) {
  const headerTemplate = useCallback(
    (options: PanelHeaderTemplateOptions) => {
      return (
        <div className={`${options.className}`}>
          <div>
            <div className={styles.author}>
              {props.data.author.avatar && (
                <Avatar
                  image={props.data.author.avatar}
                  size="large"
                  shape="circle"
                />
              )}
              <span>{props.data.author.username}</span>
            </div>
          </div>
          {options.togglerElement}
          {/* <span className="ml-auto text-sm text-gray-500">
            {new Date(props.data.createdAt).toLocaleDateString()}
          </span> */}
        </div>
      );
    },
    [props.data],
  );

  const footerTemplate = useCallback(
    (options: PanelFooterTemplateOptions) => {
      return (
        <div className={options.className}>
          <div></div>
          <span className={styles.date}>
            {new Date(props.data.createdAt).toLocaleDateString()}
            {" às "}
            {new Date(props.data.createdAt).toLocaleTimeString()}
          </span>
        </div>
      );
    },
    [props.data],
  );

  return (
    <Panel
      className={styles.postCard}
      headerTemplate={headerTemplate}
      footerTemplate={footerTemplate}
      toggleable
    >
      <p>{props.data.content}</p>
    </Panel>
  );
}
