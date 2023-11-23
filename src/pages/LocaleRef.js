import {useParams} from 'react-router-dom';
import Box from '@mui/material/Box';
import BasicInfo from './BasicInfo';
import DaysAndMonths from './DaysAndMonths';
import Meridiem from './Meridiem';
import DateTime from './DateTime';
import DateRange from './DateRange';
import Duration from './Duration';
import Number from './Number';
import Copyright from './Copyright';

const LocaleRef = () => {
  const {locale} = useParams();
  return (
    <Box sx={{flexGrow: 1, paddingLeft: 5, paddingTop: 9, fontSize: 'h6.fontSize', fontWeight: 'bold'}}>
      <BasicInfo locale={locale} />
      <DaysAndMonths locale={locale} />
      <Meridiem locale={locale} />
      <DateTime locale={locale} />
      <DateRange locale={locale} />
      <Duration locale={locale} />
      <Number locale={locale} />
      <Copyright />
    </Box>
  );
};

export default LocaleRef;