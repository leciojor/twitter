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
  private _alias: string = "";
  private _password: string = "";
  private _rememberMe: boolean = false;

  public constructor(view: LoginView) {
    this.view = view;
    this.loginService = new LoginService();
  }

  public checkSubmitButtonStatus(): boolean {
    return !this.alias || !this.password;
  }

  public async doLogin(originalUrl: string | undefined) {
    try {
      this.isLoading = true;

      const [user, authToken] = await this.loginService.login(
        this.alias,
        this.password,
      );

      this.view.updateUserInfo(user, user, authToken, this.rememberMe);

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

  public get alias() {
    return this._alias;
  }

  public set alias(alias: string) {
    this._alias = alias;
  }

  public set password(password: string) {
    this._password = password;
  }

  public set rememberMe(rememberMe: boolean) {
    this._rememberMe = rememberMe;
  }

  protected set isLoading(isLoading: boolean) {
    this._isLoading = isLoading;
  }
}
