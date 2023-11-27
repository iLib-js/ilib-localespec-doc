import {useCallback, useMemo} from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import '@enact/i18n';
import DateFmt from 'ilib/lib/DateFmt';
import GregorianDate from 'ilib/lib/GregorianDate';

const DateTime = ({locale}) => {
  const composeDateTime = useCallback(() => {
    const dateTimes = [];
    const dates = [];
    const times = [];
    const formatLength = ['full', 'long', 'medium', 'short'];
    const targetDate = new GregorianDate({locale: locale, year: 2015, month: 8, day: 5, hour: 13, minute: 45, second: 0});

    for (let i = 0; i < formatLength.length; i++) {
      let dateTimeFormatter = new DateFmt({locale: locale, type: 'datetime', length: formatLength[i], useNative: false, timezone: 'local'});
      let dateFormatter = new DateFmt({locale: locale, type: 'date', date: 'dmwy', length: formatLength[i], useNative: false, timezone: 'local'});
      let timeFormatter = new DateFmt({locale: locale, type: 'time', time: 'ahmsz', length: formatLength[i], useNative: false, timezone: 'local'});
      dateTimes.push([formatLength[i], dateTimeFormatter.template, dateTimeFormatter.format(targetDate)]);
      dates.push([formatLength[i], dateFormatter.template, dateFormatter.format(targetDate)]);
      times.push([formatLength[i], timeFormatter.template, timeFormatter.format(targetDate)]);
    }
    return {dateTimes, dates, times};
  }, [locale]);

  const {dateTimes, dates, times} = useMemo(() => composeDateTime(), [composeDateTime]);

  return (
    <Box sx={{marginBottom: 5}}>
      <Typography variant="h7">
        {'Data Format: Date/Time'}
      </Typography>
      <TableContainer sx={{mt: 3, ml: 3, mr: 3, width: 1200}}>
        <Table sx={{minWidth: 350, width: 1200}} size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{fontWeight: 'bold'}}>Date / Time</TableCell>
              <TableCell sx={{fontWeight: 'bold'}}>Length</TableCell>
              <TableCell sx={{fontWeight: 'bold'}}>Output format</TableCell>
              <TableCell sx={{fontWeight: 'bold'}}>Example</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell rowSpan={dateTimes.length + 1}>Date / Time</TableCell>
            </TableRow>
            {dateTimes.map((dateTime) => (
              <TableRow key={dateTime[0]}>
                <TableCell align="left">{dateTime[0]}</TableCell>
                <TableCell align="left">{dateTime[1]}</TableCell>
                <TableCell align="left">{dateTime[2]}</TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell rowSpan={dates.length + 1}>Date</TableCell>
            </TableRow>
            {dates.map((date) => (
              <TableRow key={date[0]}>
                <TableCell align="left">{date[0]}</TableCell>
                <TableCell align="left">{date[1]}</TableCell>
                <TableCell align="left">{date[2]}</TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell rowSpan={times.length + 1}>Time</TableCell>
            </TableRow>
            {times.map((time) => (
              <TableRow key={time[0]}>
                <TableCell align="left">{time[0]}</TableCell>
                <TableCell align="left">{time[1]}</TableCell>
                <TableCell align="left">{time[2]}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default DateTime;