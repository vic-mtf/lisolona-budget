import {
  TextField,
  Box as MuiBox,
  Alert,
  Chip,
  Avatar,
  FormControlLabel,
  Checkbox,
  FormControl,
} from "@mui/material";
import { useState } from "react";
import { Link as ReactRouterLink } from "react-router-dom";
import Box from "../../../components/Box";
import Typography from "../../../components/Typography";
import Button from "../../../components/Button";

export default function CheckPassword({ passwordRef, email, errorMessage }) {
  const [show, setShow] = useState(false);

  return (
    <MuiBox display='flex' flex={1} flexDirection='column'>
      <Box flex={1}>
        <MuiBox textAlign='center'>
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
        </MuiBox>
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
        <MuiBox justifyContent='right' display='flex'>
          <Button
            type='text'
            LinkComponent={ReactRouterLink}
            to='/account/forgotpassword'>
            Mot de passe oublié ?
          </Button>
        </MuiBox>
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
    </MuiBox>
  );
}
