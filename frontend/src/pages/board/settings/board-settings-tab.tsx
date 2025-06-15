import { Panel } from "primereact/panel";
import { Divider } from "primereact/divider";
import styles from "./board-settings-tab.module.scss";
import type { Board } from "../../../models/board";
import DeleteBoardButton from "../../../components/delete-board-button/delete-board-button";

export interface BoardSettingsTabProps {
  board: Board;
}

export default function BoardSettingsTab({ board }: BoardSettingsTabProps) {
  return (
    <div className={styles.settingsContainer}>
      <Panel header="Configurações do Board" className={styles.settingsPanel}>
        <div className={styles.settingsContent}>
          <div className={styles.settingsSection}>
            <h3 className={styles.sectionTitle}>Informações Gerais</h3>
            <div className={styles.boardInfo}>
              <div className={styles.infoItem}>
                <strong>Nome:</strong> {board.name}
              </div>
              <div className={styles.infoItem}>
                <strong>Slug:</strong> {board.slug}
              </div>
              <div className={styles.infoItem}>
                <strong>Descrição:</strong>{" "}
                {board.description || "Sem descrição"}
              </div>
              <div className={styles.infoItem}>
                <strong>Total de Membros:</strong> {board.members?.length || 0}
              </div>
              <div className={styles.infoItem}>
                <strong>Total de Posts:</strong> {board.posts?.length || 0}
              </div>
            </div>
          </div>

          <Divider />

          <div className={styles.settingsSection}>
            <h3 className={styles.sectionTitle}>Zona de Perigo</h3>
            <div className={styles.dangerActions}>
              <DeleteBoardButton boardSlug={board.slug} />
            </div>
          </div>
        </div>
      </Panel>
    </div>
  );
}
