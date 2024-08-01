import { alpha, InputBase, styled } from "@mui/material";
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';

export const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    marginLeft: 0,
    width: '100%',
    padding: 0,
  }));

export const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }));
  
  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
      padding: theme.spacing(.5, .5, .5, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: '50ch',
      },
    },
  }));


export default function SearchInput (props) {
    return (
        <Search>
            <SearchIconWrapper>
              <SearchRoundedIcon fontSize="small" />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Chercher…"
              inputProps={{ 'aria-label': 'chercher' }}
              size="small"
              {...props}
            />
          </Search>
    )
}