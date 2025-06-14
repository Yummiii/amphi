import { Card } from "primereact/card";
import styles from "./sidebar.module.scss";
import BoardsList from "../boards-list/boards-list";
import UserProfile from "./user-profile";

export default function Sidebar() {
  return (
    <div className={styles.sidebarContainer}>
      <Card className={styles.sidebar}>
        <BoardsList />
        <UserProfile />
      </Card>
    </div>
  );
}
