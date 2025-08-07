import { alpha } from "@mui/material";

const scrollBarSx = {
  overflowY: "overlay",
  [`&::-webkit-scrollbar`]: {
    width: { xs: 0, md: 6 },
    height: { xs: 0, md: 6 },
    position: "absolute",
    right: 0,
    overflowY: "overlay",
  },
  [`&::-webkit-scrollbar-thumb`]: { backgroundColor: "transparent" },

  [`&::-webkit-scrollbar-button`]: {
    // bgcolor: "red",
    // cursor: "pointer",
    display: "none",
  },
  [`&:hover`]: {
    [`&::-webkit-scrollbar-thumb`]: {
      backgroundColor: (theme) =>
        alpha(
          theme.palette.common[
            theme.palette.mode === "light" ? "black" : "white"
          ],
          0.2
        ),
      borderRadius: 0.5,
    },
    [`&::-webkit-scrollbar-thumb:hover`]: {
      backgroundColor: (theme) =>
        alpha(
          theme.palette.common[
            theme.palette.mode === "light" ? "black" : "white"
          ],
          0.4
        ),
    },
  },
};

export default scrollBarSx;
