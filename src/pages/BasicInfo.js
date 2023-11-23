import { useMemo } from 'react';
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
import ScriptInfo from 'ilib/lib/ScriptInfo';

const BasicInfo = ({locale}) => {
  const li = useMemo(() => new LocaleInfo(locale), [locale]);
  const si = useMemo(() => new ScriptInfo(li.getScript()), [li]);
  const rows = useMemo(() => [
    ['System Locale', locale],
    ['Locale Descripton', li.getLanguageName() + ' , ' + li.getRegionName() + ' (' + li.getScript() + ')'],
    ['Script Direction', si.getScriptDirection()],
    ['Default Calendar', li.getCalendar()],
    ['Clock', li.getClock()],
    ['Currency', li.getCurrency()],
    ['Week Start at', li.getFirstDayOfWeek()],
    ['Weekend Start at', li.getWeekEndStart()],
    ['Weekend End at', li.getWeekEndEnd()],
    ['Delimiter Quotation Start', li.getDelimiterQuotationStart()],
    ['Delimiter Quotation End', li.getDelimiterQuotationEnd()]
  ], [locale, li, si]);

  return (
    <Box sx={{marginTop: 4, marginBottom: 5}}>
      <Typography variant="h7">
        {'Basic Information'}
      </Typography>
      <TableContainer sx={{mt: 3, ml: 3, mr: 3, width: 1200}}>
        <Table sx={{minWidth: 350, width: 1200}} size="small">
          <TableHead >
            <TableRow>
              <TableCell sx={{fontWeight: 'bold', width: 600}}>Subject</TableCell>
              <TableCell sx={{fontWeight: 'bold'}} align="left">Information</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row[0]}>
                <TableCell>{row[0]}</TableCell>
                <TableCell>{row[1]}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default BasicInfo;