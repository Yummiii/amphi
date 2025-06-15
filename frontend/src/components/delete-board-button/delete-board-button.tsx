import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "primereact/button";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { useCallback } from "react";
import { useNavigate } from "react-router";
import { deleteBoard } from "../../api/boards";

export interface DeleteBoardButtonProps {
  boardSlug: string;
}

export default function DeleteBoardButton(props: DeleteBoardButtonProps) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const deleteMutation = useMutation({
    mutationFn: () => deleteBoard(props.boardSlug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boards"] });
      navigate("/");
    },
    onError: (error) => {
      console.error("Failed to delete board:", error);
    },
  });

  const confirmDelete = useCallback(() => {
    confirmDialog({
      message: "Tem certeza que deseja deletar a board?",
      header: "Confirmar",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger",
      acceptLabel: "Deletar",
      rejectLabel: "Cancelar",
      accept: () => deleteMutation.mutate(),
    });
  }, [deleteMutation]);

  return (
    <>
      <ConfirmDialog />
      <Button
        label="Deletar Board"
        icon="pi pi-trash"
        severity="danger"
        outlined
        onClick={confirmDelete}
        loading={deleteMutation.isPending}
      />
    </>
  );
}
