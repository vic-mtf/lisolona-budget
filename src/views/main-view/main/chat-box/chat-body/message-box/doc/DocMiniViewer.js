import { 
    Card, 
    CardActionArea, 
    CardMedia,
    Box as MuiBox
} from "@mui/material";
import { useLayoutEffect, useState } from "react";
import { useSelector } from "react-redux";
import getServerUri from "../../../../../../utils/getServerUri";
import getPdfPageInfos from "../../../../../../utils/getPdfPageInfos";
import updateMessages from "../../../../../../database/updateMessages";
// import { PrismCode } from 'react-prismjs';
// import 'react-prismjs/prism.css';
// import { useState } from "react";

export default function DocMiniViewer ({id, typeMIME, isText, coverUrl, content, cover, setInfos, buffer}) {
    if(typeMIME === 'application/pdf') 
        return (
            <PDFViewer
                content={content}
                id={id}
                cover={cover}
                setInfos={setInfos}
                buffer={buffer}
            />
        );
    if(isText)
        return ( null
            // <DocTextViewer/>
        )
}

const PDFViewer = ({content, id, cover, setInfos, buffer}) => {
    const [coverUrl, setCoverUrl] = useState(cover);
    const userId = useSelector(store => store.user.id);

    useLayoutEffect(() => {
        if(!coverUrl && (buffer || content)) {
            getPdfPageInfos(
                buffer || getServerUri({pathname: content})
                .toString()
            ).then(data => {
                const {numPages, coverUrl:cover} = data
                setCoverUrl(cover);
                setInfos(infos => ({...infos, numPages}));
                updateMessages({
                    userId, 
                    updateMessages:[{
                        key: id,
                        changes: {cover, numPages}
                    }]
                });
            })
        }
    }, [content, id, setInfos, userId, coverUrl, buffer]);
    return (
        <Card elevation={0} >
            <CardActionArea>
                <CardMedia
                    component="img"
                    src={coverUrl}
                    srcSet={coverUrl}
                    height={150}
                />
            </CardActionArea>
        </Card>
    );
}

const DocTextViewer = ({lang}) => {
    const [text, setText] = useState('');

    return (
     <MuiBox
        height={150}
        overflow="hidden"
        sx={{userSelect: 'none'}}
     >
        {/* <PrismCode className={`language-${lang}`}>
          {text}
        </PrismCode> */}
      </MuiBox>
    )
}
  