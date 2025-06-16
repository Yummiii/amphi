import styles from "./home.module.scss";

export default function Home() {
    return (
        <div className={styles.homeMessage}>
            <h1>Bem Vindo ao Amphi</h1>
            <p>
                Selecione uma das Boards ao lado ou crie sua própria para
                começar a interagir
            </p>
        </div>
    );
}
