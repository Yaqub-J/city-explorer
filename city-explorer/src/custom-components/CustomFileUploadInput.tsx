import { Box, CircularProgress, SvgIcon, Typography } from "@mui/material";
import UploadIcon from "../assets/icons/upload.svg?react";
import { useRef } from "react";

type Props = {
  placeHolder: string;
  isLoading: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (e: any) => Promise<void>;
  value: string | number;
};

const CustomFileUploadInput = ({
  placeHolder,
  isLoading,
  onChange,
  value,
}: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <Box
        sx={{
          width: "100%",
          height: "54px",
          borderRadius: "4px",
          border: "1px solid #CDD0D5",
          display: "flex",
          alignContent: "center",
          alignItems: "center",
          p: "14px",
          justifyContent: "space-between",
          cursor: "pointer",
        }}
        onClick={() => fileInputRef.current?.click()}
      >
        {isLoading ? (
          <CircularProgress size={24} />
        ) : (
          <SvgIcon component={UploadIcon} />
        )}
        <Typography
          sx={{
            color: value ? "#6F6F67" : "#C3C3C0",
            fontSize: "15px",
            lineHeight: "16px",
            letterSpacing: "0em",
            overflow: "hidden",
          }}
        >
          {value || placeHolder}
        </Typography>
      </Box>
      <input
        style={{ display: "none" }}
        type="file"
        ref={fileInputRef}
        onChange={onChange}
        accept={"pdf, docx"}
      />
    </>
  );
};

export default CustomFileUploadInput;
