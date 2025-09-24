/* eslint-disable @typescript-eslint/no-explicit-any */

import { connectedApiSlice } from "../app/connectedApiSlice";

export const submissionApiSlice = connectedApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createRecord: builder.mutation<
      any,
      {
        base_id: string;
        table_id: string;
        fields: {
          Email: string;
          Feedback: string;
          Rating: string | number | null;
        };
      }
    >({
      query: (values) => ({
        url: "/service/form/record/airtable",
        method: "POST",
        body: { ...values },
      }),
    }),
  }),
});

export const { useCreateRecordMutation } = submissionApiSlice;
