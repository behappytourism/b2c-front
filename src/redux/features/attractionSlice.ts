import {
  ActivityExcursion,
  ActivityTypeEnum,
  ExcursionDetails,
  SearchByDestination,
  TransferTypeEmun,
} from "@/data/attraction/types";
import { createSlice } from "@reduxjs/toolkit";
import { UUID } from "crypto";
import { addDays } from "date-fns";

type InitialState = {
  Destination: "";
  activities: ActivityExcursion[];
  cart: ActivityExcursion[];
  favourites: SearchByDestination[];
};

var cartItems =
  typeof window !== "undefined" && localStorage.getItem("AttractionCart");

var favItems =
  typeof window !== "undefined" && localStorage.getItem("favourites");

const initialState = {
  Destination: "",
  activities: [],
  cart: cartItems ? JSON.parse(cartItems) : [],
  favourites: favItems ? JSON.parse(favItems) : [],
} as InitialState;

export const attraction = createSlice({
  name: "attraction",
  initialState: initialState,
  reducers: {
    // This store activity data just after fetching attraction api call. and appending additional initial values.
    storeAttractionActivity: (state, action) => {
      state.activities = action.payload.activity;
      const attraction = action.payload.attraction;
      for (let i = 0; i < action.payload.activity.length; i++) {
        let activity = state.activities[i];
        activity.isChecked = false;
        activity.adultCount = 1;
        activity.childCount = 0;
        activity.hourCount = 1;
        activity.infantCount = 0;
        activity.vehicles = [];
        activity.grandTotal = 0;
        activity.isPromoAdded = false;
        activity.appliedPromoAmount = 0;
        activity.priceWithoutPromoGrandTotal = 0;

        if (action.payload.initialDate && action.payload.initialDate.length) {
          activity.date = new Date(action.payload.initialDate);
        } else if (attraction.bookingPriorDays) {
          activity.date = addDays(
            new Date(),
            Number(attraction.bookingPriorDays)
          );
        } else {
          activity.date = activity.date = addDays(new Date(), 1);
        }

        // Boolean for either transfer of [x] exist.
        const isPrivateTransferAvail =
          activity?.isPrivateTransferAvailable &&
          activity?.privateTransfers?.length;
        const isSharedTransferAvail =
          activity?.isSharedTransferAvailable && activity.sharedTransferPrice;

        // Initially setting the transferType.
        if (activity?.activityType !== ActivityTypeEnum.transfer) {
          activity.transferType = TransferTypeEmun.without;
        } else if (isPrivateTransferAvail) {
          activity.transferType = TransferTypeEmun.private;
        } else if (isSharedTransferAvail) {
          activity.transferType = TransferTypeEmun.shared;
        }
      }
    },
    setAttractionDestination: (state, action) => {
      state.Destination = action.payload?.Destination;
    },
    // handle change in value of each activity in this array of activity.
    handleChangeActivityData: (state, action) => {
      const { index, keyName, value } = action.payload;
      state.activities[index] = {
        ...state.activities[index],
        [keyName]: value,
      };
    },
    // Handling date to all activity below.
    handleDateChange: (state, action) => {
      for (let i = 0; i < state.activities.length; i++) {
        state.activities[i].date = action.payload;
      }
    },
    // Handling add to cart functionality.
    handleAddtocart: (state, action) => {
      var excursionArray = [];
      var selectedArray = action.payload;
      const localStorageCart =
        typeof window !== "undefined" && localStorage.getItem("AttractionCart");

      // parsing the data
      if (localStorageCart) {
        excursionArray = JSON.parse(localStorageCart);
      }

      // merge two array
      let data: ActivityExcursion[] = [...excursionArray, ...selectedArray];

      let array: ActivityExcursion[] = [];
      let uniqueObj: { [key: string]: ActivityExcursion } = {};
      for (let i in data) {
        let id = data[i]["_id"];
        uniqueObj[id] = data[i];
      }

      // unique object of array
      for (let i in uniqueObj) {
        array.push(uniqueObj[i]);
      }

      typeof window !== "undefined";
      localStorage.setItem("AttractionCart", JSON.stringify(array));

      state.cart = array || [];
    },
    // Removing one attaraction from the cart.
    handleRemoveFromCart: (state, action) => {
      const cart = state.cart.filter((item) => {
        return item._id !== action.payload;
      });
      state.cart = cart;
      typeof window !== "undefined";
      localStorage.setItem("AttractionCart", JSON.stringify(cart));
    },
    // Emptying the full cart.
    handleEmptyCart: (state, action) => {
      const cart: ActivityExcursion[] = [];
      state.cart = cart;
      typeof window !== "undefined";
      localStorage.setItem("AttractionCart", JSON.stringify(cart));
    },
    // handle change data of cart.
    handleChangeCart: (state, action) => {
      const { index, keyName, value } = action.payload;
      state.cart[index] = { ...state.cart[index], [keyName]: value };
    },
    // handle favourite in attraction.
    handleSetFavourites: (state, action) => {
      var array = [];
      let localstrg = localStorage.getItem("favourites");
      if (localstrg) {
        array = JSON.parse(localstrg);
      }
      const isItemExist = array.find(
        (item: ExcursionDetails | SearchByDestination) =>
          item._id === action.payload._id
      );
      if (isItemExist) {
        const result = array.filter(
          (item: ExcursionDetails | SearchByDestination) =>
            item._id !== action.payload._id
        );
        array = result;
        state.favourites = array;
        localStorage.setItem("favourites", JSON.stringify(array));
      } else {
        array = [action.payload, ...array];
        state.favourites = array;
        localStorage.setItem("favourites", JSON.stringify(array));
      }
    },
  },
});

export const {
  storeAttractionActivity,
  handleChangeActivityData,
  handleDateChange,
  handleAddtocart,
  handleRemoveFromCart,
  handleEmptyCart,
  handleChangeCart,
  handleSetFavourites,
  setAttractionDestination,
} = attraction.actions;
export default attraction.reducer;
