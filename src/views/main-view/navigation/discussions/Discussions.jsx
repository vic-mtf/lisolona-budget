import { Chip, Stack, Toolbar } from "@mui/material";
import filterCategory from "./filterCategory";
import { createElement, useState } from "react";
import InputSearch from "../../../../components/InputSearch";
import Typography from "../../../../components/Typography";

export default function Discussions() {
  const [category, setCategory] = useState(filterCategory[0].id);
  const [search, setSearch] = useState("");

  return (
    <>
      <Stack spacing={1} px={1}>
        <Toolbar variant='dense' disableGutters>
          <Typography variant='h6'>Discussions</Typography>
        </Toolbar>
        <InputSearch placeholder='Recherche' />
        <Stack direction='row' spacing={1}>
          {filterCategory.map(({ id, label, icon }) => (
            <Chip
              key={id}
              label={label}
              color={category === id ? "primary" : "default"}
              onClick={() => setCategory(id)}
              icon={createElement(icon)}
              sx={{ borderRadius: 1 }}
            />
          ))}
        </Stack>
      </Stack>
    </>
  );
}
