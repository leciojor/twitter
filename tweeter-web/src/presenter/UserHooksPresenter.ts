import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";

export interface UserHooksView {}

export class UserHooksPresenter {
  private _view: UserHooksView;
  private userService: UserService;

  public constructor(view: UserHooksView) {
    this._view = view;
    this.userService = new UserService();
  }

  public async getUser(
    authToken: AuthToken,
    alias: string,
  ): Promise<User | null> {
    return this.userService.getUser(authToken, alias);
  }
}
