import { Toolbar } from "@mui/material";
import SearchBar from "../../../../navigation/left/SearchBar";
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined';
import IconButton from "../../../../../components/IconButton";
import Typography from "../../../../../components/Typography";

export default function Header ({setKeyword, keyword}) {
    return (
        <>
            <Toolbar variant="dense">
                <Typography
                    variant="h6"
                    fontWeight="bold"
                >
                Participants</Typography>
            </Toolbar>
            <Toolbar variant="dense">
                <SearchBar
                    value={keyword}
                    onChange={event => {
                        setKeyword(event.target.value);
                    }}
                />
                <IconButton>
                    <FilterListOutlinedIcon fontSize="small" />
                </IconButton>
            </Toolbar>
        </>
    );
}