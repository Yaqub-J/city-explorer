import { Select } from "@mui/material";
import { alpha, styled } from "@mui/material/styles";

const StyledTextField = styled("input")(({ theme }) => ({
  border: "0.5px solid #CCCCCC",
  borderRadius: "12px",
  position: "relative",
  backgroundColor: theme.palette.mode === "light" ? "#fff" : "#025692",
  fontSize: "14px",
  fontWeight: "normal",
  lineHeight: "1.42857143",
  // color: "#1D2026",
  width: "100%",
  height: "56px",
  padding: "6px 16px",
  boxShadow: "0px 1px 1px 0px #00000013 inset",
  outline: "none",
  transition: theme.transitions.create([
    "border-color",
    "background-color",
    "box-shadow",
  ]),

  "&:disabled": {
    backgroundColor: "#eee",
    color: "#888888",
  },

  "&:focus": {
    boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
    borderColor: theme.palette.primary.main,
  },
}));

const StyledFilledInput = styled("input")(() => ({
  borderRadius: "8px",
  background: "#F4F4F4",
  outline: "none",
  border: "none",
  padding: "6px 16px",
  width: "100%",
  fontWeight: 700,
  fontSize: "15.88px",
  height: "56px",
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  "label + &": {
    marginTop: theme.spacing(3),
  },
  "& .MuiInputBase-input": {
    borderRadius: 4,
    position: "relative",
    backgroundColor: theme.palette.mode === "light" ? "#fff" : "#2b2b2b",
    border: "1px solid #CDD0D5",
    fontSize: "15px",
    lineHeight: "1.42857143",
    color: "#555",
    width: "100%",
    height: "54px !important",
    padding: "6px 12px",
    boxShadow: "inset 0 1px 1px rgb(0 0 0 / 8%)",
    transition: theme.transitions.create([
      "border-color",
      "background-color",
      "box-shadow",
    ]),

    "&:focus": {
      boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
      borderColor: theme.palette.primary.main,
    },
  },
}));

const StyledFileInput = styled("input")(({ theme }) => ({
  "label + &": {
    marginTop: theme.spacing(3),
  },
  borderRadius: 4,
  position: "relative",
  backgroundColor: theme.palette.mode === "light" ? "#fff" : "#2b2b2b",
  border: "1px solid #ccc",
  fontSize: "15px",
  lineHeight: "1.42857143",
  color: "#555",
  width: "100%",
  padding: "5px 12px",
  boxShadow: "inset 0 1px 1px rgb(0 0 0 / 8%)",
  transition: theme.transitions.create([
    "border-color",
    "background-color",
    "box-shadow",
  ]),

  "&:focus": {
    boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
    borderColor: theme.palette.primary.main,
  },
}));

const StyledTextArea = styled("textarea")(({ theme }) => ({
  border: "0.5px solid #CCCCCC",
  borderRadius: "12px",
  position: "relative",
  backgroundColor: theme.palette.mode === "light" ? "#fff" : "#025692",
  fontSize: "14px",
  fontWeight: "normal",
  lineHeight: "1.42857143",
  width: "100%",
  minHeight: "120px", // Set a minimum height
  padding: "12px 16px",
  boxShadow: "0px 1px 1px 0px #00000013 inset",
  outline: "none",
  resize: "vertical", // Allow vertical resizing
  fontFamily: "inherit",
  transition: theme.transitions.create([
    "border-color",
    "background-color",
    "box-shadow",
  ]),

  "&:disabled": {
    backgroundColor: "#eee",
    color: "#888888",
  },

  "&:focus": {
    boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
    borderColor: theme.palette.primary.main,
  },
}));

const StyledVerificationInput = styled("input")(({ theme }) => ({
  padding: "4px",
  borderRadius: "4px",
  border: "2px solid",
  borderColor: theme.palette.primary.main,
  outline: "none",
  marginRight: "8px",
  transition: theme.transitions.create([
    "border-color",
    "background-color",
    "box-shadow",
  ]),
  "&:focus": {
    borderColor: theme.palette.primary.main,
    color: "black",
  },
  [theme.breakpoints.up("xs")]: {
    width: "48px !important",
    height: "48px !important",
    fontSize: "20px",
  },

  [theme.breakpoints.up("md")]: {
    width: "48px !important",
    height: "48px !important",
    fontSize: "20px",
  },
}));

export {
  StyledTextField,
  StyledFilledInput,
  StyledSelect,
  StyledFileInput,
  StyledTextArea,
  StyledVerificationInput,
};
