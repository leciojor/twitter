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
  beforeEach(() => {});

  it("tells the view to display a posting status message", async () => {});

  it("calls postStatus on the post status service with the correct status string and auth token", async () => {});

  it("tells the view to clear the info message that was displayed previously, clear the post, and display a status posted message, when the posting of the status is successful ", async () => {});

  it("tells the view to clear the info message and display an error message but does not tell it to clear the post or display a status posted message, when posting of the status is not sucessful", async () => {});
});
