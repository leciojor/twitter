import { AuthToken } from "tweeter-shared";
import { ActionService } from "../model.service/ActionService";
import { Presenter, MessageView } from "./Presenter";

export interface AppNavBarView extends MessageView {
  navigateTo: (path: string) => void;
  clearUserInfo: () => void;
}

export class AppNavBarPresenter extends Presenter<AppNavBarView> {
  private actionService: ActionService;

  public constructor(view: AppNavBarView) {
    super(view);
    this.actionService = new ActionService();
  }

  public async logOut(authToken: AuthToken) {
    const loggingOutToastId = this.view.displayInfoMessage("Logging Out...", 0);
    await this.doFailureReportingOperation(async () => {
      await this.actionService.logout(authToken!);

      this.view.deleteMessage(loggingOutToastId);
      this.view.clearUserInfo();
      this.view.navigateTo("/login");
    }, "log user out");
  }
}
