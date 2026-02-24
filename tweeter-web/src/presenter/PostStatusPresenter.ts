import { AuthToken, Status, User } from "tweeter-shared";
import { ActionService } from "../model.service/ActionService";
import { Presenter, MessageView } from "./Presenter";

export interface PostStatusView extends MessageView {
  setIsLoading: (isLoading: boolean) => void;
  setPost: (post: string) => void;
}

export class PostStatusPresenter extends Presenter<PostStatusView> {
  private actionService: ActionService;

  public constructor(view: PostStatusView) {
    super(view);
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
      await this.doFailureReportingOperation(async () => {
        this.view.setIsLoading(true);
        postingStatusToastId = this.view.displayInfoMessage(
          "Posting status...",
          0,
        );

        const status = new Status(post, currentUser!, Date.now());

        await this.actionService.postStatus(authToken!, status);

        this.view.setPost("");
        this.view.displayInfoMessage("Status posted!", 2000);
      }, "post the status");
    } finally {
      this.view.deleteMessage(postingStatusToastId);
      this.view.setIsLoading(false);
    }
  }
}
