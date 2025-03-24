import { 
    ListItemAvatar, 
    ListItemText,
    ListItem,
    Skeleton,
    Stack
} from "@mui/material";
import React from "react";
import CustomSkeleton from "../../../../components/Skeleton";


export default function LoadingItem () {
    
    return (
            <ListItem>
                <ListItemAvatar>
                    <Skeleton 
                        variant="rounded" 
                        sx={{
                            borderRadius: 1,
                            width: 40,
                            height: 40,
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
                                sx={{borderRadius: 1,}} 
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