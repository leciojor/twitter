import { AuthToken } from "tweeter-shared";
import { ActionService } from "../model.service/ActionService";

export interface AppNavBarView {
  displayInfoMessage: (
    message: string,
    duration: number,
    bootstrapClasses?: string | undefined,
  ) => string;
  displayErrorMessage: (message: string) => void;
  navigateTo: (path: string) => void;
  deleteMessage: (messageId: string) => void;
  clearUserInfo: () => void;
}

export class AppNavBarPresenter {
  private view: AppNavBarView;
  private actionService: ActionService;

  public constructor(view: AppNavBarView) {
    this.view = view;
    this.actionService = new ActionService();
  }

  public async logOut(authToken: AuthToken) {
    const loggingOutToastId = this.view.displayInfoMessage("Logging Out...", 0);

    try {
      await this.actionService.logout(authToken!);

      this.view.deleteMessage(loggingOutToastId);
      this.view.clearUserInfo();
      this.view.navigateTo("/login");
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to log user out because of exception: ${error}`,
      );
    }
  }
}
