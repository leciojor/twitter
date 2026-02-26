import { AuthToken, Status, User } from "tweeter-shared";
import {
  PostStatusPresenter,
  PostStatusView,
} from "../../src/presenter/PostStatusPresenter";
import {
  mock,
  instance,
  spy,
  verify,
  anything,
  when,
  capture,
} from "@typestrong/ts-mockito";
import { ActionService } from "../../src/model.service/ActionService";

describe("PostStatusPresenter", () => {
  let mockPostStatusView: PostStatusView;
  let postStatusPresenter: PostStatusPresenter;
  let mockService: ActionService;
  const date = Date.now();
  const authToken = new AuthToken("aaa", date);
  const currentUser = new User("name", "cool last name", "aa", "image_url");
  const post = "cool post";
  const status = new Status(post, currentUser, date);
  const postingStatusToastId = "1234";

  beforeEach(() => {
    mockPostStatusView = mock<PostStatusView>();
    const mockPostStatusViewInstance = instance(mockPostStatusView);

    when(mockPostStatusView.displayInfoMessage(anything(), 0)).thenReturn(
      postingStatusToastId,
    );

    const postStatusPresenterSpy = spy(
      new PostStatusPresenter(mockPostStatusViewInstance),
    );
    postStatusPresenter = instance(postStatusPresenterSpy);

    mockService = mock<ActionService>();
    when(postStatusPresenterSpy.actionService).thenReturn(
      instance(mockService),
    );
  });

  it("tells the view to display a posting status message", async () => {
    await postStatusPresenter.submitPost(authToken, currentUser, post);
    verify(
      mockPostStatusView.displayInfoMessage("Posting status...", 0),
    ).once();
  });

  it("calls postStatus on the post status service with the correct status string and auth token", async () => {
    await postStatusPresenter.submitPost(authToken, currentUser, post);

    let [capturedAuthToken, capturedStatus] = capture(
      mockService.postStatus,
    ).last();
    expect(capturedAuthToken).toEqual(authToken);
    expect(capturedStatus.post).toEqual(status.post);
  });

  it("tells the view to clear the info message that was displayed previously, clear the post, and display a status posted message, when the posting of the status is successful ", async () => {
    await postStatusPresenter.submitPost(authToken, currentUser, post);

    verify(mockPostStatusView.setPost("")).once();
    verify(
      mockPostStatusView.displayInfoMessage("Status posted!", 2000),
    ).once();
    verify(mockPostStatusView.deleteMessage(postingStatusToastId)).once();

    verify(mockPostStatusView.displayErrorMessage(anything())).never();
  });

  it("tells the view to clear the info message and display an error message but does not tell it to clear the post or display a status posted message, when posting of the status is not sucessful", async () => {
    let errorMessage = "AN ERROR OCCURRED AAAAAA";
    let error = Error(errorMessage);
    when(mockService.postStatus(anything(), anything())).thenThrow(error);

    await postStatusPresenter.submitPost(authToken, currentUser, post);

    verify(
      mockPostStatusView.displayErrorMessage(
        `Failed to post the status because of exception: ${errorMessage}`,
      ),
    ).once();
    verify(mockPostStatusView.deleteMessage(postingStatusToastId)).once();

    verify(mockPostStatusView.setPost("")).never();
    verify(
      mockPostStatusView.displayInfoMessage("Status posted!", 2000),
    ).never();
  });
});
