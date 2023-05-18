import { 
    ButtonBase, 
    Stack, 
    TextField,
    Box as MuiBox,
    Slide
} from '@mui/material';
import Button from '@mui/material/Button';
import Avatar from '../../../../../components/Avatar';
import InputControler from '../../../../../components/InputControler';
import Diversity3OutlinedIcon from '@mui/icons-material/Diversity3Outlined';
import Typography from '../../../../../components/Typography';

export default function GroupForm ({
    itemListRef,
    groupTitleRef,
    descriptionRef,
    externalErrors
}) {
    
    return (
            <Stack spacing={1}>
                <Typography paragraph color="text.secondary">
                    Lisanga constitue un groupe de personnes 
                    rassemblées dans un environnement interactif,
                    afin de discuter d'un sujet spécifique sous 
                    la direction d'un modérateur qualifié.
                </Typography>
                <Stack spacing={1} overflow="auto"> 
                    <MuiBox
                        display="flex"
                        justifyContent="center"
                    >
                        <ButtonBase
                            sx={{
                                borderRadius: 1.5,
                            }}
                        > 
                            <Avatar
                                sx={{
                                    height: 110,
                                    width: 110,
                                }}
                                children={
                                    <Diversity3OutlinedIcon
                                        sx={{fontSize: 80}}
                                    />
                                }
                            /> 
                        </ButtonBase> 
                    </MuiBox>
                    <MuiBox>
                        <Typography fontWeight="bold">
                            Membres: Moi, {itemListRef?.current?.map(({name}) => name)?.join(', ')}
                        </Typography>
                    </MuiBox>
                    <MuiBox>
                        <InputControler 
                            fullWidth
                            defaultValue={groupTitleRef?.current}
                            trim={false}
                            valueRef={groupTitleRef}
                            externalError={!!externalErrors?.find(error => error === 'title')}
                        >
                            <TextField
                                label="Nom"
                            /> 
                        </InputControler>
                    </MuiBox>
                    <MuiBox>
                        <InputControler 
                            fullWidth
                            trim={false}
                            defaultValue={descriptionRef?.current}
                            valueRef={descriptionRef}
                            externalError={!!externalErrors?.find(error => error === 'description')}
                        >
                            <TextField
                                rows={3}
                                label="Description"
                                multiline
                            /> 
                        </InputControler>
                    </MuiBox>
                </Stack>
            </Stack>
    )
}