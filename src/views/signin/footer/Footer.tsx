import { Stack, styled, Typography } from "@mui/material";

export default function Footer() {
  return (
    <Stack
      display="flex"
      mt={1}
      justifyContent="center"
      alignItems="center"
      spacing={2}
      direction="row"
    >
      <FooterLink>Conditions d'utilisation</FooterLink>
      <FooterLink>Aide</FooterLink>
      <FooterLink color="text.secondary">DANTIC &copy;2021</FooterLink>
    </Stack>
  );
}

const FooterLink = styled(Typography)(({ theme }) => ({
  textDecoration: "none",
  color: theme.palette.text.primary,
}));

FooterLink.defaultProps = {
  variant: "caption",
  component: "span",
};
