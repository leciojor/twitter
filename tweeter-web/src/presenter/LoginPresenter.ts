import { User, AuthToken } from "tweeter-shared";
import { LoginService } from "../model.service/LoginService";

export interface LoginView {
  displayErrorMessage: (message: string) => void;
  updateUserInfo: (
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    remember: boolean,
  ) => void;
  navigateTo: (path: string) => void;
}

export class LoginPresenter {
  private loginService: LoginService;
  private view: LoginView;
  private _isLoading: boolean = false;

  public constructor(view: LoginView) {
    this.view = view;
    this.loginService = new LoginService();
  }

  public checkSubmitButtonStatus(alias: string, password: string): boolean {
    return !alias || !password;
  }

  public async doLogin(
    originalUrl: string | undefined,
    alias: string,
    password: string,
    rememberMe: boolean,
  ) {
    try {
      this.isLoading = true;

      const [user, authToken] = await this.loginService.login(alias, password);

      this.view.updateUserInfo(user, user, authToken, rememberMe);

      if (!!originalUrl) {
        this.view.navigateTo(originalUrl);
      } else {
        this.view.navigateTo(`/feed/${user.alias}`);
      }
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to log user in because of exception: ${error}`,
      );
    } finally {
      this.isLoading = false;
    }
  }

  public get isLoading() {
    return this._isLoading;
  }

  public set isLoading(isLoading: boolean) {
    this._isLoading = isLoading;
  }
}
