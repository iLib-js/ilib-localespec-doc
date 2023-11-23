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
import DurationFmt from 'ilib/lib/DurationFmt';
import {numberSamplesForPlural} from '../locales';

const Duration = ({locale}) => {
  const composeDuration = useCallback(() => {
    const dateDurations = [];
    const timeDurations = [];
    const numberOfDuration = numberSamplesForPlural[locale];
    const formatLength = ['full', 'long', 'medium', 'short'];

    for (let i = 0; i < numberOfDuration.length; i++) {
        dateDurations.push([]);
        timeDurations.push([]);
        for (let j = 0; j < formatLength.length; j++) {
            const sample = numberOfDuration[i];
            const formatter = new DurationFmt({locale: locale, style: 'text', length: formatLength[j]});
      const dateFormatResult = formatter.format({year: sample, month: sample, week: sample, day: sample}).toString()
            const timeFormatResult = formatter.format({hour: sample, minute: sample, second: sample}).toString()
            dateDurations[i].push([formatLength[j], dateFormatResult]);
      timeDurations[i].push([formatLength[j], timeFormatResult]);
        }
    }
    return {dateDurations, timeDurations, formatLength};
  }, [locale]);

  const {dateDurations, timeDurations, formatLength} = useMemo(() => composeDuration(), [composeDuration]);

  return (
    <Box sx={{marginBottom: 5}}>
      <Typography variant="h7">
        {'Data Format: Date/Time Duration'}
      </Typography>
      <TableContainer sx={{mt: 3, ml: 3, mr: 3, width: 1200}}>
        <Table sx={{minWidth: 350, width: 1200}} size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{fontWeight: 'bold'}}>Date / Time</TableCell>
              <TableCell sx={{fontWeight: 'bold'}}>Length</TableCell>
              <TableCell sx={{fontWeight: 'bold'}}>Example</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell sx={{width: 350}} rowSpan={dateDurations.length * formatLength.length + 1}>{'Date'}</TableCell>
            </TableRow>
            {
              dateDurations.map((dateDuration, index) => (
                <Fragment key={index}>
                  {dateDuration.map((duration, index) => (
                    <TableRow key={duration[0] + index}>
                      <TableCell align="left">{duration[0]}</TableCell>
                      <TableCell align="left">{duration[1]}</TableCell>
                    </TableRow>
                  ))}
                </Fragment>
              ))
            }
            <TableRow>
              <TableCell sx={{width: 350}} rowSpan={timeDurations.length * formatLength.length + 1}>{'Time'}</TableCell>
            </TableRow>
            {
              timeDurations.map((timeDuration, index) => (
                <Fragment key={index}>
                  {timeDuration.map((duration, index) => (
                    <TableRow key={duration[0] + index}>
                      <TableCell align="left">{duration[0]}</TableCell>
                      <TableCell align="left">{duration[1]}</TableCell>
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

export default Duration;