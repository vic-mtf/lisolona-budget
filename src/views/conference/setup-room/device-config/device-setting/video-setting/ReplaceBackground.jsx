import Box from "@mui/material/Box";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import WallpaperOutlinedIcon from "@mui/icons-material/WallpaperOutlined";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListItem from "@mui/material/ListItem";

const ReplaceBackground = () => {
  return (
    <Box my={2}>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls='panel1-content'
          id='panel1-header'>
          <ListItem disableGutters disablePadding>
            <ListItemIcon>
              <WallpaperOutlinedIcon />
            </ListItemIcon>
            <ListItemText component='span'>
              {"Modifier l'arrière-plan"}
            </ListItemText>
          </ListItem>
        </AccordionSummary>
        <AccordionDetails>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
          malesuada lacus ex, sit amet blandit leo lobortis eget.
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default ReplaceBackground;
