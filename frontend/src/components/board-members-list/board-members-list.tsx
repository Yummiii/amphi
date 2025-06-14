import type { BoardMember } from "../../models/board";
import { BoardMemberRoles } from "../../models/board";
import { Card } from "primereact/card";
import { Avatar } from "primereact/avatar";
import { Tag } from "primereact/tag";
import { DataView } from "primereact/dataview";
import styles from "./board-members-list.module.scss";
import { useCallback } from "react";

export interface BoardMembersListProps {
  members: BoardMember[] | undefined;
}

export default function BoardMembersList(props: BoardMembersListProps) {
  const itemTemplate = useCallback((member: BoardMember) => {
    return (
      <div key={member.user.id} className={styles.memberItem}>
        <div className={styles.memberInfo}>
          <Avatar
            image={member.user.avatar ?? undefined}
            label={member.user.username.charAt(0).toUpperCase()}
            shape="circle"
            size="normal"
          />
          <span className={styles.memberName}>{member.user.username}</span>
        </div>
        <Tag
          value={member.role === BoardMemberRoles.Admin ? "Admin" : "Membro"}
          severity={member.role === BoardMemberRoles.Admin ? "danger" : "info"}
        />
      </div>
    );
  }, []);

  const headerTemplate = useCallback(() => {
    return (
      <div className={styles.membersPanelHeader}>
        <h3>Membros</h3>
      </div>
    );
  }, []);

  return (
    <Card header={headerTemplate} className={styles.membersPanel}>
      <div className={styles.membersList}>
        {props.members && props.members.length > 0 ? (
          <DataView
            value={props.members}
            itemTemplate={itemTemplate}
            layout="list"
            paginator={false}
          />
        ) : (
          <p className={styles.noMembers}>Nenhum membro</p>
        )}
      </div>
    </Card>
  );
}
