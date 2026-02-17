import { AuthToken } from "tweeter-shared";
import { FollowService } from "../model.service/FollowService";
import { StatusItemPresenter, StatusItemView } from "./StatusItemPresenter";

export const PAGE_SIZE = 10;

export class StoryPresenter extends StatusItemPresenter {
  private service: FollowService;

  public constructor(view: StatusItemView) {
    super(view);
    this.service = new FollowService();
  }

  public async loadMoreItems(authToken: AuthToken, userAlias: string) {
    try {
      const [newItems, hasMore] = await this.service.loadMoreStoryItems(
        authToken,
        userAlias,
        PAGE_SIZE,
        this.lastItem,
      );

      this.hasMoreItems = hasMore;
      this.lastItem = newItems.length ? newItems[newItems.length - 1] : null;
      this.view.addItems(newItems);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to load story because of exception: ${error}`,
      );
    }
  }
}
