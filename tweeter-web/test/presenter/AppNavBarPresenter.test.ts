import { AuthToken } from "tweeter-shared";
import {
  AppNavBarView,
  AppNavBarPresenter,
} from "../../src/presenter/AppNavBarPresenter";
import {
  mock,
  instance,
  spy,
  verify,
  anything,
  when,
} from "@typestrong/ts-mockito";
import { ActionService } from "../../src/model.service/ActionService";

describe("AppNavBarPresenter", () => {
  let mockAppNavBarPresenterView: AppNavBarView;
  let appNavBarPresenter: AppNavBarPresenter;
  let mockService: ActionService;
  const messageId = "1234";
  const authToken = new AuthToken("aaa", Date.now());

  beforeEach(() => {
    mockAppNavBarPresenterView = mock<AppNavBarView>();
    const mockAppNavBarPresenterViewInstance = instance(
      mockAppNavBarPresenterView,
    );
    when(
      mockAppNavBarPresenterView.displayInfoMessage(anything(), 0),
    ).thenReturn(messageId);

    const appNavBarPresenterSpy = spy(
      new AppNavBarPresenter(mockAppNavBarPresenterViewInstance),
    );
    appNavBarPresenter = instance(appNavBarPresenterSpy);

    mockService = mock<ActionService>();
    when(appNavBarPresenterSpy.actionService).thenReturn(instance(mockService));
  });

  it("tells the view to display a logging out message", async () => {
    await appNavBarPresenter.logOut(authToken);
    verify(
      mockAppNavBarPresenterView.displayInfoMessage("Logging Out...", 0),
    ).once();
  });

  it("calls logout on the user service with the correct auth token", async () => {
    await appNavBarPresenter.logOut(authToken);
    verify(mockService.logout(authToken)).once();
  });

  it("tells the view to clear the info message that was displayed previously, clear the user info, and navigate to the login page, when the logout is successful ", async () => {
    await appNavBarPresenter.logOut(authToken);

    verify(mockAppNavBarPresenterView.deleteMessage(messageId)).once();
    verify(mockAppNavBarPresenterView.clearUserInfo()).once();
    verify(mockAppNavBarPresenterView.navigateTo(anything())).once();

    verify(mockAppNavBarPresenterView.displayErrorMessage(anything())).never();
  });

  it("tells the view to display an error message and does not tell it to clear the info message, clear the user info or navigate to the login page, when logout not sucessful", async () => {
    let errorMessage = "AN ERROR OCCURRED AAAAAA";
    let error = Error(errorMessage);
    when(mockService.logout(anything())).thenThrow(error);

    await appNavBarPresenter.logOut(authToken);

    verify(
      mockAppNavBarPresenterView.displayErrorMessage(
        `Failed to log user out because of exception: ${errorMessage}`,
      ),
    ).once();
    verify(mockAppNavBarPresenterView.deleteMessage(anything())).never();
    verify(mockAppNavBarPresenterView.clearUserInfo()).never();
    verify(mockAppNavBarPresenterView.navigateTo(anything())).never();
  });
});
