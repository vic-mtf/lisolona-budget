import { Box, Grid } from "@mui/material";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import React from "react";
import Participant from "../participant/Participant";

const ParticipantsGrid = React.memo(({ participants = [] }) => {
  return (
    <Box display='flex' flex={1} overflow='hidden' width='100%'>
      <Box
        sx={{
          aspectRatio: 16 / 9,
          minHeight: 0,
          minWidth: 0,
          maxHeight: "100%",
          maxWidth: "100%",
          position: "relative",
          width: "100%",
          m: "auto",
        }}>
        <Grid
          container
          component='div'
          display='flex'
          justifyContent='center'
          sx={{
            position: "absolute",
            width: "100%",
            height: "100%",
            top: 0,
            left: 0,

            transition: "all .5s",
            flexDirection: {
              md: "row",
              "& > div": {},
            },
          }}>
          {participants?.map((user, index) => (
            <Grid
              item
              key={`${user}-${index}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
              component={motion.div}
              lg={12 / getDimension(participants.length).col}
              md={12 / getDimension(participants.length).row}
              sm={participants.length > 2 ? 6 : 1}
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
              // flex={1}
              display='flex'
              justifyContent='center'
              overflow='hidden'
              alignItems='center'>
              <Box
                display='flex'
                width='100%'
                height='100%'
                position='relative'
                flex={1}
                borderRadius={1}
                overflow='hidden'>
                <Participant {...user} key={user.id} />
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
});

const getDimension = (nbr) => {
  const middle = Math.sqrt(nbr);
  const col = Math.ceil(middle);
  const row = Math.floor(middle);
  return { col, row };
};

ParticipantsGrid.displayName = "ParticipantsGrid";

ParticipantsGrid.propTypes = {
  participants: PropTypes.arrayOf(PropTypes.object),
};

export default ParticipantsGrid;
