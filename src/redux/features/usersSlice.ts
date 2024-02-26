import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


type InitialState = {
  user: any;
  jwtToken: string;
  isSiteLoading: boolean;
  isLoggedIn: boolean;
};

const initialState = {
  isSiteLoading: true,
  user: {},
  jwtToken:
    typeof window !== "undefined" && localStorage.getItem("random-string")
      ? localStorage.getItem("random-string")
      : "",
  isLoggedIn: false,
} as InitialState;


const logoutUser = createAsyncThunk(
  "/usersSlice/logoutUser",
  async (_, { getState }) => {
    console.log("logged out succesfully");
  }
);



const usersSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { _id, name, email, country, phoneNumber, balance } =
        action.payload;
      state.user =
        action?.payload?.user ||
        action?.payload?.newUser ||
        action?.payload?.findUser ||
        _id ||
        name ||
        email ||
        country ||
        phoneNumber ||
        balance;
      state.jwtToken = action.payload?.jwtToken || "";
      state.isLoggedIn = true;

      typeof window !== "undefined" &&
        localStorage.setItem("random-string", action.payload?.jwtToken);
    },
  },
  extraReducers(builder) {
    builder.addCase(logoutUser.fulfilled, (state, action) => {
      if (typeof window !== "undefined") {
        localStorage.removeItem("random-string");
      }
      state.jwtToken = "";
      state.user = {}
      state.isLoggedIn = false
      document.location.href = "/";
    });
  },

});

export { logoutUser };

export const { setUser } = usersSlice.actions;

export default usersSlice.reducer;
