import { StrictMode } from "react";
import { render } from "react-dom";
import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { App } from "./App";
import reportWebVitals from "./reportWebVitals";
import "./styles/index.css";

const httpLink = new HttpLink({ uri: "/api" });

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      "X-CSRF-TOKEN": sessionStorage.getItem("token") || "",
    },
  };
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink),
});

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
