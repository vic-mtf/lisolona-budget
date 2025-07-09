import { Slide, CardActions, Button, Box } from "@mui/material";
import { useMemo } from "react";
import Account from "./Account";
import { useSelector } from "react-redux";
//import { Link } from "react-router-dom";
import CheckEmail from "./CheckEmail";
import CheckPassword from "./CheckPassword";
import { decrypt } from "../../../utils/crypt";
import useSignInSendData from "../../../hooks/useSignInSendData";
import { useLocation } from "react-router-dom";
import getPathnames from "../../../utils/getPathnames";
import PropTypes from "prop-types";

export default function Content({ refresh }) {
  const appStoreUser = useSelector((store) => store.app.user);
  const location = useLocation();
  const user = useMemo(() => decrypt(appStoreUser), [appStoreUser]);

  const [
    { errorMessage, defaultEmail, emailRef, passwordRef, email },
    { handleSendData, handleCleanErrorMessage },
  ] = useSignInSendData({ refresh, user });

  const pathNames = useMemo(
    () => getPathnames(location?.pathname),
    [location?.pathname]
  );

  return (
    <Box
      flex={1}
      flexDirection='column'
      component='form'
      onSubmit={handleSendData}
      display='flex'>
      <Box
        flex={1}
        position='relative'
        flexDirection='column'
        display='flex'
        width='100%'
        height='100%'>
        <TabLevel show={pathNames.includes("userfound")}>
          <Account user={user} refresh={refresh} />
        </TabLevel>
        <TabLevel show={pathNames.includes("useremail")}>
          <CheckEmail
            email={email}
            errorMessage={errorMessage}
            refresh={refresh}
            user={user}
            emailRef={emailRef}
          />
        </TabLevel>
        <TabLevel show={pathNames.includes("password")}>
          <CheckPassword
            email={defaultEmail}
            passwordRef={passwordRef}
            errorMessage={errorMessage}
            cleanErrorMessage={handleCleanErrorMessage}
          />
        </TabLevel>
      </Box>
      <CardActions sx={{ justifyContent: "end" }}>
        {(defaultEmail === null || !!defaultEmail) && (
          <Button type='submit' variant='outlined'>
            {defaultEmail ? "Connexion" : "Suivant"}
          </Button>
        )}
      </CardActions>
    </Box>
  );
}

const TabLevel = ({ show, children }) => {
  return (
    <Slide
      in={Boolean(show)}
      direction='right'
      style={{
        position: "absolute",
        top: 0,
      }}
      unmountOnExit>
      <Box flex={1} sx={{ width: "100%" }}>
        {children}
      </Box>
    </Slide>
  );
};

Content.propTypes = {
  refresh: PropTypes.func.isRequired,
};

TabLevel.propTypes = {
  show: PropTypes.bool,
  children: PropTypes.node,
};
