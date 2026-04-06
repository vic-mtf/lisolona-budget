import React, { useMemo, useState, useRef } from "react";
import Popper from "@mui/material/Popper";
import PopupState, { bindHover, bindPopper } from "material-ui-popup-state";
import Fade from "@mui/material/Fade";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import List from "@mui/material/List";
import SplitButton from "@/components/SplitButton";
import annotationStyles, {
  findById,
  onChangeColor,
  onChangeMode,
} from "./annotationStyles";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import { useDispatch, useSelector } from "react-redux";
import { updateConferenceData } from "@/redux/conference/conference";
import ColorIcon from "./ColorIcon";
import { useCallback } from "react";

const MoreMenuStyles = () => {
  const active = useSelector(
    (store) =>
      store.conference.meeting.actions.localPresentation.annotation.active
  );
  const mode = useSelector(
    (store) =>
      store.conference.meeting.actions.localPresentation.annotation.mode
  );
  const defaultColor = useSelector(
    (store) =>
      store.conference.meeting.actions.localPresentation.annotation.color
  );
  const dispatch = useDispatch();
  const onToggleDrawing = useCallback(() => {
    dispatch(
      updateConferenceData({
        key: ["meeting.actions.localPresentation.annotation.active"],
        data: [!active],
      })
    );
  }, [active, dispatch]);

  const [open, setOpen] = useState(false);
  const anchorElRef = useRef();
  const modeSelected = useMemo(
    () => findById({ kinds: annotationStyles }, mode),
    [mode]
  );
  const Icon = useMemo(() => modeSelected?.icon || "div", [modeSelected]);

  const handleClick = useCallback(
    (func, type, value) => () => {
      setOpen(false);
      if (typeof func === "function") func();
      if (type === "mode" && value) onChangeMode(value);
    },
    []
  );

  const mapKinds = useCallback(
    (kinds, type) =>
      kinds.map(({ color, icon: Icon, ...rest }) => {
        if (type === "color") {
          return {
            ...rest,
            color,
            icon: getColorIcon(color),
            onClick: () => onChangeColor(color),
          };
        }

        if (type === "mode") {
          return {
            ...rest,
            icon: Icon,
            onClick: () => onChangeMode(rest?.id),
          };
        }

        return {
          ...rest,
          icon: Icon,
        };
      }),
    []
  );

  return (
    <>
      <SplitButton
        activeTitle={modeSelected?.label || "Activer les annotations"}
        inactiveTitle='Activer les annotations'
        icon={<Icon />}
        onClick={onToggleDrawing}
        active={active}
        onExpand={() => setOpen(true)}
        ref={anchorElRef}
      />
      <Menu
        open={open}
        slotProps={{ list: { dense: true } }}
        onClose={() => setOpen(false)}
        anchorEl={anchorElRef.current}>
        {annotationStyles.map(
          ({ kinds, id, label, icon: Icon = "div", type, onClick }) =>
            kinds?.length > 0 ? (
              <MoreItemMenu
                label={label}
                onClick={handleClick(onClick)}
                icon={type === "color" ? getColorIcon(defaultColor) : Icon}
                kinds={mapKinds(kinds, type)}
                key={id}
              />
            ) : (
              <SimpleMenuItem
                label={label}
                icon={Icon}
                key={id}
                onClick={handleClick(onClick, type, id)}
              />
            )
        )}
      </Menu>
    </>
  );
};

const getColorIcon = (color) => {
  const ColorItemIcon = () => <ColorIcon color={color} />;
  return ColorItemIcon;
};

const SimpleMenuItem = React.forwardRef(
  ({ label, icon: Icon = " div", more, onClick, ...otherProps }, ref) => {
    return (
      <MenuItem {...otherProps} ref={ref} onClick={onClick}>
        <ListItemIcon>
          <Icon fontSize='small' />
        </ListItemIcon>
        <ListItemText slotProps={{ primary: { variant: "body2" } }}>
          {label}
        </ListItemText>
        {more && (
          <ListItemIcon sx={{ justifyContent: "end" }}>
            <ExpandMoreOutlinedIcon
              fontSize='small'
              sx={{ transform: "rotate(-90deg)" }}
            />
          </ListItemIcon>
        )}
      </MenuItem>
    );
  }
);

SimpleMenuItem.displayName = "SimpleMenuItem";

const MoreItemMenu = ({ label, icon, kinds, onClick }) => {
  let timeout;

  const handleMouseLeave = (popupState) => {
    timeout = setTimeout(() => {
      popupState.close();
    }, 150); // délai pour permettre le passage vers le Popper
  };

  const handleMouseEnter = () => {
    clearTimeout(timeout);
  };

  return (
    <PopupState variant='popper'>
      {(popupState) => (
        <Box>
          <SimpleMenuItem
            {...bindHover(popupState)}
            more
            icon={icon}
            label={label}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={() => handleMouseLeave(popupState)}
          />
          <Popper
            {...bindPopper(popupState)}
            modifiers={[
              {
                name: "offset",
                options: {
                  offset: [0, 4], // marge horizontale de 12px
                },
              },
            ]}
            transition
            sx={{ zIndex: (t) => t.zIndex.tooltip + 10 }}
            placement='right-start'>
            {({ TransitionProps }) => (
              <Fade {...TransitionProps}>
                <Paper
                  elevation={5}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={() => handleMouseLeave(popupState)}>
                  <List dense>
                    {kinds.map(
                      ({
                        label,
                        icon = "div",
                        kinds = [],
                        id,
                        onClick: handleClick,
                      }) => (
                        <React.Fragment key={id}>
                          {kinds?.length > 0 ? (
                            <MoreItemMenu
                              label={label}
                              icon={icon}
                              kinds={kinds}
                              onClick={() => {
                                if (typeof onClick === "function") onClick();
                                if (typeof handleClick === "function")
                                  handleClick(id);
                                popupState.setOpen(false);
                              }}
                            />
                          ) : (
                            <SimpleMenuItem
                              more={Boolean(kinds.length)}
                              icon={icon}
                              label={label}
                              onClick={() => {
                                if (typeof onClick === "function") onClick();
                                if (typeof handleClick === "function")
                                  handleClick();
                                popupState.setOpen(false);
                              }}
                            />
                          )}
                        </React.Fragment>
                      )
                    )}
                  </List>
                </Paper>
              </Fade>
            )}
          </Popper>
        </Box>
      )}
    </PopupState>
  );
};

// const MoreItemMenu = ({ children, handleClick }) => {

// };

export default MoreMenuStyles;

// export default React.memo(MoreMenuStyles);
