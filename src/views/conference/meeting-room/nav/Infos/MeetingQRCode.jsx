import ListSubheader from '@mui/material/ListSubheader';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useLocation, useParams } from 'react-router-dom';
import { useMemo, useRef } from 'react';
import Button from '@mui/material/Button';
import QRCodeBox from '../../../../../components/QRCodeBox';
import CardActions from '@mui/material/CardActions';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import generateSVGImage from '../../../../../utils/generateQRImage';
import { useTheme } from '@mui/material';
import { useSelector } from 'react-redux';

const MeetingQRCode = () => {
  const { code } = useParams();
  const { state } = useLocation();
  const qRCodeRef = useRef(null);
  const call = useSelector((store) => store.conference.callData);

  const callUrl = useMemo(() => {
    if (!code) return null;
    const cleanPath = (p = '') =>
      (p?.endsWith('/') ? p?.slice(0, -1) : p) || '';
    try {
      const pathname = '/conference/' + code;
      const base = new URL(import.meta.env.BASE_URL, window.location.origin);
      base.pathname = cleanPath(base.pathname) + pathname;
      return base.toString();
    } catch (error) {
      console.error(error);
      return null;
    }
  }, [code]);

  const target = useMemo(() => state?.target, [state?.target]);
  const theme = useTheme();
  const title = call?.title || target?.name;

  const desc = call?.description;

  const handleDownload = async () => {
    const svgElement = qRCodeRef.current;
    if (!svgElement) return;
    const base64Data = await generateSVGImage({
      svgElement,
      title,
      description: desc,
      theme,
    });
    const link = document.createElement('a');
    link.href = base64Data;
    link.download = 'geid_meeting_qr_code.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    link.remove();
  };

  const handleShare = async () => {
    const svgElement = qRCodeRef.current;
    if (!svgElement || !window.navigator?.share) return;

    const base64Data = await generateSVGImage({
      svgElement,
      title,
      description: desc,
      theme,
    });
    const base64 = base64Data.split(',')[1];
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++)
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    const byteArray = new Uint8Array(byteNumbers);
    const file = new File([byteArray], 'geid_meeting_qr_code.png', {
      type: 'image/png',
    });
    window.navigator.share({
      title,
      text: desc,
      files: [file],
    });
  };

  return (
    <Box>
      <Box
        mx="auto"
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        my={1}
      >
        {title && (
          <Typography align="center" color="textPrimary" fontWeight="bold">
            {title}
          </Typography>
        )}
        <QRCodeBox value={callUrl} ref={qRCodeRef} />
        <Typography variant="caption" align="center" color="textSecondary">
          Migrer la réunion en scannant le code
        </Typography>
        <Box>
          <CardActions>
            <Button
              fullWidth
              endIcon={<FileDownloadOutlinedIcon />}
              variant="outlined"
              onClick={handleDownload}
            >
              Télécharger
            </Button>
            {window.navigator?.share && (
              <Button
                onClick={handleShare}
                fullWidth
                endIcon={<ShareOutlinedIcon />}
                variant="outlined"
              >
                Partager
              </Button>
            )}
          </CardActions>
        </Box>
      </Box>

      {desc && (
        <>
          <ListSubheader>Description de la réunion</ListSubheader>
          <Typography px={2}>{desc}</Typography>
        </>
      )}
    </Box>
  );
};

export default MeetingQRCode;
