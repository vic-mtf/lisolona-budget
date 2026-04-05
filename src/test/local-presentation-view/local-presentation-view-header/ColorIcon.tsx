import ColorLensIcon from "@mui/icons-material/ColorLens";

const ColorIcon = ({ color }) => {
  return (
    <ColorLensIcon
      // color={color}
      fontSize='small'
      sx={{
        border: (t) => "1.5px solid " + t.palette.text.primary,
        borderRadius: "50%",
        color,
      }}
    />
  );
};

export default ColorIcon;
