/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ConnectStripeInput } from "./../../../__generated__/globalTypes";

// ====================================================
// GraphQL mutation operation: ConnectStripe
// ====================================================

export interface ConnectStripe_connectStripe {
  __typename: "Viewer";
  hasWallet: boolean | null;
}

export interface ConnectStripe {
  connectStripe: ConnectStripe_connectStripe;
}

export interface ConnectStripeVariables {
  input: ConnectStripeInput;
}
