import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import '@enact/i18n';
import ilib from 'ilib';

const Header = () => {
    return (
      <AppBar position="fixed" sx={{bgcolor:'#7d848c', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
        <Typography variant="h6" noWrap component="div">
            {`Locale Spec Reference (iLib v${ilib.getVersion()})`}
          </Typography>
          
          <Typography variant="h7" noWrap component="div" sx={{ml:1, pt:0.5}} >
            {`Based on version CLDR v${ilib.getCLDRVersion()}`}
          </Typography>
        </Toolbar>
      </AppBar>
    );
};

export default Header;