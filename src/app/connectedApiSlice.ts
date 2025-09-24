import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "./store";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { logout, setAccessToken } from "@/auth/authSlice";
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
    //handle 401 errors here

    const refresh_token = (api.getState() as RootState).auth.refresh_token;

    if (refresh_token) {
      const authApiUrl = import.meta.env.VITE_CONNECTED_BACKEND_URL;
      try {
        const refreshRequest = await fetch(`${authApiUrl}/refresh`, {
          method: "POST",
          headers: {
            authorization: `Bearer ${refresh_token}`,
          },
        });

        const refreshResult = await refreshRequest.json();

        if (!refreshRequest.ok) {
          throw new Error("Failed to refresh token");
        }

        if (refreshResult.access_token) {
          // set token in local storage
          localStorage.setItem(
            "access_token",
            JSON.stringify({
              access_token: refreshResult.access_token,
            })
          );

          //set token in the state
          api.dispatch(
            setAccessToken({ access_token: refreshResult.access_token })
          );

          // Retry the initial query with the refreshed token.
          result = await baseQuery(args, api, extraOptions);
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        alert("Session expired, Please signin to continue");
        api.dispatch(logout());
      }
    } else {
      //log the user out if you cant find a refresh token
      alert("Session expired, Please signin to continue");
      api.dispatch(logout());

      return {
        error: { status: result.error.status, data: result.error.data },
      };
    }
  }

  if (result.error) {
    // handle all other errors here
    return {
      error: result.error,
    };
  }

  //return the response
  return result;
};

export const connectedApiSlice = createApi({
  reducerPath: "connectedApi",
  baseQuery: baseQueryWithErrorHandling,
  endpoints: () => ({}),
});
