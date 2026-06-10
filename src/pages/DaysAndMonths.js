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
import LocaleInfo from 'ilib/lib/LocaleInfo';
import DateFmt from 'ilib/lib/DateFmt';
import DateFactory from 'ilib/lib/DateFactory';

/**
 * Returns anchor year and day offset for generating stable weekday order.
 * The dayOffset is chosen so that getDayOfWeek() returns 0-6 for days 0+dayOffset through 6+dayOffset.
 * Also validates that day 0 (dayOffset) is actually Sunday (getDayOfWeek() === 0).
 *
 * @param {string} locale - BCP-47 locale string
 * @returns {{year: number, dayOffset: number, calendar: string}} Anchor year, day offset, and calendar type
 * @throws {Error} If the anchor date is not a Sunday
 */
const getWeekdayAnchor = (locale) => {
  const li = new LocaleInfo(locale);
  const calendar = li.getCalendar();
  const year = calendar === 'thaisolar' ? 2565 : 2022;

  let dayOffset;
  if (locale === 'am-ET' || locale === 'en-ET') {
    dayOffset = 10;
  } else if (locale === 'fa-IR' || locale === 'ps-AF') {
    dayOffset = 6;
  } else {
    dayOffset = 8;
  }

  // Validate that the anchor date (dayOffset) is Sunday (getDayOfWeek() === 0)
  const anchorDate = DateFactory({year, month: 6, day: dayOffset, type: calendar});
  const dayOfWeek = anchorDate.getDayOfWeek();
  if (dayOfWeek !== 0) {
    throw new Error(
      `Invalid dayOffset for locale ${locale}: \n` +
      `'year(${year}) month(6) day(${dayOffset}) (${calendar} calendar)' ` +
      `is not Sunday (getDayOfWeek()=${dayOfWeek}).\n` +
      `Please adjust 'dayOffset' so that the anchor date is Sunday.\n`
    );
  }

  return {year, dayOffset, calendar};
};

const DaysAndMonths = ({locale}) => {
  const li = useMemo(() => new LocaleInfo(locale), [locale]);
  const composeDaysAndMonths = useCallback(() => {
    let date =[];
    let formatter =[];
    let result =[];
    let nameOfDay=[];
    let weekNotAlone = [];
    let nameOfMonth=[];
    let monthNotAlone=[];
    let dayCount = 0;
    let monthCount = 0;
    let hasWeekNotAlone = false;
    let hasMonthNotAlone = false;
    const days = [];
    const months = [];
    const formatLength = ['full', 'long', 'medium', 'short'];
    const month = ['jan', 'feb', 'mar', 'apr', 'may','jun', 'jul', 'aug', 'sep','oct','nov', 'dec', 'etc'];
    const monthLength = (locale === "am-ET" || locale === "en-ET") ? month.length : month.length - 1;
    const monthIter = ['MMMM', 'MMM', 'NN', 'N'];
    const week = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri','sat'];
    const weekIter = ['EEEE', 'EEE', 'EE', 'E'];
    const calendar = li.getCalendar();
    const {year: weekdayAnchorYear, dayOffset: weekdayAnchorDayOffset} = getWeekdayAnchor(locale);

    // These sample dates are anchors to produce a stable weekday order per locale/calendar.
    // Do not update the year/day offsets without re-validating weekday labels in the table output.
    for (let i = 0; i < week.length; i++) {
      days.push([i]);
      date[i] = DateFactory({year: weekdayAnchorYear, month: 6, day: i + weekdayAnchorDayOffset, type: calendar});
      for (let j = 0; j < formatLength.length; j++) {
        formatter[j] = new DateFmt({locale: locale, date: 'w', length: formatLength[j], useNative: false, timezone: 'local'});
        result[i] = formatter[j].format(date[i]);
        nameOfDay[dayCount] = result[i];
        weekNotAlone[dayCount] = formatter[j].sysres.map[weekIter[j] + i];
        hasWeekNotAlone = typeof formatter[j].sysres.map.c0 !== 'undefined' && (nameOfDay[dayCount] !== weekNotAlone[dayCount]);
        days[i].push(hasWeekNotAlone ? `${nameOfDay[dayCount]} (${weekNotAlone[dayCount]})` : nameOfDay[dayCount]);
        dayCount++;
      }
    }

    for (let k = 0; k < monthLength; k++) {
      months.push([k + 1]);
      // Month labels depend on month index and calendar type, not on a specific sample year.
      date[k] = DateFactory({month: k + 1, type:li.getCalendar()});
      for (let l = 0; l < formatLength.length; l++) {
        formatter[l] = new DateFmt({locale: locale, date: 'm', length: formatLength[l], useNative: false, timezone: 'local'});
        result[k] = formatter[l].format(date[k]);
        nameOfMonth[monthCount] = result[k];
        monthNotAlone[monthCount] = formatter[l].sysres.map[monthIter[l] + (k + 1)];
        hasMonthNotAlone = typeof formatter[l].sysres.map.L1 !== 'undefined' && (nameOfMonth[monthCount] !== monthNotAlone[monthCount]);
        months[k].push(hasMonthNotAlone ? `${nameOfMonth[monthCount]} (${monthNotAlone[monthCount]})` : nameOfMonth[monthCount]);
        monthCount++;
      }
    }
    return {days, months};
  }, [locale, li]);

  const {days, months} = useMemo(() => composeDaysAndMonths(), [composeDaysAndMonths]);

  return (
    <Box sx={{marginBottom: 7}}>
      <Typography variant="h7">
        {'Names of days and months'}
      </Typography>
      <Typography variant="subtitle1" sx={{marginBottom: 3}}>
        {'(Note) If the typical type differs from the standalone type, it will be displayed in parenthesis.'}
      </Typography>
      <TableContainer sx={{mt: 3, ml: 3, mr: 3, width: 1200}}>
        <Table sx={{minWidth: 350, width: 1200}} size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{fontWeight: 'bold'}}>Days and Months</TableCell>
              <TableCell sx={{fontWeight: 'bold'}}>Delimiter</TableCell>
              <TableCell sx={{fontWeight: 'bold'}}>Full</TableCell>
              <TableCell sx={{fontWeight: 'bold'}}>Long</TableCell>
              <TableCell sx={{fontWeight: 'bold'}}>Medium</TableCell>
              <TableCell sx={{fontWeight: 'bold'}}>Short</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell rowSpan={days.length + 1}>Weekday</TableCell>
            </TableRow>
            {days.map((day) => (
              <TableRow key={day[0]}>
                <TableCell align="left">{day[0]}</TableCell>
                <TableCell align="left">{day[1]}</TableCell>
                <TableCell align="left">{day[2]}</TableCell>
                <TableCell align="left">{day[3]}</TableCell>
                <TableCell align="left">{day[4]}</TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell rowSpan={months.length + 1}>Month</TableCell>
            </TableRow>
            {months.map((month) => (
              <TableRow key={month[0]}>
                <TableCell align="left">{month[0]}</TableCell>
                <TableCell align="left">{month[1]}</TableCell>
                <TableCell align="left">{month[2]}</TableCell>
                <TableCell align="left">{month[3]}</TableCell>
                <TableCell align="left">{month[4]}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default DaysAndMonths;