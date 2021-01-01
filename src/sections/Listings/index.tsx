import { useState } from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { Affix, Layout, List, Typography } from "antd";
import { ErrorBanner, ListingCard } from "../../lib/components";
import { LISTINGS } from "../../lib/graphql/queries";
import {
  Listings as ListingsData,
  ListingsVariables,
} from "../../lib/graphql/queries/Listings/__generated__/Listings";
import { ListingsFilter } from "../../lib/graphql/__generated__/globalTypes";
import {
  ListingsFilters,
  ListingsPagination,
  ListingsSkeleton,
} from "./components";

interface MatchParams {
  location: string;
}

const { Content } = Layout;
const { Paragraph, Text, Title } = Typography;

const PAGE_LIMIT = 8;

export function Listings({ match }: RouteComponentProps<MatchParams>) {
  const [filter, setFilter] = useState(ListingsFilter.PRICE_LOW_TO_HIGH);
  const [page, setPage] = useState(1);

  const { data, loading, error } = useQuery<ListingsData, ListingsVariables>(
    LISTINGS,
    {
      variables: {
        location: match.params.location,
        filter,
        limit: PAGE_LIMIT,
        page,
      },
    }
  );

  const listings = data?.listings;
  const listingsRegion = listings?.region;

  const listingsRegionElement = listingsRegion ? (
    <Title level={3} className="listings__title">
      Results for "{listingsRegion}"
    </Title>
  ) : null;

  const listingsSectionElement = listings?.result.length ? (
    <div>
      <Affix offsetTop={64}>
        <ListingsPagination
          total={listings.total}
          page={page}
          limit={PAGE_LIMIT}
          setPage={setPage}
        />
        <ListingsFilters filter={filter} setFilter={setFilter} />
      </Affix>
      <List
        grid={{ gutter: 8, xs: 1, sm: 2, md: 2, lg: 4, xl: 4, xxl: 4 }}
        dataSource={listings.result}
        renderItem={(listing) => (
          <List.Item>
            <ListingCard listing={listing} />
          </List.Item>
        )}
      />
    </div>
  ) : (
    <div>
      <Paragraph>
        It appears that no listings have yet been created for{" "}
        <Text mark>"{listingsRegion}"</Text>
      </Paragraph>
      <Paragraph>
        Be the first person to create a{" "}
        <Link to="/host">listing in this area</Link>!
      </Paragraph>
    </div>
  );

  return loading ? (
    <Content className="listings">
      <ListingsSkeleton />
    </Content>
  ) : error ? (
    <Content className="listings">
      <ErrorBanner
        description={`
            We either couldn't find anything matching your search or have encountered an error.
            If you're searching for a unique location, try searching again with more common keywords.
          `}
      />
      <ListingsSkeleton />
    </Content>
  ) : (
    <Content className="listings">
      {listingsRegionElement}
      {listingsSectionElement}
    </Content>
  );
}
