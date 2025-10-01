import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Carousel from "react-material-ui-carousel";
import pubs from "./pubs";
import PropTypes from "prop-types";

export default function CarouselPub() {
  return (
    <Box
      position='relative'
      draggable={false}
      display='flex'
      justifyContent='center'
      alignItems='center'
      sx={{
        width: "100%",
        overflow: "hidden",
        flexGrow: 1,
      }}>
      <Carousel
        sx={{
          width: "100%",
          maxWidth: 600,
        }}
        animation='fade'
        duration={800}
        interval={6000}>
        {pubs.map((item, i) => (
          <div key={i}>
            <Item {...item} />
          </div>
        ))}
      </Carousel>
    </Box>
  );
}

const Item = ({ desc, ...otherProps }) => {
  return (
    <Card
      sx={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
        background: "none",
        height: "100%",
        userSelect: "none",
      }}
      elevation={0}>
      <Box
        loading='lazy'
        sx={{
          height: 300,
          maxWidth: 300,
          m: 2,
          "& > img": {
            userSelect: "none",
            WebkitUserSelect: "none",
            MozUserSelect: "none",
            overflow: "hidden",
            cursor: "none",
          },
        }}
        component='img'
        draggable={false}
        desc={desc}
        {...otherProps}
      />
      <CardContent sx={{ maxWidth: 500, height: 100 }}>
        <Typography variant='body1'>{desc}</Typography>
      </CardContent>
    </Card>
  );
};

Item.propTypes = {
  desc: PropTypes.string,
};
