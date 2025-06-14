import { useMemo, useCallback } from "react";
import { Button } from "primereact/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { joinBoard, leaveBoard } from "../../api/boards";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import type { BoardMember } from "../../models/board";
import styles from "./join-leave-button.module.scss";

export interface JoinLeaveButtonProps {
  boardSlug: string;
  members: BoardMember[] | undefined;
}

export default function JoinLeaveButton(props: JoinLeaveButtonProps) {
  const queryClient = useQueryClient();
  const { data: user } = useCurrentUser();

  const joinMutation = useMutation({
    mutationFn: () => joinBoard(props.boardSlug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["board", props.boardSlug] });
    },
    onError: (error) => {
      console.error("Failed to join board:", error);
    },
  });

  const leaveMutation = useMutation({
    mutationFn: () => leaveBoard(props.boardSlug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["board", props.boardSlug] });
    },
    onError: (error) => {
      console.error("Failed to leave board:", error);
    },
  });

  const isUserMember = useMemo(() => {
    if (!user || !props.members) {
      return false;
    }
    return props.members.some((member) => member.user.id === user.id);
  }, [user, props.members]);

  const handleJoinLeave = useCallback(() => {
    if (isUserMember) {
      leaveMutation.mutate();
    } else {
      joinMutation.mutate();
    }
  }, [isUserMember, joinMutation, leaveMutation]);

  const isLoading = joinMutation.isPending || leaveMutation.isPending;

  if (!user) {
    return null;
  }

  return (
    <Button
      label={isUserMember ? "Sair" : "Entrar"}
      icon={isUserMember ? "pi pi-sign-out" : "pi pi-sign-in"}
      onClick={handleJoinLeave}
      loading={isLoading}
      className={`${styles.joinLeaveButton} ${
        isUserMember ? styles.leaveButton : styles.joinButton
      }`}
      severity={isUserMember ? "danger" : "success"}
    />
  );
}
