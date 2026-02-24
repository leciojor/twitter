import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { View, Presenter } from "./Presenter";

export interface UserHooksView extends View {
  navigateTo: (path: string) => void;
  setDisplayedUser: (user: User) => void;
}

export class UserHooksPresenter extends Presenter<UserHooksView> {
  private userService: UserService;

  public constructor(view: UserHooksView) {
    super(view);
    this.userService = new UserService();
  }

  private extractAlias(value: string): string {
    const index = value.indexOf("@");
    return value.substring(index);
  }

  private async getUser(
    authToken: AuthToken,
    alias: string,
  ): Promise<User | null> {
    return this.userService.getUser(authToken, alias);
  }

  public async navigateToUser(
    displayedUser: User | null,
    authToken: AuthToken,
    target: string,
    featurePath: string,
  ): Promise<void> {
    await this.doFailureReportingOperation(async () => {
      const alias = this.extractAlias(target);

      const toUser = await this.getUser(authToken!, alias);

      if (toUser) {
        if (!toUser.equals(displayedUser!)) {
          this.view.setDisplayedUser(toUser);
          this.view.navigateTo(`${featurePath}/${toUser.alias}`);
        }
      }
    }, "get user");
  }
}
