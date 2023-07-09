import { 
    DialogActions, 
    Tabs,
    Box as MuiBox
} from "@mui/material";
import MediaTab from "./MediaTab";

export default function MultimediaFooter({items, value, handleChange}) {

    return (
        <DialogActions
            disableSpacing
        >
            <MuiBox
                width="100%"
                display="flex"
            >
                <Tabs
                    value={value}
                    sx={{
                        "& .MuiTabs-indicator": {
                            display: 'none',
                        },
                        maxWidth: '100%',
                    }}
                    scrollButtons="auto"
                    variant="scrollable"
                    onChange={handleChange}
                >
                    {items.map((item, index) => (
                        <MediaTab 
                            key={index}
                            value={index}
                            item={item}
                        />) )}
                </Tabs>
            </MuiBox>
        </DialogActions>
    )
}
