import {
  mock,
  instance,
  spy,
  verify,
  anything,
  when,
} from "@typestrong/ts-mockito";
import Login from "../../../../src/components/authentication/login/Login";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { userEvent } from "@testing-library/user-event";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import "@testing-library/jest-dom";
import { LoginPresenter } from "../../../../src/presenter/LoginPresenter";

library.add(fab);

describe("Login", () => {
  const alias = "COOL ALIAS";
  const password = "COOL PASSWORD";
  const url = "/"

  it("When first rendered the sign-in button is disabled", () => {
    const { signInButton } = renderLoginAndGetElement(url);
    expect(signInButton).toBeDisabled();
  });

  it("The sign-in button is enabled when both the alias and password fields have text", async () => {
    await initialSignInEnabledCheck(alias, password, url);
  });

  it("The sign-in button is disabled if either the alias or password field is cleared", async () => {
    const { user, aliasField, signInButton, passwordField } =
      await initialSignInEnabledCheck(alias, password, url);

    await user.clear(aliasField);
    expect(signInButton).toBeDisabled();

    await user.type(aliasField, alias);
    expect(signInButton).toBeEnabled();

    await user.clear(passwordField);
    expect(signInButton).toBeDisabled();
  });

  it("The presenter's login method is called with correct parameters when the sign-in button is pressed", async () => {
    const mockPresenter = mock<LoginPresenter>();
    const mockPresenterInstance = instance(mockPresenter);

    const { signInButton, aliasField, passwordField, user } =
      renderLoginAndGetElement(url, mockPresenterInstance);

    await user.type(aliasField, alias);
    await user.type(passwordField, password);
    await user.click(signInButton);

    verify(mockPresenter.doLogin(url, alias, password, false)).once();
  });
});

async function initialSignInEnabledCheck(alias: string, password: string, url: string) {
  const { signInButton, aliasField, passwordField, user } =
    renderLoginAndGetElement(url);

  await user.type(aliasField, alias);
  await user.type(passwordField, password);
  expect(signInButton).toBeEnabled();

  return { user, aliasField, signInButton, passwordField };
}

function renderLogin(originalUrl: string, presenter?: LoginPresenter) {
  return render(
    <MemoryRouter>
      {presenter ? (
        <Login originalUrl={originalUrl} presenter={presenter} />
      ) : (
        <Login originalUrl={originalUrl} />
      )}
    </MemoryRouter>,
  );
}

function renderLoginAndGetElement(
  originalUrl: string,
  presenter?: LoginPresenter,
) {
  const user = userEvent.setup();

  renderLogin(originalUrl, presenter);

  const signInButton = screen.getByRole("button", { name: /Sign in/i });
  const aliasField = screen.getByLabelText("alias");
  const passwordField = screen.getByLabelText("password");

  return { user, signInButton, aliasField, passwordField };
}
