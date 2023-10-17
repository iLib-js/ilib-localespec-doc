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

const Meridiem = ({locale}) => {
  const getMeridiems = useCallback(() => {
    const formatter = DateFmt.getMeridiemsRange({locale: locale});
    const meridems = [];
    for (let i = 0; i < formatter.length; i++) {
      meridems.push([`${formatter[i].start} ~ ${formatter[i].end}`, formatter[i].name]);
    }
    return meridems;
  }, [locale]);
  const rows = useMemo(() => getMeridiems(), [getMeridiems]);
  return (
    <Box sx={{marginBottom: 5}}>
      <Typography variant="h7">
        {'Range of Meridiem Units'}
      </Typography>
      <TableContainer sx={{mt: 3, ml: 3, mr: 3, width: 1200}}>
				<Table sx={{minWidth: 350, width: 1200}} size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{fontWeight: 'bold'}}>Time Range</TableCell>
              <TableCell sx={{fontWeight: 'bold'}}>Meridiem</TableCell>
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

export default Meridiem;