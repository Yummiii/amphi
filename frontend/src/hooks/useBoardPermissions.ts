import { useMemo } from "react";
import { useCurrentUser } from "./useCurrentUser";
import type { BoardMember } from "../models/board";
import { BoardMemberRoles } from "../models/board";

export interface UseBoardPermissionsProps {
  members: BoardMember[] | undefined;
}

export const useBoardPermissions = ({ members }: UseBoardPermissionsProps) => {
  const { data: user } = useCurrentUser();

  const isAdmin = useMemo(() => {
    if (!user || !members) {
      return false;
    }
    
    const currentUserMember = members.find(
      (member) => member.user.id === user.id
    );
    
    return currentUserMember?.role === BoardMemberRoles.Admin;
  }, [user, members]);

  const isMember = useMemo(() => {
    if (!user || !members) {
      return false;
    }
    
    return members.some((member) => member.user.id === user.id);
  }, [user, members]);

  return {
    isAdmin,
    isMember,
    user,
  };
}; 