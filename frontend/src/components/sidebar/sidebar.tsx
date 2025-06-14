import { Card } from "primereact/card";
import styles from "./sidebar.module.scss";
import BoardsList from "../boards-list/boards-list";
import UserProfile from "./user-profile";
import CreateBoardButton from "../create-board-button/create-board-button";

export default function Sidebar() {
  return (
    <div className={styles.sidebarContainer}>
      <Card className={styles.sidebar}>
        <BoardsList />
        <div className={styles.sidebarBottom}>
          <CreateBoardButton />
          <UserProfile />
        </div>
      </Card>
    </div>
  );
}
