import { useContext, useRef } from "react";
import { UserInfoActionsContext, UserInfoContext } from "./UserInfoContexts";
import { useNavigate } from "react-router-dom";
import { useMessageActions } from "../toaster/MessageHooks";
import {
  UserHooksPresenter,
  UserHooksView,
} from "../../presenter/UserHooksPresenter";

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
  const extractAlias = (value: string): string => {
    const index = value.indexOf("@");
    return value.substring(index);
  };
  const { displayErrorMessage } = useMessageActions();

  const presenterRef = useRef<UserHooksPresenter | null>(null);
  if (!presenterRef.current) {
    presenterRef.current = new UserHooksPresenter({});
  }

  return {
    navigateToUser: async (event: React.MouseEvent): Promise<void> => {
      event.preventDefault();

      try {
        const alias = extractAlias(event.target.toString());

        const toUser = await presenterRef.current!.getUser(authToken!, alias);

        if (toUser) {
          if (!toUser.equals(displayedUser!)) {
            setDisplayedUser(toUser);
            navigate(`${featurePath}/${toUser.alias}`);
          }
        }
      } catch (error) {
        displayErrorMessage(
          `Failed to get user because of exception: ${error}`,
        );
      }
    },
  };
};
