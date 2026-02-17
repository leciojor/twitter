import { AuthToken, Status, User } from "tweeter-shared";
import { ActionService } from "../model.service/ActionService";

export interface PostStatusView {
  displayInfoMessage: (
    message: string,
    duration: number,
    bootstrapClasses?: string | undefined,
  ) => string;
  displayErrorMessage: (message: string) => void;
  deleteMessage: (messageId: string) => void;
  setIsLoading: (isLoading: boolean) => void;
}

export class PostStatusPresenter {
  private view: PostStatusView;
  private actionService: ActionService;
  private _post: string = "";

  public constructor(view: PostStatusView) {
    this.view = view;
    this.actionService = new ActionService();
  }

  public checkButtonStatus(authToken: AuthToken, currentUser: User) {
    return !this.post.trim() || !authToken || !currentUser;
  }

  public async submitPost(authToken: AuthToken, currentUser: User) {
    var postingStatusToastId = "";

    try {
      this.view.setIsLoading(true);
      postingStatusToastId = this.view.displayInfoMessage(
        "Posting status...",
        0,
      );

      const status = new Status(this.post, currentUser!, Date.now());

      await this.actionService.postStatus(authToken!, status);

      this.post = "";
      this.view.displayInfoMessage("Status posted!", 2000);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to post the status because of exception: ${error}`,
      );
    } finally {
      this.view.deleteMessage(postingStatusToastId);
      this.view.setIsLoading(false);
    }
  }

  public set post(post: string) {
    this._post = post;
  }
}
