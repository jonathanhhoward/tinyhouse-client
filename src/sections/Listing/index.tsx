import React, { useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { Moment } from "moment";
import { Col, Layout, Row } from "antd";
import { ErrorBanner, PageSkeleton } from "../../lib/components";
import { LISTING } from "../../lib/graphql/queries";
import {
  Listing as ListingData,
  ListingVariables,
} from "../../lib/graphql/queries/Listing/__generated__/Listing";
import {
  ListingBookings,
  ListingCreateBooking,
  ListingDetails,
} from "./components";

interface MatchParams {
  id: string;
}

const { Content } = Layout;
const PAGE_LIMIT = 3;

export function Listing({ match }: RouteComponentProps<MatchParams>) {
  const [bookingsPage, setBookingsPage] = useState(1);
  const [checkInDate, setCheckInDate] = useState<Moment | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Moment | null>(null);

  const { data, loading, error } = useQuery<ListingData, ListingVariables>(
    LISTING,
    {
      variables: {
        id: match.params.id,
        bookingsPage,
        limit: PAGE_LIMIT,
      },
    }
  );

  const listing = data?.listing;
  const listingBookings = listing?.bookings;

  const listingDetailsElement = listing ? (
    <ListingDetails listing={listing} />
  ) : null;

  const listingBookingsElement = listingBookings ? (
    <ListingBookings
      listingBookings={listingBookings}
      bookingsPage={bookingsPage}
      limit={PAGE_LIMIT}
      setBookingsPage={setBookingsPage}
    />
  ) : null;

  const listingCreateBookingElement = listing ? (
    <ListingCreateBooking
      price={listing.price}
      checkInDate={checkInDate}
      checkOutDate={checkOutDate}
      setCheckInDate={setCheckInDate}
      setCheckOutDate={setCheckOutDate}
    />
  ) : null;

  return loading ? (
    <Content className="listing">
      <PageSkeleton />
    </Content>
  ) : error ? (
    <Content className="listing">
      <ErrorBanner description="This listing may not exist or we've encountered an error. Please try again soon!" />
      <PageSkeleton />
    </Content>
  ) : (
    <Content className="listing">
      <Row gutter={24} justify="space-between">
        <Col xs={24} lg={14}>
          {listingDetailsElement}
          {listingBookingsElement}
        </Col>
        <Col xs={24} lg={10}>
          {listingCreateBookingElement}
        </Col>
      </Row>
    </Content>
  );
}
