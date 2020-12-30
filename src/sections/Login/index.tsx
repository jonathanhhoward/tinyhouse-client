import { useEffect, useRef } from "react";
import { Redirect } from "react-router-dom";
import { useLazyQuery, useMutation } from "@apollo/client";
import { Card, Layout, Spin, Typography } from "antd";
import { ErrorBanner } from "../../lib/components/ErrorBanner";
import { LOG_IN } from "../../lib/graphql/mutations";
import { AUTH_URL } from "../../lib/graphql/queries";
import {
  LogIn as LogInData,
  LogInVariables,
} from "../../lib/graphql/mutations/LogIn/__generated__/LogIn";
import { AuthUrl as AuthUrlData } from "../../lib/graphql/queries/AuthUrl/__generated__/AuthUrl";
import {
  displayErrorMessage,
  displaySuccessNotification,
} from "../../lib/utils";
import { Viewer } from "../../lib/types";
import googleLogo from "./assets/google_logo.jpg";

interface Props {
  setViewer: (viewer: Viewer) => void;
}

const { Content } = Layout;
const { Text, Title } = Typography;

export function Login({ setViewer }: Props) {
  const [getAuthUrl] = useLazyQuery<AuthUrlData>(AUTH_URL, {
    onCompleted(data) {
      window.location.href = data.authUrl;
    },
    onError() {
      displayErrorMessage(
        "Sorry! We weren't able to log you in. Please try again later!"
      );
    },
  });
  const [
    logIn,
    { data: logInData, loading: logInLoading, error: logInError },
  ] = useMutation<LogInData, LogInVariables>(LOG_IN, {
    onCompleted(data) {
      if (!data.logIn.token) return;
      setViewer(data.logIn);
      sessionStorage.setItem("token", data.logIn.token);
      displaySuccessNotification("You've successfully logged in!");
    },
  });
  const logInRef = useRef(logIn);

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");

    if (!code) return;

    logInRef.current({ variables: { input: { code } } });
  }, []);

  function handleGetAuthUrl() {
    getAuthUrl();
  }

  const logInErrorBannerElement = logInError ? (
    <ErrorBanner description="We weren't able to log you in. Please try again soon." />
  ) : null;

  return logInLoading ? (
    <Content className="log-in">
      <Spin size="large" tip="Logging you in..." />
    </Content>
  ) : logInData?.logIn ? (
    <Redirect to={`/user/${logInData.logIn.id}`} />
  ) : (
    <Content className="log-in">
      {logInErrorBannerElement}
      <Card className="log-in-card">
        <div className="log-in-card__intro">
          <Title level={3} className="log-in-card__intro-title">
            <span role="img" aria-label="wave">
              👋
            </span>
          </Title>
          <Title level={3} className="log-in-card__intro-title">
            Log in to TinyHouse!
          </Title>
          <Text>Sign in with Google to start booking available rentals!</Text>
        </div>
        <button
          className="log-in-card__google-button"
          onClick={handleGetAuthUrl}
        >
          <img
            src={googleLogo}
            alt="Google Logo"
            className="log-in-card__google-button-logo"
          />
          <span className="log-in-card__google-button-text">
            Sign in with Google
          </span>
        </button>
        <Text type="secondary">
          Note: By signing in, you'll be redirected to the Google consent form
          to sign in with your Google account.
        </Text>
      </Card>
    </Content>
  );
}
