import { ListItemButton } from "@mui/material";
import PropTypes from "prop-types";
import { useState } from "react";
import CustomMenu from "./DeepMenu";
import { useRef } from "react";

const SubMenuItem = ({
  options,
  children,
  onChange,
  selected,
  onClose,
  disabled,
}) => {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);

  return (
    <div onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <ListItemButton ref={anchorRef} disabled={disabled}>
        {children}
      </ListItemButton>
      <CustomMenu
        open={open}
        anchorRef={anchorRef}
        options={options}
        selected={selected}
        onChange={onChange}
        onClose={onClose}
        placement='right-start'
      />
    </div>
  );
};

SubMenuItem.propTypes = {
  onClose: PropTypes.func,
  options: PropTypes.arrayOf(PropTypes.object),
  selectedId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onChange: PropTypes.func,
  children: PropTypes.node,
  selected: PropTypes.arrayOf(PropTypes.object),
  disabled: PropTypes.bool,
};

export default SubMenuItem;
