import { useCallback, useMemo } from 'react';
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
import NumFmt from 'ilib/lib/NumFmt';

const toVisibleWhitespace = (value = '') => value
  .replace(/ /g, '⍽')
  .replace(/\u00A0/g, '⍽')
  .replace(/\u202F/g, '⍽');

const getUnicodeLabel = (value = '') => Array.from(value)
  .map((char) => `U+${char.codePointAt(0).toString(16).toUpperCase().padStart(4, '0')}`)
  .join(' ');

const formatVisibleValue = (value) => {
  if (value === undefined || value === null) return '-';

  const stringValue = String(value);
  if (stringValue.length === 0) {
    return '(empty)';
  }

  if (!/^\s+$/.test(stringValue)) {
    return stringValue;
  }

  return toVisibleWhitespace(stringValue);
};

const renderVisibleValue = (value) => {
  if (value === undefined || value === null) {
    return '-';
  }

  const stringValue = String(value);
  if (stringValue.length === 0) {
    return '(empty)';
  }

  const visibleValue = formatVisibleValue(stringValue);
  const characters = Array.from(stringValue);
  const shouldShowUnicode = /^\s+$/u.test(stringValue) || characters.length === 1;

  if (!shouldShowUnicode) {
    return visibleValue;
  }

  return (
    <Box component="span">
      <Box component="span">{visibleValue}</Box>
      <Box component="span" sx={{fontSize: '0.75em', color: 'text.secondary', ml: 0.5}}>
        ({getUnicodeLabel(stringValue)})
      </Box>
    </Box>
  );
};

const Number = ({locale}) => {
  const li = useMemo(() => new LocaleInfo(locale), [locale]);
  const composeNumbers = useCallback(() => {
    const formatter = new NumFmt({locale: locale});
    const numFormatter = new NumFmt({locale: locale, type: 'number'});
    const percentageFormatter = new NumFmt({locale: locale, type: 'percentage'});
    const currencyFormatter = new NumFmt({locale: locale, type: 'currency', currency: li.getCurrency()});
    /*  Due to a bug in Currency class sync option, currency format can be displayed from iLib 14.15.0 */
    return [
      ['Decimal Seperator', li.getDecimalSeparator(), numFormatter?.format(1.734)],
      ['Number Grouping', li.getGroupingSeparator(), numFormatter?.format(123456789.4)],
      ['Percent', li.getPercentageFormat(), percentageFormatter?.format(34)],
      ['Negative Percent', li.getNegativePercentageFormat(), percentageFormatter?.format(-34)],
      ['Currency', li.getCurrencyFormats().common, currencyFormatter?.format(57.05)],
      ['Negative Currency', li.getCurrencyFormats().commonNegative, currencyFormatter?.format(-57.05)],
      ['Plus', '{n}', formatter.format(572)],
      ['Minus', li.getNegativeNumberFormat(), formatter.format(-37)],
    ];
  }, [locale, li]);
  const rows = useMemo(() => composeNumbers(), [composeNumbers]);

  return (
    <Box sx={{marginTop: 5, marginBottom: 5}}>
      <Typography variant="h7">
        {'Data Format: Number'}
      </Typography>
       <Typography variant="subtitle1" sx={{marginBottom: 3}}>
        (Note) Whitespace-only separators are shown as '⍽', and single-character separators include their Unicode value.
      </Typography>
      <TableContainer sx={{mt: 3, ml: 3, mr: 3, width: 1200}}>
        <Table sx={{minWidth: 350, width: 1200}} size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{fontWeight: 'bold', width: 600}}>Number</TableCell>
              <TableCell sx={{fontWeight: 'bold'}} align="left">Output Format</TableCell>
              <TableCell sx={{fontWeight: 'bold'}} align="left">Example</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row[0]}>
                <TableCell>{row[0]}</TableCell>
                <TableCell sx={{whiteSpace: 'pre-wrap'}}>{renderVisibleValue(row[1])}</TableCell>
                <TableCell>{row[2]}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Number;