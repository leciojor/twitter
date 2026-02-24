import { User, AuthToken } from "tweeter-shared";
import { LoginService } from "../model.service/LoginService";
import { View, Presenter } from "./Presenter";

export interface LoginView extends View {
  updateUserInfo: (
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    remember: boolean,
  ) => void;
  navigateTo: (path: string) => void;
  setIsLoading: (isLoading: boolean) => void;
}

export class LoginPresenter extends Presenter<LoginView> {
  private loginService: LoginService;

  public constructor(view: LoginView) {
    super(view);
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
      await this.doFailureReportingOperation(async () => {
        this.view.setIsLoading(true);

        const [user, authToken] = await this.loginService.login(
          alias,
          password,
        );

        this.view.updateUserInfo(user, user, authToken, rememberMe);

        if (!!originalUrl) {
          this.view.navigateTo(originalUrl);
        } else {
          this.view.navigateTo(`/feed/${user.alias}`);
        }
      }, "log user in");
    } finally {
      this.view.setIsLoading(false);
    }
  }
}
