import { Paper, styled } from "@mui/material";

const StyledPaper = styled(Paper)(() => ({
  borderRadius: "4px",
  boxShadow: "0 1px 2px rgb(0 0 0 / 5%), 0 0 0 1px rgb(63 63 68 / 10%)",

  "& .paperHeader": {
    padding: "15px 15px 0",
  },
  "& .paperBody": {
    padding: "15px 15px 10px 15px",
  },
}));

export { StyledPaper };
