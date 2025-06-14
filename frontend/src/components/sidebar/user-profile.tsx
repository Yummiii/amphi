import { Avatar } from "primereact/avatar";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../../api/auth";
import styles from "./user-profile.module.scss";

export default function UserProfile() {
  const query = useQuery({
    queryKey: ["current-user"],
    queryFn: getCurrentUser,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  if (query.isLoading) {
    return (
      <div className={styles.userProfile}>
        <div className={styles.loading}>Carregando...</div>
      </div>
    );
  }

  if (query.error || !query.data) {
    return null;
  }

  return (
    <div className={styles.userProfile}>
      <div className={styles.userInfo}>
        {query.data.avatar && (
          <Avatar image={query.data.avatar} size="large" shape="circle" />
        )}
        {!query.data.avatar && (
          <Avatar icon="pi pi-user" size="large" shape="circle" />
        )}
        <span className={styles.username}>{query.data.username}</span>
      </div>
    </div>
  );
}
