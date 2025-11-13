import { useAppSelector } from "./useRedux";

export const useAuth = () => {
  const { token, user } = useAppSelector((state) => state.auth);

  const isAuthenticated = Boolean(token && user);
  const role = user?.role ?? null;

  return { isAuthenticated, role, user, token };
};
