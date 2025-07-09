import {
  TextField,
  Box,
  Alert,
  Chip,
  Avatar,
  FormControlLabel,
  Checkbox,
  FormControl,
  Typography,
  Button,
} from "@mui/material";
import { useState } from "react";
import { Link as ReactRouterLink } from "react-router-dom";

import PropTypes from "prop-types";

export default function CheckPassword({ passwordRef, email, errorMessage }) {
  const [show, setShow] = useState(false);

  return (
    <Box display='flex' flex={1} flexDirection='column'>
      <Box
        flex={1}
        flexDirection='column'
        display='flex'
        width='100%'
        height='100%'>
        <Box textAlign='center'>
          <Typography color='text.primary' align='center' variant='body1'>
            Bienvenue
          </Typography>
          <Chip
            avatar={<Avatar variant='rounded' />}
            to='/account/signin/useremail'
            label={email}
            component={ReactRouterLink}
            sx={{ borderRadius: 1 }}
          />
        </Box>
        <TextField
          label='Mot de passe'
          defaultValue=''
          fullWidth
          margin='dense'
          inputRef={passwordRef}
          type={show ? "text" : "password"}
          onPaste={(event) => event.preventDefault()}
          error={!!errorMessage}
          autoFocus
        />
        <Box justifyContent='right' display='flex'>
          <Button
            type='text'
            LinkComponent={ReactRouterLink}
            to='/account/forgotpassword'>
            Mot de passe oublié ?
          </Button>
        </Box>
        <FormControl sx={{ display: "inline-block" }}>
          <FormControlLabel
            value='left'
            control={<Checkbox size='small' />}
            label={
              <Typography variant='body2' component='div' color='text.primary'>
                Afficher le mot de passe
              </Typography>
            }
            labelPlacement='end'
            onChange={(eve, val) => {
              setShow(val);
            }}
          />
        </FormControl>
        {!!errorMessage && (
          <Alert severity='error'>
            <Typography variant='caption'>{errorMessage}</Typography>
          </Alert>
        )}
      </Box>
    </Box>
  );
}

CheckPassword.propTypes = {
  passwordRef: PropTypes.object,
  email: PropTypes.string,
  errorMessage: PropTypes.string,
};
