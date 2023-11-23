import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const Copyright = () => {
  return (
    <Box sx={{marginTop: 4, marginBottom: 5}}>
      <Typography variant="overline" display="block" sx={{paddingLeft: 40, paddingTop: 5, fontWeight: 'bold'}} >
          {'Data tables provided by JEDL Soft. (c) 2012-2023'}
      </Typography>
    </Box>
  );
};

export default Copyright;