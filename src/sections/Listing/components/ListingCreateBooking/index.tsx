import moment, { Moment } from "moment";
import { Button, Card, DatePicker, Divider, Typography } from "antd";
import { Listing as ListingData } from "../../../../lib/graphql/queries/Listing/__generated__/Listing";
import { Viewer } from "../../../../lib/types";
import { displayErrorMessage, formatListingPrice } from "../../../../lib/utils";
import { BookingsIndex } from "./types";

const { Paragraph, Text, Title } = Typography;

interface Props {
  viewer: Viewer;
  host: ListingData["listing"]["host"];
  price: number;
  bookingsIndex: ListingData["listing"]["bookingsIndex"];
  checkInDate: Moment | null;
  checkOutDate: Moment | null;
  setCheckInDate: (checkInDate: Moment | null) => void;
  setCheckOutDate: (checkOutDate: Moment | null) => void;
}

export function ListingCreateBooking({
  viewer,
  host,
  price,
  bookingsIndex,
  checkInDate,
  checkOutDate,
  setCheckInDate,
  setCheckOutDate,
}: Props) {
  const bookingsIndexJSON: BookingsIndex = JSON.parse(bookingsIndex);

  function dateIsBooked(currentDate: Moment) {
    const year = moment(currentDate).year();
    const month = moment(currentDate).month();
    const day = moment(currentDate).date();

    return Boolean(bookingsIndexJSON[year]?.[month]?.[day]);
  }

  function disabledDate(currentDate: Moment) {
    if (!currentDate) return false;

    return (
      currentDate.isBefore(moment().endOf("day")) || dateIsBooked(currentDate)
    );
  }

  function handleChangeCheckInDate(dateValue: Moment | null) {
    setCheckInDate(dateValue);
  }

  function handleOpenCheckInDate() {
    setCheckOutDate(null);
  }

  function handleChangeCheckOutDate(dateValue: Moment | null) {
    if (checkInDate && dateValue) {
      if (moment(dateValue).isBefore(checkInDate, "days")) {
        return displayErrorMessage(
          `You can't book date of check out to be prior to check in!`
        );
      }

      let dateCursor = checkInDate;

      while (moment(dateCursor).isBefore(dateValue, "days")) {
        dateCursor = moment(dateCursor).add(1, "days");

        const year = moment(dateCursor).year();
        const month = moment(dateCursor).month();
        const day = moment(dateCursor).date();

        if (bookingsIndexJSON[year]?.[month]?.[day]) {
          return displayErrorMessage(
            "You can't book a period of time that overlaps existing bookings. Please try again!"
          );
        }
      }
    }

    setCheckOutDate(dateValue);
  }

  const viewerIsHost = viewer.id === host.id;
  const checkInInputDisabled = !viewer.id || viewerIsHost || !host.hasWallet;
  const checkOutInputDisabled = checkInInputDisabled || !checkInDate;
  const buttonDisabled = checkOutInputDisabled || !checkOutDate;

  let buttonMessage = "You won't be charged yet";
  if (!viewer.id) {
    buttonMessage = "You have to be signed in to book a listing!";
  } else if (viewerIsHost) {
    buttonMessage = "You can't book your own listing!";
  } else if (!host.hasWallet) {
    buttonMessage =
      "The host has disconnected from Stripe and thus won't be able to receive payments.";
  }

  return (
    <div className="listing-booking">
      <Card className="listing-booking__card">
        <div>
          <Paragraph>
            <Title level={2} className="listing-booking__card-title">
              {formatListingPrice(price)}
              <span>/day</span>
            </Title>
          </Paragraph>
          <Divider />
          <div className="listing-booking__card-date-picker">
            <Paragraph strong>Check In</Paragraph>
            <DatePicker
              value={checkInDate ? checkInDate : undefined}
              format={"YYYY/MM/DD"}
              showToday={false}
              disabled={checkInInputDisabled}
              disabledDate={disabledDate}
              onChange={handleChangeCheckInDate}
              onOpenChange={handleOpenCheckInDate}
            />
          </div>
          <div className="listing-booking__card-date-picker">
            <Paragraph strong>Check Out</Paragraph>
            <DatePicker
              value={checkOutDate}
              disabledDate={disabledDate}
              format="YYYY/MM/DD"
              showToday={false}
              disabled={checkOutInputDisabled}
              onChange={handleChangeCheckOutDate}
            />
          </div>
        </div>
        <Divider />
        <Button
          disabled={buttonDisabled}
          size="large"
          type="primary"
          className="listing-booking__card-cta"
        >
          Request to book!
        </Button>
        <Text type="secondary" mark>
          {buttonMessage}
        </Text>
      </Card>
    </div>
  );
}
