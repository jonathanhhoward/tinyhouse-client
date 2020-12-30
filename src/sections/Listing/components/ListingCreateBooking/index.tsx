import moment, { Moment } from "moment";
import { Button, Card, DatePicker, Divider, Typography } from "antd";
import { displayErrorMessage, formatListingPrice } from "../../../../lib/utils";

const { Paragraph, Title } = Typography;

interface Props {
  price: number;
  checkInDate: Moment | null;
  checkOutDate: Moment | null;
  setCheckInDate: (checkInDate: Moment | null) => void;
  setCheckOutDate: (checkOutDate: Moment | null) => void;
}

export function ListingCreateBooking({
  price,
  checkInDate,
  checkOutDate,
  setCheckInDate,
  setCheckOutDate,
}: Props) {
  function disabledDate(currentDate: Moment) {
    if (!currentDate) return false;

    return currentDate.isBefore(moment().endOf("day"));
  }

  function handleChangeCheckInDate(dateValue: Moment | null) {
    setCheckInDate(dateValue);
  }

  function handleOpenCheckInDate() {
    setCheckOutDate(null);
  }

  function handleChangeCheckOutDate(dateValue: Moment | null) {
    if (
      checkInDate &&
      dateValue &&
      moment(dateValue).isBefore(checkInDate, "days")
    ) {
      return displayErrorMessage(
        "You can't book date of check out to be prior to check in!"
      );
    }

    setCheckOutDate(dateValue);
  }

  const checkOutInputDisabled = !checkInDate;
  const buttonDisabled = !checkInDate || !checkOutDate;

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
              value={checkInDate}
              disabledDate={disabledDate}
              format="YYYY/MM/DD"
              showToday={false}
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
      </Card>
    </div>
  );
}
