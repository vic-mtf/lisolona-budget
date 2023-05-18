import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { useDispatch, useSelector } from 'react-redux';
import { addData } from '../../../redux/data';
import { useEffect, useState } from 'react';

export default function SearchBar ({onChangeSearch}) {
  const [value, setValue] = useState('');
  const onChange = event => {
    setValue(event.target.value);
    onChangeSearch(event)
  };

  return (
      <Search sx={{mr: 1}}>
          <SearchIconWrapper>
            <SearchOutlinedIcon fontSize="small" />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Chercher…"
            sx={{fontSize: 15}}
            inputProps={{ 
              'aria-label': 'search',
              onChange,
              value,
            }}
          />
        </Search>
  )
}

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common[ theme.palette.mode === 'light' ? 'black' : 'white'], 0.04),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common[theme.palette.mode === 'light' ? 'black' : 'white'], 0.06),
    },
    marginLeft: 0,
    width: '100%',
  }));
  
  const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 1),
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
     padding: theme.spacing(.5, .5, .5, .5),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(2)})`,
      transition: theme.transitions.create('width'),
      width: '100%'
    },
  }));