import {
  ActivityExcursion,
  ActivityTypeEnum,
  ExcursionDetails,
  SearchByDestination,
  TransferTypeEmun,
} from "@/data/attraction/types";
import { TransferCart, TransferExcursion } from "@/data/transfer/types";
import { createSlice } from "@reduxjs/toolkit";
import { UUID } from "crypto";
import { addDays } from "date-fns";

type InitialState = {
  transfer: TransferExcursion[];
  transferCart: TransferCart[];
  alertSuccess: {
    status: boolean;
    title: string;
    text: string;
  }
};

var cartItems =
  typeof window !== "undefined" && localStorage.getItem("TransferCart");


const initialState = {
  transfer: [],
  transferCart: cartItems ? JSON.parse(cartItems) : [],
  alertSuccess: {
    status: false,
    title: "",
    text: "",
  },
} as InitialState;

export const attraction = createSlice({
  name: "transfer",
  initialState: initialState,
  reducers: {
    // This store activity data just after fetching attraction api call. and appending additional initial values.
    storeTransferResults: (state, action) => {
      state.transfer = action.payload;
      // const attraction = action.payload.attraction;
      // for (let i = 0; i < action.payload.activity.length; i++) {
      //   let activity = state.transfer[i];
      //   activity.isChecked = false;
      //   activity.adultCount = 1;
      //   activity.childCount = 0;
      //   activity.hourCount = 1;
      //   activity.infantCount = 0;
      //   activity.vehicles = [];
      //   activity.grandTotal = 0;
      //   activity.isPromoAdded = false;
      //   activity.appliedPromoAmount = 0;
      //   activity.priceWithoutPromoGrandTotal = 0;

      //   if (action.payload.initialDate && action.payload.initialDate.length) {
      //     activity.date = new Date(action.payload.initialDate);
      //   } else if (attraction.bookingPriorDays) {
      //     activity.date = addDays(
      //       new Date(),
      //       Number(attraction.bookingPriorDays)
      //     );
      //   } else {
      //     activity.date = activity.date = addDays(new Date(), 1);
      //   }

      //   // Boolean for either transfer of [x] exist.
      //   const isPrivateTransferAvail =
      //     activity?.isPrivateTransferAvailable &&
      //     activity?.privateTransfers?.length;
      //   const isSharedTransferAvail =
      //     activity?.isSharedTransferAvailable && activity.sharedTransferPrice;

      //   // Initially setting the transferType.
      //   if (activity?.activityType !== ActivityTypeEnum.transfer) {
      //     activity.transferType = TransferTypeEmun.without;
      //   } else if (isPrivateTransferAvail) {
      //     activity.transferType = TransferTypeEmun.private;
      //   } else if (isSharedTransferAvail) {
      //     activity.transferType = TransferTypeEmun.shared;
      //   }
      // }
    },
    //   setAttractionDestination: (state, action) => {
    //     state.Destination = action.payload?.Destination;
    //   },
    // handle change in value of each activity in this array of activity.
    handleChangeActivityData: (state, action) => {
      const { index, keyName, value } = action.payload;
      state.transfer[index] = {
        ...state.transfer[index],
        [keyName]: value,
      };
    },
    setAlertSuccess: (state, action) => {
      state.alertSuccess = {
        status: action.payload?.status,
        title: action.payload?.title,
        text: action.payload?.text,
      };
    },
    // Handling date to all activity below.
    //   handleDateChange: (state, action) => {
    //     for (let i = 0; i < state.transfer.length; i++) {
    //       state.transfer[i].date = action.payload;
    //     }
    //   },
    // Handling add to cart functionality.
    handleAddtocart: (state, action) => {
      let transferArray: TransferCart[] = [];
      let selectedArray: any[] = action.payload;
      const localStorageCart =
        typeof window !== "undefined" && localStorage.getItem("TransferCart");
    
      if (localStorageCart) {
        transferArray = JSON.parse(localStorageCart);
      }
    
      for (const selectedTransferItem of selectedArray) {
        const { date, time, transferType, pickupLocationId, dropOffLocationId, returnDate, returnTime, pickupDate, pickupTime } = selectedTransferItem;
    
        // Check if there is a trip with the same details
        const existingTripIndex = transferArray.findIndex(
          (trip: TransferCart) => 
            trip.trips[0].date === pickupDate
            && trip.trips[0].time === pickupTime
            && trip.trips[0].transferType === transferType
            && trip.trips[0].transferFrom._id === pickupLocationId
            && trip.trips[0].transferTo._id === dropOffLocationId
        );
    
        if (existingTripIndex !== -1) {
          // Trip already exists
          const trip = transferArray[existingTripIndex].trips[0]; // Retrieve the trip
          if (transferType === "return" && trip.returnDate === date && trip.returnTime === time) {
            // If it's a return trip with matching returnDate and returnTime, add to returnVehicle
            trip.returnVehicle.push(selectedTransferItem.vehicle);
          } else {
            // If it's not a return trip, or if returnDate and returnTime do not both match, add to vehicles
            trip.vehicles.push(selectedTransferItem.vehicle);
          }
        } else {
          // Create a new trip and add it to the transferArray
          const newTrip = {
            _id: selectedTransferItem._id,
            date,
            time,
            returnDate: selectedTransferItem.returnDate,
            pickupDate: selectedTransferItem.pickupDate,
            returnTime: selectedTransferItem.returnTime,
            pickupTime: selectedTransferItem.pickupTime,
            noOfAdults: selectedTransferItem.noOfAdults,
            noOfChildrens: selectedTransferItem.noOfChildrens,
            transferType: transferType,
            suggestionType: selectedTransferItem.pickupSuggestionType,
            transferFrom: {
              _id: pickupLocationId,
              airportName: selectedTransferItem.pickupLocation,
              place: "",
              pickupSuggestionType: selectedTransferItem.pickupSuggestionType
            },
            transferTo: {
              _id: dropOffLocationId,
              areaCode: "",
              areaName: selectedTransferItem.dropOffLocation,
              dropOffSuggestionType: selectedTransferItem.dropOffSuggestionType,
              city: "",
              state: "",
              country: "",
              isDeleted: false,
              createdAt: "",
              updatedAt: "",
              __v: 0,
              name: "",
            },
            vehicles: transferType === "return" && returnDate !== date || returnTime !== time ? [selectedTransferItem.vehicle] : [],
            returnVehicle: transferType === "return" && returnDate === date && returnTime === time ? [selectedTransferItem.vehicle] : [],
          };
    
          transferArray.push({
            trips: [newTrip],
          });
        }
      }
    
      typeof window !== "undefined";
      localStorage.setItem("TransferCart", JSON.stringify(transferArray));
    
      state.transferCart = transferArray || [];
    },
    
    
    




    // Removing one attaraction from the cart.
    handleRemoveFromTransferCart: (state, action) => {
      const tripIndexToRemove = action.payload;
    
      const updatedCart = state.transferCart.filter((_, index) => index !== tripIndexToRemove);
    
      console.log(`Updated cart after removing trip at index ${tripIndexToRemove}:`, updatedCart);
    
      state.transferCart = updatedCart as any;
    
      // Update local storage
      typeof window !== "undefined" &&
        localStorage.setItem("TransferCart", JSON.stringify(updatedCart));
    },
    
    
    
    

    // Emptying the full cart.
    handleEmptyTransferCart: (state, action) => {
      const cart: TransferExcursion[] = [];
      state.transferCart = cart as any;
      typeof window !== "undefined";
      localStorage.setItem("TransferCart", JSON.stringify(cart));
      localStorage.removeItem("TransferCart");
    },
    // handle change data of cart.
    handleChangeCart: (state, action) => {
      const { index, keyName, value } = action.payload;
      state.transferCart[index] = { ...state.transferCart[index], [keyName]: value };
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


      } else {
        array = [action.payload, ...array];


      }
    },
  },
});

export const {
  storeTransferResults,
  handleChangeActivityData,
  // handleDateChange,
  handleAddtocart,
  handleRemoveFromTransferCart,
  handleEmptyTransferCart,
  handleChangeCart,
  setAlertSuccess,
  handleSetFavourites,
  // setAttractionDestination,
} = attraction.actions;
export default attraction.reducer;
