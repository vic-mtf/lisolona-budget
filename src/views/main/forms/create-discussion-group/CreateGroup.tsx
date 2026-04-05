import {
  Box,
  Typography,
  Avatar,
  CardActionArea,
  Stack,
  TextField,
  alpha,
} from "@mui/material";
import AddAPhotoOutlinedIcon from "@mui/icons-material/AddAPhotoOutlined";
import { Controller } from "react-hook-form";
import getFile from "../../../../utils/getFile";
import FormHelperErrorText from "../../../../components/FormHelperErrorText";

const CreateGroup = ({ register, control, errors }) => {
  return (
    <>
      <Box mx={2}>
        <Typography color='text.secondary'>
          {`Lisanga constitue un groupe de personnes rassemblées dans un
          environnement interactif, afin de discuter d'un sujet spécifique sous
          la direction d'un ou plusieur modérateurs qualifiés.`}
        </Typography>
      </Box>
      <Box display='flex' justifyContent='center' alignItems='center' p={2}>
        <div style={{ display: "inline-flex" }}>
          <Controller
            name='image'
            control={control}
            render={({ field: { onChange, value } }) => (
              <CardActionArea
                sx={{ borderRadius: 1 }}
                onClick={async () => {
                  try {
                    const [file] = await getFile({
                      multiple: false,
                      accept: "image/*",
                    });
                    onChange(file);
                  } catch (e) {
                    console.error(e);
                  }
                }}>
                <Avatar
                  src={value && URL.createObjectURL(value)}
                  sx={{
                    width: 130,
                    height: 130,
                    color: (theme) =>
                      alpha(theme.palette.background.paper, 0.5),
                  }}>
                  <AddAPhotoOutlinedIcon sx={{ fontSize: 80 }} />
                </Avatar>
              </CardActionArea>
            )}
          />
        </div>
      </Box>
      <Stack p={1} spacing={2}>
        <Box>
          <TextField
            fullWidth
            label='Sujet de la discusion'
            {...register("title", {
              required: "Saisissez le sujet de la discussion",
            })}
            name='title'
            color={errors?.title ? "error" : "primary"}
          />
          <FormHelperErrorText>{errors?.title?.message}</FormHelperErrorText>
        </Box>
        <Box>
          <TextField
            fullWidth
            label='Description'
            multiline
            rows={8}
            color={errors?.description ? "error" : "primary"}
            {...register("description", {
              required: "Décrivez la discussion",
              minLength: { value: 5, message: "Description trop courte" },
            })}
            name='description'
          />
          <FormHelperErrorText>
            {errors?.description?.message}
          </FormHelperErrorText>
        </Box>
      </Stack>
    </>
  );
};

export default CreateGroup;
