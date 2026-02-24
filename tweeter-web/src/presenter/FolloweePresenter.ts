import { AuthToken } from "tweeter-shared";
import { FollowService } from "../model.service/FollowService";
import { UserItemPresenter, UserItemView } from "./UserItemPresenter";

export const PAGE_SIZE = 10;

export class FolloweePresenter extends UserItemPresenter {
  private service: FollowService;

  public constructor(view: UserItemView) {
    super(view);
    this.service = new FollowService();
  }

  public async loadMoreItems(authToken: AuthToken, userAlias: string) {
    await this.doFailureReportingOperation(async () => {
      const [newItems, hasMore] = await this.service.loadMoreFollowees(
        authToken,
        userAlias,
        PAGE_SIZE,
        this.lastItem,
      );

      this.hasMoreItems = hasMore;
      this.lastItem = newItems.length ? newItems[newItems.length - 1] : null;
      this.view.addItems(newItems);
    }, "load followees");
  }
}
