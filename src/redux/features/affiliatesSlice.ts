import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

type RootState = {
  users: {
    jwtToken: string; // Adjust the type as per your state structure
    // Add other properties if needed
  };
};

const initialState = {
  affiliateUser: {},
  navigated: false,
  visaNavigated: false,
  clickedAttractions: [],
  attractions: [],
  cryptoData: {
    type: "crypto",
    address: "",
    network: "",
  },
  bankData: {
    bankName: "",
    accountHolderName: "",
    ifsc: "",
    iban: "",
    accountNumber: "",
    countryCode: "UAE",
    type: "bank",
  },
  redeemData: {
    selectedId: "",
    points: "",
    currency: "AED",
  },
};

const fetchAffiliateUser = createAsyncThunk(
  "affiliateSlice/fetchAffiliateUser",
  async (_, { getState }) => {
    const state = getState() as RootState;
    if (state.users.jwtToken) {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/affiliate/single/user`,
        {
          headers: {
            authorization: `Bearer ${state.users.jwtToken}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json(); // Parse the response data
        return data;
      } else {
        throw Error("Failed to fetch user data");
      }
    } else {
      throw Error("");
    }
  }
);

const actionType = {
  FETCH_AFFILIATE_USER: `${fetchAffiliateUser.fulfilled}`,
};

const affiliateUsersSlice = createSlice({
  name: "affiliateUser",
  initialState,
  reducers: {
    setAffiliateUser: (state, action) => {
      state.affiliateUser = action.payload?.affiliationUser;
      state.clickedAttractions = action?.payload?.attractions;
    },
    setNavigation: (state, action) => {
      state.navigated = action.payload?.navigated;
    },
    setVisaNavigation: (state, action) => {
      state.visaNavigated = action.payload?.visaNavigated;
    },
    setAffiliateUserPaymentCryptoData:(state, {payload})=>{
      state.bankData = {
        bankName: "",
        accountHolderName: "",
        ifsc: "",
        iban: "",
        accountNumber: "",
        countryCode: "",
        type: "",
      };
      state.cryptoData = { ...state.cryptoData, [payload.name]: payload.value };
      state.cryptoData.type = "crypto";
    },

    setAffiliateUserPaymentBankData: (state, { payload }) => {
      state.cryptoData = {
        type: "",
        address: "",
        network: "",
      };
      if (payload.name === "countryCode" && payload.value === "IND") {
        if (state?.bankData?.iban) {
          state.bankData.iban = "";
        }
      } else if (payload.name === "countryCode" && payload.value === "UAE") {
        if (state?.bankData?.ifsc) {
          state.bankData.ifsc = "";
        }
      } else if (payload.name === "countryCode" && payload.value === "US") {
        if (state.bankData.iban) {
          state.bankData.iban = "";
        }
      } else if (payload.name === "countryCode" && payload.value === "UK") {
        if (state.bankData.ifsc) {
          state.bankData.ifsc = "";
        }
      }
      state.bankData.type = "bank";
      state.bankData = { ...state.bankData, [payload.name]: payload.value };
    },

    setEditDataWithdrawalMenthod: (state, { payload }) => {
      if (payload.type === "crypto") {
        (state.cryptoData.address = payload.address),
          (state.cryptoData.network = payload.network),
          (state.cryptoData.type = payload.type);

        state.bankData = {
          bankName: "",
          accountHolderName: "",
          ifsc: "",
          iban: "",
          accountNumber: "",
          countryCode: "",
          type: "",
        };
      } else if (payload.type === "bank") {
        (state.bankData.type = payload.type),
          (state.bankData.accountHolderName = payload.accountHolderName),
          (state.bankData.accountNumber = payload.accountNumber),
          (state.bankData.bankName = payload.bankName);

        if (payload.iban) {
          (state.bankData.iban = payload.iban), (state.bankData.ifsc = "");
        } else if (payload.ifsc) {
          (state.bankData.ifsc = payload.ifsc), (state.bankData.iban = "");
        }
        state.bankData.countryCode = payload.countryCode;

        state.cryptoData = {
          type: "",
          address: "",
          network: "",
        };
      }
    },

    setAffiliateRedeem: (state, { payload }) => {
      state.redeemData = { ...state.redeemData, [payload.name]: payload.value };
    },

    setAffiliateAttractions: (state, { payload }) => {
      // state.attractions.push(payload);
    },
  },
  extraReducers: {
    [actionType?.FETCH_AFFILIATE_USER]: (state, action) => {
      state.affiliateUser = action.payload?.affiliationUser;
      state.clickedAttractions = action?.payload?.attractions;
    },
  },
});

export { fetchAffiliateUser };

export const {
  setAffiliateUser,
  setAffiliateUserPaymentCryptoData,
  setAffiliateUserPaymentBankData,
  setEditDataWithdrawalMenthod,
  setAffiliateRedeem,
  setAffiliateAttractions,
  setNavigation,
  setVisaNavigation

 } = affiliateUsersSlice.actions;

export default affiliateUsersSlice.reducer;
