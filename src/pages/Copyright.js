import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {COPYRIGHT_START_YEAR, COPYRIGHT_END_YEAR} from '../constants/dateConstants';

const Copyright = () => {
  return (
    <Box sx={{marginTop: 4, marginBottom: 5}}>
      <Typography variant="overline" display="block" sx={{paddingLeft: 40, paddingTop: 5, fontWeight: 'bold'}} >
          {`Data tables provided by JEDL Soft. (c) ${COPYRIGHT_START_YEAR}-${COPYRIGHT_END_YEAR}`}
      </Typography>
    </Box>
  );
};

export default Copyright;