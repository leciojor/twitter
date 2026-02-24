import { LoginService } from "../model.service/LoginService";
import {
  AuthenticationPresenter,
  AuthenticationView,
} from "./AuthenticationPresenter";

export interface LoginView extends AuthenticationView {}

export class LoginPresenter extends AuthenticationPresenter<LoginView> {
  private loginService: LoginService;

  public constructor(view: LoginView) {
    super(view);
    this.loginService = new LoginService();
  }

  protected itemDescription(): string {
    return "log user in";
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
    await this.doAuthentication(
      async () => {
        const [user, authToken] = await this.loginService.login(
          alias,
          password,
        );
        return [user, authToken];
      },
      rememberMe,
      () => {
        if (!!originalUrl) {
          this.view.navigateTo(originalUrl);
        } else {
          this.view.navigateTo(`/feed/${alias}`);
        }
      },
    );
  }
}
