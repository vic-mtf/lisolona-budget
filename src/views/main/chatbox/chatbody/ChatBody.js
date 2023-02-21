import {
    Box as MuiBox
} from '@mui/material';
import Box from '../../../../components/Box';
import scrollBarSx from '../../../../utils/scrollBarSx';
import MessageBox from './messagebox/MessageBox';
import MessageGroupBox from './messagebox/MessageGroupBox';
import messages from './messagebox/messages';


const groupMss = messages.reduce((accumulator, currentValue) => {
       const newAccumulator = [];
       const classGroup = `group_${Math.round(Math.random() * 3)}`;
       const callback = ({classGroup: _classGroup}) => _classGroup === classGroup;
       const index = accumulator?.findIndex && accumulator?.findIndex(callback);
      console.log(index);
       if(index === undefined)  {
            const messages = [
                {
                    classGroup: `group_${Math.round(Math.random() * 3)}`,
                    children: [accumulator],
                },
                {
                    classGroup,
                    children: [currentValue],
                }
            ];
            if(messages[0].classGroup === messages[1].children)
                newAccumulator.push({
                    classGroup,
                    children :[
                        ...messages[0].children, 
                        ...messages[1].children
                    ],
                });
            else newAccumulator?.push(...messages);

       } else {
            if(index === -1) {
                const message = {
                    classGroup,
                    children: [currentValue],
                };
                newAccumulator?.push(...accumulator, message);
            } else {
                newAccumulator?.push(...accumulator);
                newAccumulator?.find(callback)?.children?.push(currentValue)
            }
       }
    return newAccumulator;
    
    });


export default function ChatBody () {
   
    return (
        <MuiBox
            overflow="auto"
            px={5}
            flexGrow={1}
            height={0}
            sx={{
                ...scrollBarSx,
            }}
        >
            <MuiBox my={2}>
                {
                    groupMss.map(({classGroup, children}, index) => (
                        <MessageGroupBox
                            date={classGroup}
                            messages={children}
                            key={index}
                        />
                    ))
                }
            </MuiBox>
        </MuiBox>
    )
}


// cond for group hideAvatar  messages[index + 1]?.userId === message?.userId
// cond for joinBox messages[index - 1]?.userId === message?.userId
