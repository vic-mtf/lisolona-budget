import { Box, Container, Grid } from "@mui/material";
import PropTypes from "prop-types";
import ParticipantView from "./ParticipantView";
import { motion } from "framer-motion";

const ParticipantsGrid = ({ users = [] }) => {
  return (
    <Box display='flex' flex={1} overflow='hidden'>
      <Container sx={{ display: "flex", flex: 1 }} disableGutters maxWidth='xl'>
        <Grid
          container
          component='div'
          display='flex'
          justifyContent='center'
          sx={{
            transition: "all .5s",
            flexDirection: {
              md: "row",
              "& > div": {},
            },
          }}>
          {users.map((user, index) => (
            <Grid
              item
              key={`${user}-${index}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
              component={motion.div}
              lg={12 / getDimension(users.length).col}
              md={12 / getDimension(users.length).row}
              sm={users.length > 2 ? 6 : 1}
              sx={{
                minWidth: {
                  xs: 150,
                  md: 100,
                },
                minHeight: {
                  xs: 150,
                  md: 100,
                },
              }}
              flex={1}
              display='flex'
              justifyContent='center'
              overflow='hidden'
              alignItems='center'>
              <Box
                display='flex'
                width='100%'
                height='100%'
                position='relative'
                flex={1}>
                <ParticipantView index={index} />
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

ParticipantsGrid.propTypes = {
  users: PropTypes.array,
};

const getDimension = (nbr) => {
  const middle = Math.sqrt(nbr);
  const col = Math.ceil(middle);
  const row = Math.floor(middle);
  return { col, row };
};

export default ParticipantsGrid;
