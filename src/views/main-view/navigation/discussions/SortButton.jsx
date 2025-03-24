import {
  Badge,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import PropTypes from "prop-types";
import { useState } from "react";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import { createElement } from "react";
import SortOutlinedIcon from "@mui/icons-material/SortOutlined";
import { displays, orders, sortTypes } from "./filterCategory";

export default function SortButton({
  order,
  type,
  display,
  itemType,
  onChange,
}) {
  const [anchorEl, setAnchorEl] = useState(null);

  return (
    <>
      <Tooltip title='Filtrer et trier'>
        <Badge
          color='primary'
          // variant='dot'
          invisible={display === "all" || itemType !== "all"}
          sx={{
            "& .MuiBadge-badge": {
              right: 8,
              top: 10,
              p: 0.25,
            },
          }}
          badgeContent={
            display !== "all" &&
            createElement(displays.find(({ id }) => id === display).icon, {
              sx: { fontSize: 16, p: 0, m: 0 },
            })
          }
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}>
          <IconButton onClick={(event) => setAnchorEl(event.currentTarget)}>
            <SortOutlinedIcon />
          </IconButton>
        </Badge>
      </Tooltip>
      <Menu
        onClick={() => setAnchorEl(null)}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}>
        {itemType === "all" &&
          displays.map(({ id, label, icon = "div" }) => (
            <MenuItem
              key={id}
              onClick={() => {
                onChange({ display: id });
              }}>
              <ListItemIcon>
                {id === display ? <CheckOutlinedIcon /> : createElement("div")}
              </ListItemIcon>
              <ListItemIcon>{createElement(icon)}</ListItemIcon>
              <ListItemText primary={label} />
            </MenuItem>
          ))}
        {itemType === "all" && <Divider component='li' />}
        {sortTypes.map(({ id, label, icon = "div" }) => (
          <MenuItem
            key={id}
            onClick={() => {
              onChange({ type: id });
            }}>
            <ListItemIcon>
              {id === type ? <CheckOutlinedIcon /> : createElement("div")}
            </ListItemIcon>
            <ListItemIcon>{createElement(icon)}</ListItemIcon>
            <ListItemText primary={label} />
          </MenuItem>
        ))}
        <Divider component='li' />
        {orders.map(({ id, label, icon = "div" }) => (
          <MenuItem
            key={id}
            onClick={() => {
              onChange({ order: id });
            }}>
            <ListItemIcon>
              {id === order ? <CheckOutlinedIcon /> : createElement(icon)}
            </ListItemIcon>
            <ListItemText primary={label} />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

SortButton.propTypes = {
  order: PropTypes.oneOf(orders.map(({ id }) => id)).isRequired,
  type: PropTypes.oneOf(sortTypes.map(({ id }) => id)).isRequired,
  display: PropTypes.oneOf(displays.map(({ id }) => id)).isRequired,
  itemType: PropTypes.oneOf(displays.map(({ id }) => id)).isRequired,
  onChange: PropTypes.func.isRequired,
};
