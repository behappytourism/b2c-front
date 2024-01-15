import { configureStore } from "@reduxjs/toolkit";
import initialsReducer from "./features/initialsSlice";
import attractionReducer from "./features/attractionSlice";
import visaReducer from "./features/visaSlice";
import usersReducer from "./features/usersSlice";
import affiliateUsers from "./features/affiliatesSlice";
import { TypedUseSelectorHook, useSelector } from "react-redux";

export const store = configureStore({
  reducer: {
    initials: initialsReducer,
    attraction: attractionReducer,
    visa: visaReducer,
    users: usersReducer,
    affiliateUsers: affiliateUsers,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
