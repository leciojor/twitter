import { useContext, useRef } from "react";
import { UserInfoActionsContext, UserInfoContext } from "./UserInfoContexts";
import { useNavigate } from "react-router-dom";
import { useMessageActions } from "../toaster/MessageHooks";
import { UserHooksPresenter } from "../../presenter/UserHooksPresenter";

interface UserNavigation {
  navigateToUser: (event: React.MouseEvent) => Promise<void>;
}

export const useUserActions = () => {
  return useContext(UserInfoActionsContext);
};
export const useUserInfo = () => {
  return useContext(UserInfoContext);
};

export const useUserNavigation = (featurePath: string): UserNavigation => {
  const { setDisplayedUser } = useUserActions();
  const navigate = useNavigate();
  const { displayedUser, authToken } = useUserInfo();
  const { displayErrorMessage } = useMessageActions();

  const presenterRef = useRef<UserHooksPresenter | null>(null);
  if (!presenterRef.current) {
    presenterRef.current = new UserHooksPresenter({
      displayErrorMessage: displayErrorMessage,
      navigateTo: navigate,
      setDisplayedUser: setDisplayedUser,
    });
  }

  return {
    navigateToUser: async (event: React.MouseEvent): Promise<void> => {
      event.preventDefault();

      presenterRef.current!.navigateToUser(
        displayedUser,
        authToken!,
        event.target.toString(),
        featurePath,
      );
    },
  };
};
