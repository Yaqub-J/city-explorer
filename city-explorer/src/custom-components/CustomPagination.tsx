import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import { StyledPaper } from "./styled/styledPaper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import React, { useState } from "react";

interface Props {
  title: string;
  pages: number;
  pageSize: number;
  setPageSize: React.Dispatch<React.SetStateAction<number>>;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

const CustomPagination = ({
  title,
  pages,
  pageSize,
  setPageSize,
  currentPage,
  setCurrentPage,
}: Props) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // const getPageRange = () => {
  //   const start = (currentPage - 1) * pageSize + 1;
  //   const end = Math.min(currentPage * pageSize, pages);
  //   return `${start}-${end} of ${pages}`;
  // };

  return (
    <Box>
      <StyledPaper sx={{ borderRadius: "8px", py: 1 }}>
        <Stack
          direction="row"
          alignItems="center"
          width="90%"
          marginX="auto"
          height="56px"
          justifyContent="space-between"
          sx={{
            color: " #555",
            fontSize: "14px",
            fontSeight: 500,
            lineHeight: "22px" /* 157.143% */,
            letterSpacing: " -0.28px",
          }}
        >
          <Typography>
            {/* {getPageRange()} */}
            Page: {currentPage} of {pages}
          </Typography>
          <Stack direction="row" alignItems="center" gap={3}>
            {/* plans per page */}

            <Stack direction="row" alignItems="center" gap={1}>
              <Typography sx={{ textTransform: "capitalize" }}>
                {title} per page
              </Typography>
              <IconButton
                onClick={handleClick}
                sx={{ margin: 0, padding: 0.2, borderRadius: 0 }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  sx={{
                    borderRadius: "5px",
                    border: "1.5px solid #DAD9D7",
                    background: "#FFF",
                    p: 0.5,
                    height: "28px",
                    cursor: "pointer",
                  }}
                >
                  <Typography>{pageSize}</Typography>
                  <KeyboardArrowDownIcon />
                </Stack>
              </IconButton>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
              >
                {[5, 10, 15, 20].map((size, i) => (
                  <MenuItem
                    key={i}
                    onClick={() => {
                      setPageSize(size);
                      handleClose();
                    }}
                  >
                    {size}
                  </MenuItem>
                ))}
              </Menu>
            </Stack>

            {/* pagination controls */}
            <Stack direction="row" gap={0.5} alignItems="center">
              <Box
                sx={{
                  borderRadius: "5px",
                  border: "1.5px solid #DAD9D7",
                  background: "#FFF",
                  height: "28px",
                  width: "28px",
                  cursor: "pointer",
                }}
                onClick={() =>
                  setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))
                }
              >
                <KeyboardArrowLeftIcon />
              </Box>
              <Box
                sx={{
                  borderRadius: "5px",
                  border: "1.5px solid #DAD9D7",
                  background: "#FFF",
                  height: "28px",
                  width: "28px",
                  cursor: "pointer",
                }}
                onClick={() =>
                  setCurrentPage((prevPage) => Math.min(prevPage + 1, pages))
                }
              >
                <KeyboardArrowRightIcon />
              </Box>
            </Stack>
          </Stack>
        </Stack>
      </StyledPaper>
    </Box>
  );
};

export default CustomPagination;
