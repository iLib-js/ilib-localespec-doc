import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import '@enact/i18n';
import ilib from 'ilib';

const Header = () => {
    return (
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            {`Locale Spec Reference (iLib v${ilib.getVersion()})`}
          </Typography>
        </Toolbar>
      </AppBar>
    );
};

export default Header;