import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { getBoard } from "../../api/boards";
import { TabMenu, type TabMenuTabChangeEvent } from "primereact/tabmenu";
import { Panel } from "primereact/panel";
import { useCallback, useMemo, useState } from "react";
import type { MenuItem } from "primereact/menuitem";
import Posts from "./posts/posts";
import styles from "./board.module.scss";

export const BoardTabs = {
  Posts: "Posts",
  Members: "Members",
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
        label: "Membros",
        icon: "pi pi-users",
        data: BoardTabs.Members,
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
        return <Posts posts={query.data?.posts} />;
      case BoardTabs.Members:
        return <div>Esta é a página de membros do board.</div>;
      case BoardTabs.Details:
        return <div>Esta é a página de detalhes do board.</div>;
      case BoardTabs.Settings:
        return <div>Esta é a página de configurações do board.</div>;
      default:
        return <div>Selecione uma aba para ver o conteúdo.</div>;
    }
  }, [tab, query]);

  const currentIndex = useMemo(() => {
    return tabItems.findIndex((x) => x.data == tab);
  }, [tab, tabItems]);

  const onTabChange = useCallback((e: TabMenuTabChangeEvent) => {
    setTab(e.value.data);
  }, []);

  return (
    <div className={styles.board}>
      <Panel>
        <TabMenu
          model={tabItems}
          activeIndex={currentIndex}
          onTabChange={onTabChange}
        />
      </Panel>
      <div>{tabData}</div>
    </div>
  );
}
