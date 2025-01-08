import {
  BestSellingAttractions,
  Blogs,
  Home,
  InitialAttractionDestiantions,
  InitialCountries,
  InitialCurrencies,
  InitialHotelDestinations,
  SelectedCurrency,
  TopAttractions,
} from "@/data/general/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

type InitialState = {
  UAE: InitialCountries;
  selectedCurrency: SelectedCurrency;
  countries: InitialCountries[];
  attractionDestinations: InitialAttractionDestiantions[];
  currencies: InitialCurrencies[];
  hotelDestinations: InitialHotelDestinations[];
  globalData: {
    home: Home;
    topAttractions: TopAttractions[];
    bestSellingAttractions: BestSellingAttractions[];
    blogs: Blogs[];
  };
};

const UAE_FLAG =
  "https://cdn.jsdelivr.net/npm/svg-country-flags@1.2.10/svg/ae.svg";

const initialState = {
  UAE: {},
  selectedCurrency: {
    isocode: "AED",
    conversionRate: 1,
    flag: UAE_FLAG,
  },
  countries: [],
  attractionDestinations: [],
  currencies: [],
  hotelDestinations: [],
  globalData: {
    home: {},
    topAttractions: [],
    bestSellingAttractions: [],
    blogs: [],
  },
} as InitialState;



export const initials = createSlice({
  name: "initials",
  initialState: initialState,
  reducers: {
    changeCurrencyInitials: (state, action) => {
      state.selectedCurrency = {
        isocode: action.payload?.isocode,
        conversionRate: action.payload?.conversionRate,
        flag: action.payload?.flag,
      };
      typeof window !== "undefined" &&
        localStorage.setItem(
          "currency",
          JSON.stringify(state.selectedCurrency)
        );
    },
    setInitialData: (state, action) => {
      state.countries = action.payload.countries;
      state.attractionDestinations = action.payload.destinations;
      state.currencies = action.payload.currencies;
      state.hotelDestinations = action.payload.popularHotelCities;

      const localCurrency =
        typeof window !== "undefined" && localStorage.getItem("currency");

      // Settiing up the selected currency all time initially on page load.
      if (localCurrency) {
        const parsedCurrency = JSON.parse(localCurrency);

        if (parsedCurrency) {
          const objIndex = state.currencies?.findIndex((currency) => {
            return (
              currency?.isocode?.toUpperCase() ===
              parsedCurrency?.isocode?.toUpperCase()
            );
          });
          if (objIndex !== -1) {
            state.selectedCurrency = {
              isocode: state.currencies[objIndex]?.isocode || "AED",
              conversionRate: state.currencies[objIndex]?.conversionRate || 1,
              flag: state.currencies[objIndex]?.country?.flag || UAE_FLAG,
            };
          } else {
            state.selectedCurrency = {
              isocode: "AED",
              conversionRate: 1,
              flag: UAE_FLAG,
            };
          }
        } else {
          state.selectedCurrency = {
            isocode: "AED",
            conversionRate: 1,
            flag: UAE_FLAG,
          };
        }
      }

      // Setting the UAE country data with iso code initially.
      state.UAE = action.payload?.countries?.find(
        (item: InitialCountries) => item?.isocode === "AE"
      );
    },
    // setting Home global Data.
    setGlobalHomeData: (state, action) => {
      state.globalData.home = action.payload.home;
      state.globalData.blogs = action.payload.recentBlogs;
      state.globalData.topAttractions = action.payload.topAttractions;
      state.globalData.bestSellingAttractions =
        action.payload.bestSellingAttractions;
    },
  },

});

export const { setInitialData, changeCurrencyInitials, setGlobalHomeData } =
  initials.actions;
export default initials.reducer;
