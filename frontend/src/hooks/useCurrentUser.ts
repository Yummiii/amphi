import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../api/auth";
import type { User } from "../models/user";

export const useCurrentUser = () => {
  return useQuery<User>({
    queryKey: ["current-user"],
    queryFn: getCurrentUser,
    retry: false,
    staleTime: 1000 * 60 * 5, 
  });
}; 