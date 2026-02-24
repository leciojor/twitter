import { User, AuthToken } from "tweeter-shared";
import { Presenter, View } from "./Presenter";

export interface AuthenticationView extends View {
  updateUserInfo: (
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    remember: boolean,
  ) => void;
  navigateTo: (path: string) => void;
  setIsLoading: (isLoading: boolean) => void;
}

export abstract class AuthenticationPresenter<
  T extends AuthenticationView,
> extends Presenter<T> {
  public async doAuthentication(
    getUserAndAuthToken: () => Promise<[User, AuthToken]>,
    rememberMe: boolean,
    redirect: () => void,
  ): Promise<void> {
    try {
      await this.doFailureReportingOperation(async () => {
        this.view.setIsLoading(true);

        const [user, authToken] = await getUserAndAuthToken();

        this.view.updateUserInfo(user, user, authToken, rememberMe);

        redirect();
      }, this.itemDescription());
    } finally {
      this.view.setIsLoading(false);
    }
  }

  protected abstract itemDescription(): string;
}
