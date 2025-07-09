import { TextField, Box, Alert, Fade, Typography } from "@mui/material";
import Link from "../../../components/Link";
import { useCheckTokenAccount } from "../../../hooks/useSignInSendData";
import PropTypes from "prop-types";

export default function CheckEmail({
  email,
  errorMessage,
  refresh,
  emailRef,
  user,
}) {
  return (
    <Box display='flex' flex={1} flexDirection='column'>
      <Box
        flex={1}
        display='flex'
        flexDirection='column'
        width='100%'
        height='100%'>
        <Typography variant='body2' align='center' color='text.primary'>
          {`Connectez-vous pour accéder à la Geid. Saisissez l'adresse e-mail
          correspondant à votre compte`}
        </Typography>
        <TextField
          label='Adresse électronique'
          defaultValue={email}
          fullWidth
          margin='dense'
          inputRef={emailRef}
          error={!!errorMessage}
          autoFocus
        />
        {!!errorMessage && (
          <Alert severity='error'>
            <Typography variant='caption'>{errorMessage}</Typography>
          </Alert>
        )}
      </Box>
      <Box my={1}>
        <Account refresh={refresh} email={email} user={user} />
      </Box>
    </Box>
  );
}

const Account = ({ refresh, user }) => {
  const handleCheckAccount = useCheckTokenAccount({ user, refresh });
  return (
    <Fade in={Boolean(user)} unmountOnExit>
      <div>
        <Typography color='text.secondary' paragraph>
          Ouvrez une session en tant que{" "}
          <Link to='?&email' onClick={handleCheckAccount} color='primary'>
            {user?.email}
          </Link>
        </Typography>
      </div>
      {/*  */}
    </Fade>
  );
};
CheckEmail.propTypes = {
  email: PropTypes.string,
  errorMessage: PropTypes.string,
  refresh: PropTypes.func.isRequired,
  emailRef: PropTypes.object,
  user: PropTypes.oneOfType([PropTypes.object, PropTypes.instanceOf(null)]),
};

Account.propTypes = {
  user: PropTypes.oneOfType([PropTypes.object, PropTypes.instanceOf(null)]),
  refresh: PropTypes.func.isRequired,
};
