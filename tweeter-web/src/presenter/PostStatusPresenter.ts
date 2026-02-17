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
  setPost: (post: string) => void;
}

export class PostStatusPresenter {
  private view: PostStatusView;
  private actionService: ActionService;

  public constructor(view: PostStatusView) {
    this.view = view;
    this.actionService = new ActionService();
  }

  public checkButtonStatus(
    authToken: AuthToken,
    currentUser: User,
    post: string,
  ) {
    return !post.trim() || !authToken || !currentUser;
  }

  public async submitPost(
    authToken: AuthToken,
    currentUser: User,
    post: string,
  ) {
    var postingStatusToastId = "";

    try {
      this.view.setIsLoading(true);
      postingStatusToastId = this.view.displayInfoMessage(
        "Posting status...",
        0,
      );

      const status = new Status(post, currentUser!, Date.now());

      await this.actionService.postStatus(authToken!, status);

      this.view.setPost("");
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
}
