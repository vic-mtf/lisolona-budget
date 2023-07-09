import { 
    Skeleton, 
    styled
} from "@mui/material";

const CustomSkeleton = styled(Skeleton)(({theme}) => ({

}));

CustomSkeleton.defaultProps = {
    animation: 'wave',
};

export default CustomSkeleton;