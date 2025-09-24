import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import type { RootState } from "./store";
import { logout } from "@/auth/authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_CONNECTED_BACKEND_URL,
  //credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const access_token = (getState() as RootState).auth.access_token;
    if (access_token) {
      headers.set("authorization", `Bearer ${access_token}`);
    }
    return headers;
  },
});

// Custom base query function with authentication and token refresh handling.
const baseQueryWithErrorHandling: BaseQueryFn<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  string | FetchArgs | any,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  let retryCount = 0;
  while (
    result.error &&
    "originalStatus" in result.error &&
    result.error.originalStatus === 502 &&
    retryCount < 1
  ) {
    //icrement and retry
    retryCount++;
    result = await baseQuery(args, api, extraOptions);
  }

  if (result.error && result.error.status === 401) {
    //log the user out if refresh token isnt found
    // alert("Session expired, Please signin to continue");
    api.dispatch(logout()); // logout user
  }

  return result;
};

export const authApiSlice = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithErrorHandling,
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (values) => ({
        url: "/login",
        method: "POST",
        body: { ...values },
      }),
    }),

    register: builder.mutation({
      query: (values) => ({
        url: "/register",
        method: "POST",
        body: { ...values },
      }),
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation } = authApiSlice;
