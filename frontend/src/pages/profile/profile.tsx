import { useCurrentUser } from "../../hooks/useCurrentUser";
import { useCallback, useMemo, useState, useEffect } from "react";
import { Panel } from "primereact/panel";
import styles from "./profile.module.scss";

export default function Profile() {
    const { data: user, isLoading, error } = useCurrentUser();
    console.log(user);

    // useEffect(() => {
    //     console.log(user.username);
    // }, [isLoading]);

    return (
        <div>
            <Panel>
                <h1>Nome do usuario</h1>
            </Panel>
        </div>
    );
}
