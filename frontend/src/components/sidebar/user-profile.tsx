import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { Menu } from "primereact/menu";
import { useQueryClient } from "@tanstack/react-query";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { useNavigate } from "react-router";
import { useRef } from "react";
import styles from "./user-profile.module.scss";

export default function UserProfile() {
    const menuRef = useRef<Menu>(null);
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: user, isLoading, error } = useCurrentUser();

    const handleLogout = () => {
        localStorage.removeItem("token");
        queryClient.clear();
        navigate("/login");
    };

    const handleSignIn = () => {
        navigate("/login");
    };

    const handleProfilePage = () => {
        navigate("/profile");
        console.log("User profile");
    };

    const menuItems = [
        {
            label: "Usuário",
            command: handleProfilePage,
        },
        {
            label: "Sair",
            icon: "pi pi-sign-out",
            command: handleLogout,
        },
    ];

    if (isLoading) {
        return (
            <div className={styles.userProfile}>
                <div className={styles.loading}>Carregando...</div>
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className={styles.userProfile}>
                <div className={styles.signInContainer}>
                    <Button
                        label="Entrar"
                        icon="pi pi-sign-in"
                        onClick={handleSignIn}
                        className={styles.signInButton}
                        text
                    />
                </div>
            </div>
        );
    }

    return (
        <div className={styles.userProfile}>
            <div className={styles.userInfo}>
                <div className={styles.userDetails}>
                    {user.avatar && (
                        <Avatar
                            image={user.avatar}
                            size="large"
                            shape="circle"
                        />
                    )}
                    {!user.avatar && (
                        <Avatar icon="pi pi-user" size="large" shape="circle" />
                    )}
                    <span className={styles.username}>{user.username}</span>
                </div>
                <Button
                    icon="pi pi-ellipsis-v"
                    className={styles.menuButton}
                    text
                    rounded
                    onClick={(e) => menuRef.current?.toggle(e)}
                />
            </div>
            <Menu
                ref={menuRef}
                model={menuItems}
                popup
                className={styles.userMenu}
            />
        </div>
    );
}
