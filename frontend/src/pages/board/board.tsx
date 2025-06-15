import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { getBoard } from "../../api/boards";
import { TabMenu, type TabMenuTabChangeEvent } from "primereact/tabmenu";
import { Panel } from "primereact/panel";
import { useCallback, useMemo, useState } from "react";
import type { MenuItem } from "primereact/menuitem";
import Posts from "./posts/posts";
import JoinLeaveButton from "../../components/join-leave-button/join-leave-button";
import CreatePostButton from "../../components/create-post-button/create-post-button";
import styles from "./board.module.scss";

export const BoardTabs = {
    Posts: "Posts",
    Details: "Details",
    Settings: "Settings",
} as const;

export type BoardTabs = (typeof BoardTabs)[keyof typeof BoardTabs];

export default function Board() {
    const params = useParams();
    const query = useQuery({
        queryKey: ["board", params.slug],
        queryFn: () => getBoard(params.slug as string),
    });
    const [tab, setTab] = useState<BoardTabs>(BoardTabs.Posts);

    const tabItems = useMemo<MenuItem[]>(() => {
        return [
            {
                label: "Publicações",
                icon: "pi pi-file",
                data: BoardTabs.Posts,
            },
            {
                label: "Detalhes",
                icon: "pi pi-info",
                data: BoardTabs.Details,
            },
            {
                label: "Configurações",
                icon: "pi pi-cog",
                data: BoardTabs.Settings,
            },
        ];
    }, []);

    const tabData = useMemo(() => {
        switch (tab) {
            case BoardTabs.Posts:
                return (
                    <Posts
                        posts={query.data?.posts}
                        boardSlug={params.slug as string}
                        members={query.data?.members}
                    />
                );
            case BoardTabs.Details:
                return <div>Esta é a página de detalhes do board.</div>;
            case BoardTabs.Settings:
                return <div>Esta é a página de configurações do board.</div>;
            default:
                return <div>Selecione uma aba para ver o conteúdo.</div>;
        }
    }, [tab, query, params.slug]);

    const currentIndex = useMemo(() => {
        return tabItems.findIndex((x) => x.data == tab);
    }, [tab, tabItems]);

    const onTabChange = useCallback((e: TabMenuTabChangeEvent) => {
        setTab(e.value.data);
    }, []);

    return (
        <div className={styles.board}>
            <Panel>
                <div className={styles.boardHeader}>
                    <div className={styles.boardInfo}>
                        <h2 className={styles.boardTitle}>
                            {query.data?.name}
                        </h2>
                        {query.data?.description && (
                            <p className={styles.boardDescription}>
                                {query.data.description}
                            </p>
                        )}
                    </div>
                    <div className={styles.boardActions}>
                        <CreatePostButton boardSlug={params.slug as string} />
                        <JoinLeaveButton
                            boardSlug={params.slug as string}
                            members={query.data?.members}
                        />
                    </div>
                </div>
                <TabMenu
                    model={tabItems}
                    activeIndex={currentIndex}
                    onTabChange={onTabChange}
                />
            </Panel>
            <div className={styles.tabContent}>{tabData}</div>
        </div>
    );
}
