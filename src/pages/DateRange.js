import {Fragment, useCallback, useMemo} from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import '@enact/i18n';
import LocaleInfo from 'ilib/lib/LocaleInfo';
import DateRngFmt from 'ilib/lib/DateRngFmt';
import DateFactory from 'ilib/lib/DateFactory';

const DateRange = ({locale}) => {
  const li = useMemo(() => new LocaleInfo(locale), [locale]);
  const composeDateRange = useCallback(() => {
    const ranges = ['c00', 'c01', 'c02', 'c03', 'c10', 'c11', 'c12', 'c20', 'c30'];
    const legend = [
      '(difference is less than 3 days. Year, month, and date are same, but time is different)',
      '(difference is less than 3 days. Year and month are same but date and time are different)',
      '(difference is less than 3 days. Year is same but month, date, and time are different)',
      '(difference is less than 3 days. Year, month, date, and time are all different)',
      '(difference is less than 2 years. Year and month are the same, but date is different)',
      '(difference is less than 2 years. Year is the same, but month, date, and time are different)',
      '(difference is less than 2 years. All fields are different)',
      '(difference is less than 10 years. All fields are different)',
      '(difference is more than 10 years. All fields are different)',
    ];
    const formatLength = ['full', 'long', 'medium', 'short'];
    const starts = [
      DateFactory({year: 2011,month: 6,day: 20, hour: 13, minute: 45, second: 0, type:li.getCalendar()}),
      DateFactory({year: 2011,month: 6,day: 20, hour: 13, minute: 45, second: 0, type:li.getCalendar()}),
      DateFactory({year: 2011,month: 6,day: 30, hour: 13, minute: 45, second: 0, type:li.getCalendar()}),
      DateFactory({year: 2011,month: 12, day: 30, hour: 13, minute: 45, second: 0, type:li.getCalendar()}),
      DateFactory({year: 2011,month: 6,day: 20, hour: 13, minute: 45, second: 0, type:li.getCalendar()}),
      DateFactory({year: 2011,month: 6,day: 20, hour: 13, minute: 45, second: 0, type:li.getCalendar()}),
      DateFactory({year: 2011,month: 6,day: 20, hour: 13, minute: 45, second: 0, type:li.getCalendar()}),
      DateFactory({year: 2011,month: 6,day: 20, hour: 13, minute: 45, second: 0, type:li.getCalendar()}),
      DateFactory({year: 2011,month: 6,day: 20, hour: 13, minute: 45, second: 0, type:li.getCalendar()})
    ];
    const ends = [
      DateFactory({year: 2011,month: 6,day: 20, hour: 15, minute: 30, second: 0, type:li.getCalendar()}),
      DateFactory({year: 2011, month: 6, day: 22, hour: 15, minute: 30,second: 0,type: li.getCalendar()}),
      DateFactory({year: 2011, month: 7, day: 1, hour: 9, minute: 30,second: 0,type: li.getCalendar()}),
      DateFactory({year: 2012, month: 1, day: 1, hour: 5, minute: 30,second: 0,type: li.getCalendar()}),
      DateFactory({year: 2011, month: 6, day: 28, hour: 5, minute: 30,second: 0,type: li.getCalendar()}),
      DateFactory({year: 2011, month: 11, day: 28, hour: 5, minute: 30,second: 0,type: li.getCalendar()}),
      DateFactory({year: 2012, month: 4, day: 28, hour: 5, minute: 30,second: 0,type: li.getCalendar()}),
      DateFactory({year: 2016, month: 4, day: 28, hour: 5, minute: 30,second: 0,type: li.getCalendar()}),
      DateFactory({year: 2032, month: 4, day: 28, hour: 5, minute: 30,second: 0,type: li.getCalendar()})
    ];
    const dateRanges = [];

    for (let i = 0; i < ranges.length; i++) {
      dateRanges.push([]);
      for (let j = 0; j < formatLength.length; j++) {
        const formatter = new DateRngFmt({locale: locale, length: formatLength[j]});
        if (i === 3 && locale === 'am-ET') {
          const amStart = DateFactory({year: 2011,month: 13, day: 30, hour: 13, minute: 45, second: 0, type:li.getCalendar()});
          dateRanges[i].push([ranges[i] + '\n' + legend[i], formatLength[j], formatter.dateFmt.formats.range[ranges[i]][formatLength[j][0]], formatter.format(amStart, ends[i])]);
        } else {
          dateRanges[i].push([ranges[i] + '\n' + legend[i], formatLength[j], formatter.dateFmt.formats.range[ranges[i]][formatLength[j][0]], formatter.format(starts[i], ends[i])]);
        }
      }
    }
    return dateRanges;
  }, [locale, li]);

  const dateRanges = useMemo(() => composeDateRange(), [composeDateRange]);

  return (
    <Box sx={{marginBottom: 5}}>
      <Typography variant="h7">
        {'Data Format: Date Range'}
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
            {
              dateRanges.map((dateRange, index) => (
                <Fragment key={dateRange[0][0] + index}>
                  <TableRow>
                    <TableCell sx={{width: 350}} rowSpan={dateRange.length + 1}>{dateRange[0][0]}</TableCell>
                  </TableRow>
                  {dateRange.map((ranges) => (
                    <TableRow key={ranges[0] + ranges[1]}>
                      <TableCell align="left">{ranges[1]}</TableCell>
                      <TableCell align="left">{ranges[2]}</TableCell>
                      <TableCell align="left">{ranges[3]}</TableCell>
                    </TableRow>
                  ))}
                </Fragment>
              ))
            }
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default DateRange;