import { Fade, FormHelperText } from "@mui/material";

export default function FormHelperErrorText({ children }) {
  return (
    <Fade in={Boolean(children)} appear={false}>
      <FormHelperText sx={{ color: "error.main", height: 15 }}>
        {children}
      </FormHelperText>
    </Fade>
  );
}
