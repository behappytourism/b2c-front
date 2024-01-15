import { createSlice } from "@reduxjs/toolkit";

type VisaState = {
  Nationality: string;
  documentSubmitted: boolean;
  Adults: number;
  Childs: number;
  adultTraveller: {
    paxType: string;
    title: string;
    firstName: string;
    lastName: string;
    email: string;
    country: string;
    contactNo: string;
    passportNo: string;
    expiryDate: {
      day: string;
      month: string;
      year: string;
    };
    dateOfBirth: {
      day: string;
      month: string;
      year: string;
    };
  }[];
  childTraveller: {
    paxType: string;
    title: string;
    firstName: string;
    lastName: string;
    email: string;
    country: string;
    contactNo: string;
    passportNo: string;
    expiryDate: {
      day: string;
      month: string;
      year: string;
    };
    dateOfBirth: {
      day: string;
      month: string;
      year: string;
    };
  }[];
};

const travellerAdultArray: {
  paxType: string;
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  contactNo: string;
  passportNo: string;
  expiryDate: {
    day: string;
    month: string;
    year: string;
  };
  dateOfBirth: {
    day: string;
    month: string;
    year: string;
  };
}[] = [];

const travellerChildArray: {
  paxType: string;
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  contactNo: string;
  passportNo: string;
  expiryDate: {
    day: string;
    month: string;
    year: string;
  };
  dateOfBirth: {
    day: string;
    month: string;
    year: string;
  };
}[] = [];

const initialState: VisaState = {
  Nationality: "",
  documentSubmitted: false,
  adultTraveller: travellerAdultArray,
  childTraveller: travellerChildArray,
  Adults: 1,
  Childs: 0,
};

export const visa = createSlice({
  name: "visa",
  initialState,
  reducers: {
    setInitialData: (state, action) => {
      state.Nationality = action.payload.Nationality;
    },
    setDocumentSubmitted: (state, action) => {
      state.documentSubmitted = action.payload.documentSubmitted;
    },
    updateTraveller: (state, action) => {
      const { index, field, value } = action.payload;
      state.adultTraveller[index] = {
        ...state.adultTraveller[index],
        [field]: value,
      };
    },
    updateChildTraveller: (state, action) => {
      const { index, field, value } = action.payload;
      state.childTraveller[index] = {
        ...state.childTraveller[index],
        [field]: value,
      };
    },
    handleAdultDOB: (state, action) => {
      const { index, field, value } = action.payload;
      state.adultTraveller[index] = {
        ...state.adultTraveller[index],
        dateOfBirth: {
          ...state.adultTraveller[index].dateOfBirth,
          [field]: value,
        },
      };
    },
    handleChildDOB: (state, action) => {
      const { index, field, value } = action.payload;
      state.childTraveller[index] = {
        ...state.childTraveller[index],
        dateOfBirth: {
          ...state.childTraveller[index].dateOfBirth,
          [field]: value,
        },
      };
    },
    handleAdultPPExpiry: (state, action) => {
      const { index, field, value } = action.payload;
      state.adultTraveller[index] = {
        ...state.adultTraveller[index],
        expiryDate: {
          ...state.adultTraveller[index].expiryDate,
          [field]: value,
        },
      };
    },
    handleChildPPExpiry: (state, action) => {
      const { index, field, value } = action.payload;
      state.childTraveller[index] = {
        ...state.childTraveller[index],
        expiryDate: {
          ...state.childTraveller[index].expiryDate,
          [field]: value,
        },
      };
    },
    setAdult: (state, action) => {
      const numberOfAdults = action.payload;

      state.Adults = numberOfAdults;
      state.adultTraveller = []; // Clear the existing adultTraveller array

      for (let i = 0; i < numberOfAdults; i++) {
        state.adultTraveller.push({
          paxType: "ADT",
          title: "",
          firstName: "",
          lastName: "",
          email: "",
          country: "",
          contactNo: "",
          passportNo: "",
          expiryDate: {
            day: "",
            month: "",
            year: "",
          },
          dateOfBirth: {
            day: "",
            month: "",
            year: "",
          },
        });
      }
    },
    setChild: (state, action) => {
      const numberOfChilds = action.payload;

      state.Childs = numberOfChilds;
      state.childTraveller = []; // Clear the existing adultTraveller array

      for (let i = 0; i < numberOfChilds; i++) {
        state.childTraveller.push({
          paxType: "CHD",
          title: "",
          firstName: "",
          lastName: "",
          email: "",
          country: "",
          contactNo: "",
          passportNo: "",
          expiryDate: {
            day: "",
            month: "",
            year: "",
          },
          dateOfBirth: {
            day: "",
            month: "",
            year: "",
          },
        });
      }
    },
  },
});

export const {
  setInitialData,
  updateTraveller,
  updateChildTraveller,
  setAdult,
  setChild,
  handleAdultDOB,
  handleAdultPPExpiry,
  handleChildDOB,
  handleChildPPExpiry,
  setDocumentSubmitted,
} = visa.actions;
export default visa.reducer;
