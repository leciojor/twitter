import { AuthToken, Status, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { View, Presenter } from "./Presenter";

export interface StatusItemView extends View {
  addItems: (newItems: Status[]) => void;
}

export abstract class StatusItemPresenter extends Presenter<StatusItemView> {
  private _hasMoreItems = true;
  private _lastItem: Status | null = null;
  private userService: UserService;

  public constructor(view: StatusItemView) {
    super(view);
    this.userService = new UserService();
  }

  protected get lastItem() {
    return this._lastItem;
  }

  public get hasMoreItems() {
    return this._hasMoreItems;
  }

  protected set lastItem(value: Status | null) {
    this._lastItem = value;
  }

  protected set hasMoreItems(value: boolean) {
    this._hasMoreItems = value;
  }

  public reset() {
    this.lastItem = null;
    this.hasMoreItems = true;
  }

  public async getUser(
    authToken: AuthToken,
    alias: string,
  ): Promise<User | null> {
    return this.userService.getUser(authToken, alias);
  }

  public abstract loadMoreItems(authToken: AuthToken, userAlias: string): void;
}
