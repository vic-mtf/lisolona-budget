import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined';
import { Tooltip } from "@mui/material";
import Typography from "../../../../../components/Typography";
import IconButton from "../../../../../components/IconButton";
import CustomZoom from '../../../../../components/CustomZoom';

export default function AdminView ({show, title}) {
    return (
        <CustomZoom show={show}>
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
                        <WorkspacePremiumOutlinedIcon/>
                    </IconButton>
                </CustomTooltip>
            </Typography>
        </CustomZoom>
    );
}

const CustomTooltip = ({show, ...otherProps}) => show ? (<Tooltip {...otherProps} />) : otherProps.children