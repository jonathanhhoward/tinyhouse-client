import React from "react";
import { RouteComponentProps } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { Col, Layout, Row } from "antd";
import { USER } from "../../lib/graphql/queries/User";
import {
  User as UserData,
  UserVariables,
} from "../../lib/graphql/queries/User/__generated__/User";
import { ErrorBanner, PageSkeleton } from "../../lib/components";
import { Viewer } from "../../lib/types";
import { UserProfile } from "./components/UserProfile";

interface Props {
  viewer: Viewer;
}

interface MatchParams {
  id: string;
}

const { Content } = Layout;

export function User({
  viewer,
  match,
}: Props & RouteComponentProps<MatchParams>) {
  const { data, loading, error } = useQuery<UserData, UserVariables>(USER, {
    variables: { id: match.params.id },
  });

  const user = data?.user;
  const viewerIsUser = viewer.id === match.params.id;

  const userProfileElement = user ? (
    <UserProfile user={user} viewerIsUser={viewerIsUser} />
  ) : null;

  return loading ? (
    <Content className="user">
      <PageSkeleton />
    </Content>
  ) : error ? (
    <Content className="user">
      <ErrorBanner description="This user may not exist or we've encountered an error. Please try again soon." />
      <PageSkeleton />
    </Content>
  ) : (
    <Content className="user">
      <Row gutter={12} justify="space-between">
        <Col xs={24}>{userProfileElement}</Col>
      </Row>
    </Content>
  );
}
