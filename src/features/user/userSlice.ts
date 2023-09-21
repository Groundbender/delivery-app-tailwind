import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getAddress, ICoords } from "../../services/apiGeocoding";

const getPosition = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

export const fetchAddress = createAsyncThunk<
  {
    position: ICoords;
    address: string;
  },
  void,
  { rejectValue: string }
>("user/fetchAddress", async (_, { rejectWithValue }) => {
  const positionObj = (await getPosition()) as GeolocationPosition;

  if (typeof positionObj === "undefined") {
    return rejectWithValue("Failed getting position");
  }

  const position = {
    latitude: positionObj.coords.latitude,

    longitude: positionObj.coords.longitude,
  };

  const addressObj = await getAddress(position);
  const address = `${addressObj?.locality}, ${addressObj?.city} ${addressObj?.postcode}, ${addressObj?.countryName}`;

  return { position, address };
});

type UserSlice = {
  username: string;
  status: "idle" | "loading" | "error";
  position: ICoords;
  address: string;
  error: string;
};

const initialState: UserSlice = {
  username: "",
  status: "idle",
  position: {} as ICoords,
  address: "",
  error: "",
};

const userSlice = createSlice({
  initialState: initialState,
  name: "user",
  reducers: {
    updateName(state, action: PayloadAction<string>) {
      state.username = action.payload;
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(fetchAddress.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAddress.fulfilled, (state, action) => {
        state.status = "idle";
        state.position = action.payload.position;
        state.address = action.payload.address;
      })
      .addCase(fetchAddress.rejected, (state, action) => {
        state.status = "error";
        state.error = action.error.message || "Failed getting address";
      }),
});

export const { updateName } = userSlice.actions;
export default userSlice.reducer;
