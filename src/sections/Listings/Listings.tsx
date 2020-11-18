import React from "react";
import { useMutation, useQuery, gql } from "@apollo/client";
import { Listings as ListingsData } from "./__generated__/Listings";
import {
  DeleteListing as DeleteListingData,
  DeleteListingVariables,
} from "./__generated__/DeleteListing";
import { Alert, Avatar, Button, List, Spin } from "antd";
import { ListingsSkeleton } from "./components/ListingsSkeleton";
import "./styles/Listings.css";

const LISTINGS = gql`
  query Listings {
    listings {
      id
      title
      image
      address
      price
      numOfGuests
      numOfBeds
      numOfBaths
      rating
    }
  }
`;

const DELETE_LISTING = gql`
  mutation DeleteListing($id: ID!) {
    deleteListing(id: $id) {
      id
    }
  }
`;

interface Props {
  title: string;
}

export function Listings({ title }: Props) {
  const listingsResult = useQuery<ListingsData>(LISTINGS);
  const [deleteListing, deleteListingResult] = useMutation<
    DeleteListingData,
    DeleteListingVariables
  >(DELETE_LISTING);

  async function handleDeleteListing(id: string) {
    await deleteListing({ variables: { id } });
    await listingsResult.refetch();
  }

  const listings = listingsResult.data?.listings;

  const listingsList = listings ? (
    <List
      itemLayout="horizontal"
      dataSource={listings}
      renderItem={(listing) => (
        <List.Item
          actions={[
            <Button
              type="primary"
              onClick={() => handleDeleteListing(listing.id)}
            >
              Delete
            </Button>,
          ]}
        >
          <List.Item.Meta
            title={listing.title}
            description={listing.address}
            avatar={<Avatar src={listing.image} shape="square" size={48} />}
          />
        </List.Item>
      )}
    />
  ) : null;

  const deleteListingErrorAlert = deleteListingResult.error ? (
    <Alert
      type="error"
      message="Uh oh! Something went wrong :( Please try again later."
      className="listings__alert"
    />
  ) : null;

  return listingsResult.loading ? (
    <div className="listings">
      <ListingsSkeleton title={title} />
    </div>
  ) : listingsResult.error ? (
    <div className="listings">
      <ListingsSkeleton title={title} error />
    </div>
  ) : (
    <div className="listings">
      {deleteListingErrorAlert}
      <Spin spinning={deleteListingResult.loading}>
        <h2>{title}</h2>
        {listingsList}
      </Spin>
    </div>
  );
}
