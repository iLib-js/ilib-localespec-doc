import {useParams} from 'react-router-dom';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Header from './Header';
import LocaleDrawer from './LocaleDrawer';
import {Outlet} from 'react-router-dom';

const Layout = () => {
  const {locale} = useParams();
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Header />
      <LocaleDrawer locale={locale} />
      <Outlet />
    </Box>
  );
};

export default Layout;