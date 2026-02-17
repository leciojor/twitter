import "./Login.css";
import "bootstrap/dist/css/bootstrap.css";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
import AuthenticationFields from "../AuthenticationFields";
import { useMessageActions } from "../../toaster/MessageHooks";
import { useUserActions } from "../../userInfo/UserHooks";
import { LoginPresenter, LoginView } from "../../../presenter/LoginPresenter";

interface Props {
  originalUrl?: string;
}

const Login = (props: Props) => {
  const navigate = useNavigate();
  const { updateUserInfo } = useUserActions();
  const { displayErrorMessage } = useMessageActions();

  const listener: LoginView = {
    displayErrorMessage: displayErrorMessage,
    updateUserInfo: updateUserInfo,
    navigateTo: (path: string) => navigate(path),
  };

  const presenterRef = useRef<LoginPresenter | null>(null);
  if (!presenterRef.current) {
    presenterRef.current = new LoginPresenter(listener);
  }

  const loginOnEnter = (event: React.KeyboardEvent<HTMLElement>) => {
    if (
      event.key == "Enter" &&
      !presenterRef.current!.checkSubmitButtonStatus()
    ) {
      presenterRef.current!.doLogin(props.originalUrl);
    }
  };

  const inputFieldFactory = () => {
    return (
      <AuthenticationFields
        setAlias={(alias) => (presenterRef.current!.alias = alias)}
        setPassword={(password) => (presenterRef.current!.password = password)}
        onEnter={loginOnEnter}
      />
    );
  };

  const switchAuthenticationMethodFactory = () => {
    return (
      <div className="mb-3">
        Not registered? <Link to="/register">Register</Link>
      </div>
    );
  };

  return (
    <AuthenticationFormLayout
      headingText="Please Sign In"
      submitButtonLabel="Sign in"
      oAuthHeading="Sign in with:"
      inputFieldFactory={inputFieldFactory}
      switchAuthenticationMethodFactory={switchAuthenticationMethodFactory}
      setRememberMe={(value) => (presenterRef.current!.rememberMe = value)}
      submitButtonDisabled={() =>
        presenterRef.current!.checkSubmitButtonStatus()
      }
      isLoading={presenterRef.current!.isLoading}
      submit={() => presenterRef.current!.doLogin(props.originalUrl)}
    />
  );
};

export default Login;
