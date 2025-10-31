import { useWatch } from 'react-hook-form';
import formatDate from '../../../../utils/formatDate';
import { useMemo } from 'react';
import dayjs from 'dayjs';

const SubHeaderIndicator = () => {
  const { duration, time, date } = useWatch();
  const formattedDate = useMemo(() => {
    if (!date || !time) return '';
    const bulkDate = dayjs(date).hour(time.hour()).minute(time.minute());
    return formatDate({ date: bulkDate.toString() });
  }, [date, time]);

  const formattedDuration = useMemo(() => {
    if (!duration) return '';
    let m = ' durée  ';

    const hours = duration?.hour();
    const minutes = duration?.minute();

    if (minutes === 0)
      return m + (hours > 1 ? `${hours} heures` : `${hours} heure`);
    if (hours === 0)
      return m + (minutes > 1 ? `${minutes} minutes` : `${minutes} min`);

    return m + `${hours}h ${minutes}min`;
  }, [duration]);

  return (
    <span>{`Planification réunion : ${formattedDate}${formattedDuration}`}</span>
  );
};

export default SubHeaderIndicator;
