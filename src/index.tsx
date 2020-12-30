import { StrictMode, useState, useEffect, useRef } from "react";
import { render } from "react-dom";
import {
  ApolloClient,
  HttpLink,
  ApolloLink,
  InMemoryCache,
  concat,
  ApolloProvider,
  useMutation,
} from "@apollo/client";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Affix, Layout, Spin } from "antd";
import {
  AppHeader,
  Home,
  Host,
  Listing,
  Listings,
  Login,
  NotFound,
  User,
} from "./sections";
import { AppHeaderSkeleton, ErrorBanner } from "./lib/components";
import { LOG_IN } from "./lib/graphql/mutations";
import {
  LogIn as LogInData,
  LogInVariables,
} from "./lib/graphql/mutations/LogIn/__generated__/LogIn";
import { Viewer } from "./lib/types";
import reportWebVitals from "./reportWebVitals";
import "./styles/index.css";

const httpLink = new HttpLink({ uri: "/api" });

const authMiddleware = new ApolloLink((operation, forward) => {
  operation.setContext({
    headers: {
      "X-CSRF-TOKEN": sessionStorage.getItem("token") || "",
    },
  });

  return forward(operation);
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: concat(authMiddleware, httpLink),
});

const initialViewer: Viewer = {
  id: null,
  token: null,
  avatar: null,
  hasWallet: null,
  didRequest: false,
};

function App() {
  const [viewer, setViewer] = useState<Viewer>(initialViewer);
  const [logIn, { error }] = useMutation<LogInData, LogInVariables>(LOG_IN, {
    onCompleted(data) {
      if (!data.logIn) return;
      setViewer(data.logIn);

      if (data.logIn.token) {
        sessionStorage.setItem("token", data.logIn.token);
      } else {
        sessionStorage.removeItem("token");
      }
    },
  });
  const logInRef = useRef(logIn);

  useEffect(() => {
    logInRef.current();
  }, []);

  const logInErrorBannerElement = error ? (
    <ErrorBanner description="We weren't able to verify if you were logged in. Please try again later." />
  ) : null;

  return !viewer.didRequest && !error ? (
    <Layout className="app-skeleton">
      <AppHeaderSkeleton />
      <div className="app-skeleton__spin-section">
        <Spin size="large" tip="Launching TinyHouse" />
      </div>
    </Layout>
  ) : (
    <Router>
      <Layout id="app">
        {logInErrorBannerElement}
        <Affix offsetTop={0} className="app__affix-header">
          <AppHeader viewer={viewer} setViewer={setViewer} />
        </Affix>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/host" component={Host} />
          <Route exact path="/listing/:id" component={Listing} />
          <Route exact path="/listings/:location?" component={Listings} />
          <Route
            exact
            path="/login"
            render={(props) => <Login {...props} setViewer={setViewer} />}
          />
          <Route
            exact
            path="/user/:id"
            render={(props) => <User {...props} viewer={viewer} />}
          />
          <Route component={NotFound} />
        </Switch>
      </Layout>
    </Router>
  );
}

render(
  <StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
