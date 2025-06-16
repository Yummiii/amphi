import { useQuery } from "@tanstack/react-query";
import { getBoards } from "../../api/boards";
import { useCallback, useState } from "react";
import { ListBox, type ListBoxChangeEvent } from "primereact/listbox";
import { useNavigate } from "react-router";
import type { Board } from "../../models/board";

export default function BoardsList() {
  const [board, setBoard] = useState<Board | null>(null);
  const query = useQuery({ queryKey: ["boards"], queryFn: getBoards });
  const navigate = useNavigate();

  const selected = useCallback(
    (e: ListBoxChangeEvent) => {
      setBoard(e.value);
      if (e.value) {
        navigate(`/boards/${e.value.slug}`);
      }
    },
    [navigate],
  );

  return (
    <div>
      <ListBox
        filter
        options={query.data}
        onChange={selected}
        value={board}
        optionLabel="name"
      />
    </div>
  );
}
