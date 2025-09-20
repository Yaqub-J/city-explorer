import { Typography, styled } from "@mui/material";

const LessonPlanLabel = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontSize: "16px",
  fontWeight: 700,
  lineHeight: "23px",
}));

const LessonPlanValue = styled(Typography)(() => ({
  color: "#1E1E1E ",
  fontSize: "16px",
  fontWeight: 400,
  lineHeight: "23px",
}));

export { LessonPlanLabel, LessonPlanValue };
