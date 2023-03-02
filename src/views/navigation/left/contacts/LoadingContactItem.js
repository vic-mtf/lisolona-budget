import { 
    ListItemAvatar, 
    ListItemText,
    ListItem,
    Skeleton,
    Stack
} from "@mui/material";
import React from "react";
import CustomSkeleton from "../../../../components/Skeleton";


export default function LoadingContactItem () {
    
    return (
            <ListItem
                //disablePadding
            >
                <ListItemAvatar>
                    <Skeleton 
                        variant="rounded" 
                        sx={{
                            borderRadius: 2,
                            width: 42,
                            height: 42,
                        }}
                    />
                </ListItemAvatar>
                <ListItemText
                    primary={
                        <Stack 
                            spacing={.5} 
                            display="flex"  
                            justifyContent="center"
                        >
                            <CustomSkeleton 
                                sx={{borderRadius: 1}} 
                                variant="rectangular" 
                                height={20} 
                                width="100%"
                            />
                            <CustomSkeleton 
                                sx={{borderRadius: .5,}} 
                                variant="rectangular" 
                                height={10} 
                                width="70%"
                            />
                        </Stack>
                    }
                    primaryTypographyProps={{component: 'div'}}
                    secondaryTypographyProps={{
                        component: "div",
                    }}
                />
            </ListItem>
    )
}