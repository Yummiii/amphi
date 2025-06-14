import { Outlet } from "react-router";
import Sidebar from "../../components/sidebar/sidebar";
import styles from "./main-template.module.scss";

export default function MainTemplate() {
  return (
    <div className={styles.page}>
      <Sidebar />
      <div className={styles.mainArea}>
        <div className={styles.content}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
