import { Skeleton, styled } from "@mui/material";

const CustomSkeleton = styled((props) => (
  <Skeleton {...props} animation='wave' />
))(() => ({}));

export default CustomSkeleton;
