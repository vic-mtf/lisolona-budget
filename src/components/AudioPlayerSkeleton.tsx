import { Box, Skeleton } from "@mui/material";

const AudioPlayerSkeleton = () => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        width: "100%",
        borderRadius: 2,
        px: 2,
      }}>
      <Skeleton
        variant='rounded'
        sx={{
          width: 30,
          height: 30,
          clipPath: "polygon(25% 20%, 75% 50%, 25% 80%)",
        }}
      />
      <Box sx={{ flex: 1 }}>
        <Skeleton variant='rounded' width='100%' height={5} />
      </Box>
      <Skeleton variant='text' width={30} height={40} />
      <Skeleton variant='rounded' width={3} height={40} />
      <Skeleton variant='rounded' width={20} height={20} />
    </Box>
  );
};

export default AudioPlayerSkeleton;
