import { Avatar } from '@mui/material';
import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';
import { colorFromId } from '../utils/color';
import SignalBadge from './SignalBadge';
import { useLayoutEffect } from 'react';
import useLocalStoreData from '../hooks/useLocalStoreData';
import { axios } from '../hooks/useAxios';
import Fade from '@mui/material/Fade';

const ListAvatar = ({
  src,
  id,
  active,
  status,
  invisible = true,
  SignalBadgeProps,
  sx,
  onLoadImage,
  ...otherProps
}) => {
  const style = useMemo(() => colorFromId(id), [id]);
  const [getData, setData] = useLocalStoreData('app.downloads.images');
  const [url, setUrl] = useState(getData(id) || null);

  useLayoutEffect(() => {
    if (!src) return;
    const downloadImage = async () => {
      const response = await axios.get(src, { responseType: 'blob' });
      const blob = new Blob([response.data], {
        type: response.headers['content-type'],
      });
      const uri = URL.createObjectURL(blob);
      setUrl(uri);
      setData({ [id]: uri });
      if (typeof onLoadImage === 'function') onLoadImage(uri);
    };
    if (!url) downloadImage();
  }, [src, url, setData, id, onLoadImage]);
  const avatarUrl = useMemo(
    () =>
      typeof url === 'string' || url instanceof URL
        ? url?.toString()
        : undefined,
    [url]
  );

  return (
    <SignalBadge
      variant="dot"
      active={active}
      status={status}
      invisible={active ? false : invisible}
      sx={{
        position: 'relative',
        ...SignalBadgeProps?.sx,
        '& .AvatarStyle': {
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          width: '100%',
          height: '100%',
          zIndex: -10,
        },
        '& .MuiAvatar-root': {
          ...sx,
          transition: (theme) =>
            theme.transitions.create('opacity', {
              easing: theme.transitions.easing.easeIn,
              duration: theme.transitions.duration.enteringScreen,
            }),
        },
      }}
      {...SignalBadgeProps}
    >
      <Fade
        in={!url}
        appear={false}
        unmountOnExit
        className={url ? 'AvatarStyle' : undefined}
      >
        <Avatar sx={{ ...style, ...sx }} {...otherProps} key={id} />
      </Fade>
      <Fade in={Boolean(src && url)} unmountOnExit appear={false}>
        <Avatar
          src={avatarUrl}
          className={!url ? 'AvatarStyle' : undefined}
          slotProps={{ img: { loading: 'lazy' } }}
          {...otherProps}
        />
      </Fade>
    </SignalBadge>
  );
};

ListAvatar.propTypes = {
  src: PropTypes.string,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  active: PropTypes.bool,
  status: PropTypes.oneOf(['online', 'offline', 'away']),
  invisible: PropTypes.bool,
  SignalBadgeProps: PropTypes.object,
  sx: PropTypes.object,
  onLoadImage: PropTypes.func,
};

export default ListAvatar;
