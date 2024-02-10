import {
    ActivityExcursion,
    ActivityTypeEnum,
    ExcursionDetails,
    SearchByDestination,
    TransferTypeEmun,
  } from "@/data/attraction/types";
import { TransferExcursion } from "@/data/transfer/types";
  import { createSlice } from "@reduxjs/toolkit";
  import { UUID } from "crypto";
  import { addDays } from "date-fns";
  
  type InitialState = {
    transfer: TransferExcursion[];
    transferCart: TransferExcursion[];
  };
  
  var cartItems =
    typeof window !== "undefined" && localStorage.getItem("TransferCart");

  
  const initialState = {
    transfer: [],
    transferCart: cartItems ? JSON.parse(cartItems) : [],
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
      // Handling date to all activity below.
    //   handleDateChange: (state, action) => {
    //     for (let i = 0; i < state.transfer.length; i++) {
    //       state.transfer[i].date = action.payload;
    //     }
    //   },
      // Handling add to cart functionality.
      handleAddtocart: (state, action) => {
        let transferArray = [];
        let selectedArray = action.payload;
        const localStorageCart =
            typeof window !== "undefined" && localStorage.getItem("TransferCart");
    
        // parsing the data
        if (localStorageCart) {
            transferArray = JSON.parse(localStorageCart);
        }
    
        // merge two arrays
        let data = [...transferArray, ...selectedArray];
    
        // remove duplicates based on "_id"
        data = data.filter((item, index, self) =>
            index === self.findIndex((t) => t._id === item._id)
        );
    
        typeof window !== "undefined";
        localStorage.setItem("TransferCart", JSON.stringify(data));
    
        state.transferCart = data || [];
    },
    
      // Removing one attaraction from the cart.
      handleRemoveFromTransferCart: (state, action) => {
        const cart = state.transferCart.filter((item) => {
          return item._id !== action.payload;
        });
        state.transferCart = cart;
        typeof window !== "undefined";
        localStorage.setItem("TransferCart", JSON.stringify(cart));
      },
      // Emptying the full cart.
      handleEmptyCart: (state, action) => {
        const cart: TransferExcursion[] = [];
        state.transferCart = cart;
        typeof window !== "undefined";
        localStorage.setItem("TransferCart", JSON.stringify(cart));
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
    handleEmptyCart,
    handleChangeCart,
    handleSetFavourites,
   // setAttractionDestination,
  } = attraction.actions;
  export default attraction.reducer;
  