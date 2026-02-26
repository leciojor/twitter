import {
  mock,
  instance,
  spy,
  verify,
  anything,
  when,
} from "@typestrong/ts-mockito";
import PostStatus from "../../../src/components/postStatus/PostStatus";
import { PostStatusPresenter } from "../../../src/presenter/PostStatusPresenter";
import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useUserInfo } from "../../../src/components/userInfo/UserHooks";
import "@testing-library/jest-dom";
import { User, AuthToken } from "tweeter-shared";

jest.mock("../../../src/components/userInfo/UserHooks", () => ({
  ...jest.requireActual("../../../src/components/userInfo/UserHooks"),
  __esModule: true,
  useUserInfo: jest.fn(),
}));

describe("PostStatus", () => {
  const randomText = "COOL POST";
  let mockUserInstance: User;
  let mockAuthTokenInstance: AuthToken;

  beforeAll(() => {
    const mockUser = mock<User>();
    mockUserInstance = instance(mockUser);

    const mockAuthToken = mock<AuthToken>();
    mockAuthTokenInstance = instance(mockAuthToken);

    (useUserInfo as jest.Mock).mockReturnValue({
      currentUser: mockUserInstance,
      authToken: mockAuthTokenInstance,
    });
  });

  it("When first rendered the Post Status and Clear buttons are both disabled", () => {
    const { postStatusButton, clearButton } = renderFeedAndGetElements();
    expect(postStatusButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
  });

  it("Both buttons are enabled when the text field has text", async () => {
    await initialPostFillingAndCheck(randomText);
  });

  it("Both buttons are disabled when the text field is cleared", async () => {
    const { user, postStatusButton, clearButton, textField } =
      await initialPostFillingAndCheck(randomText);

    await user.clear(textField);
    expect(postStatusButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
  });

  it("The presenter's postStatus method is called with correct parameters when the Post Status button is pressed", async () => {
    const mockPostStatusPresenter = mock(PostStatusPresenter);

    const { user, postStatusButton, clearButton, textField } =
      renderFeedAndGetElements(instance(mockPostStatusPresenter));

    await user.type(textField, randomText);
    await user.click(postStatusButton);
    verify(
      mockPostStatusPresenter.submitPost(mockAuthTokenInstance, mockUserInstance, randomText),
    ).once();
  });
});

function renderPostStatus(presenter?: PostStatusPresenter) {
  return render(
    <MemoryRouter>
      {presenter ? <PostStatus presenter={presenter} /> : <PostStatus />}
    </MemoryRouter>,
  );
}

function renderFeedAndGetElements(presenter?: PostStatusPresenter) {
  const user = userEvent.setup();

  renderPostStatus(presenter);

  const postStatusButton = screen.getByLabelText("postStatus");
  const clearButton = screen.getByLabelText("clearStatus");
  const textField = screen.getByLabelText("postArea");

  return { user, postStatusButton, clearButton, textField };
}

async function initialPostFillingAndCheck(randomText: string) {
  const { user, postStatusButton, clearButton, textField } =
    renderFeedAndGetElements();

  await user.type(textField, randomText);
  expect(postStatusButton).toBeEnabled();
  expect(clearButton).toBeEnabled();

  return { user, postStatusButton, clearButton, textField };
}