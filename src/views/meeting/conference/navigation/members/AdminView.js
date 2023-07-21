import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import { Tooltip, Zoom } from "@mui/material";
import Typography from "../../../../../components/Typography";
import IconButton from "../../../../../components/IconButton";

export default function AdminView ({show, title}) {
    return (
        <Zoom in={show}>
            <Typography>
                <CustomTooltip 
                    arrow 
                    title={title}
                    show={show}
                >
                    <IconButton
                        //selected
                        disableFocusRipple
                        disableRipple
                        disableTouchRipple
                    >
                        <AdminPanelSettingsOutlinedIcon/>
                    </IconButton>
                </CustomTooltip>
            </Typography>
        </Zoom>
    );
}

const CustomTooltip = ({show, ...otherProps}) => show ? (<Tooltip {...otherProps} />) : otherProps.children