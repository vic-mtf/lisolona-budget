import LocalFireDepartmentOutlinedIcon from "@mui/icons-material/LocalFireDepartmentOutlined";
import AcUnitOutlinedIcon from "@mui/icons-material/AcUnitOutlined";
import NightsStayOutlinedIcon from "@mui/icons-material/NightsStayOutlined";
import ContrastOutlinedIcon from "@mui/icons-material/ContrastOutlined";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import Box from "@mui/material/Box";
import ListSubheader from "@mui/material/ListSubheader";
import PropTypes from "prop-types";
import * as React from "react";
import Tooltip from "@mui/material/Tooltip";
import ToggleButton, { toggleButtonClasses } from "@mui/material/ToggleButton";
import ToggleButtonGroup, {
  toggleButtonGroupClasses,
} from "@mui/material/ToggleButtonGroup";
import { styled } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { updateConferenceData } from "../../../../../../redux/conference/conference";

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  justifyContent: "space-between",
  display: "flex",
  [`& .${toggleButtonGroupClasses.firstButton}, & .${toggleButtonGroupClasses.middleButton}`]:
    {
      borderTopRightRadius: (theme.vars || theme).shape.borderRadius,
      borderBottomRightRadius: (theme.vars || theme).shape.borderRadius,
    },
  [`& .${toggleButtonGroupClasses.lastButton}, & .${toggleButtonGroupClasses.middleButton}`]:
    {
      borderTopLeftRadius: (theme.vars || theme).shape.borderRadius,
      borderBottomLeftRadius: (theme.vars || theme).shape.borderRadius,
      borderLeft: `1px solid ${(theme.vars || theme).palette.divider}`,
    },
  [`& .${toggleButtonGroupClasses.lastButton}.${toggleButtonClasses.disabled}, & .${toggleButtonGroupClasses.middleButton}.${toggleButtonClasses.disabled}`]:
    {
      borderLeft: `1px solid ${
        (theme.vars || theme).palette.action.disabledBackground
      }`,
    },
}));

const ToggleFilterButton = () => {
  const dispatch = useDispatch();
  const filter = useSelector(
    (store) => store.conference.setup.devices.processedCameraStream.filter || ""
  );

  return (
    <Box>
      <ListSubheader sx={{ bgcolor: "transparent" }}>Filtres</ListSubheader>
      <StyledToggleButtonGroup
        value={filter}
        sx={{ mx: { xs: 0, md: 2 } }}
        exclusive
        aria-label='filter images'>
        {filters.map(({ icon: Icon = "div", label, value }) => (
          <CustomToggleButton
            key={value}
            title={label}
            value={value}
            aria-label={label}
            onClick={() =>
              dispatch(
                updateConferenceData({
                  key: "setup.devices.processedCameraStream.filter",
                  data: value || null,
                })
              )
            }>
            <Icon />
          </CustomToggleButton>
        ))}
      </StyledToggleButtonGroup>
    </Box>
  );
};

const CustomToggleButton = React.forwardRef(({ title, ...props }, ref) => (
  <Tooltip title={title}>
    <ToggleButton ref={ref} {...props} />
  </Tooltip>
));
CustomToggleButton.displayName = "CustomToggleButton";
CustomToggleButton.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
};

const filters = [
  {
    icon: BlockOutlinedIcon,
    label: "Aucun",
    value: "",
  },
  {
    name: "grayscale",
    icon: ContrastOutlinedIcon,
    label: "Noir et blanc",
    value: "grayscale",
  },
  {
    name: "night",
    icon: NightsStayOutlinedIcon,
    label: "Nuit",
    value: "night",
  },
  {
    name: "sunny",
    icon: WbSunnyOutlinedIcon,
    label: "Ensoleillé",
    value: "sunny",
  },
  {
    name: "cool",
    icon: AcUnitOutlinedIcon,
    label: "Froid",
    value: "cool",
  },
  {
    name: "warm",
    icon: LocalFireDepartmentOutlinedIcon,
    label: "Chaud",
    value: "warm",
  },
];

export default ToggleFilterButton;
