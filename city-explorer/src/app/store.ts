import { configureStore } from "@reduxjs/toolkit";
import { authApiSlice } from "./authApiSlice";
import { connectedApiSlice } from "./connectedApiSlice";
import { authReducer } from "@/auth/authSlice";

const store = configureStore({
  reducer: {
    [connectedApiSlice.reducerPath]: connectedApiSlice.reducer,
    [authApiSlice.reducerPath]: authApiSlice.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(connectedApiSlice.middleware)
      .concat(authApiSlice.middleware), // caching middlewares
  devTools: true, // developer tools middleware
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
