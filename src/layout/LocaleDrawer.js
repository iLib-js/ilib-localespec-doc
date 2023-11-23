import {useState, useCallback, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import {locales} from '../locales';
import SearchBar from './SearchBar';

const drawerWidth = 360;
const i18nLocaleList = Object.keys(locales).sort();

const LocaleDrawer = ({locale}) => {
  const navigate = useNavigate();
  const [localeIndex, setLocaleIndex] = useState(0);
  const [localeList, setLocaleList] = useState(i18nLocaleList);

  const clickHandler = useCallback((index) => {
    setLocaleIndex(index);
    navigate('/locales/' + locales[localeList[index]]);
  }, [navigate, localeList]);

  const requestSearch = (input) => {
    const filteredLocaleList = i18nLocaleList.filter((locale) => {
      return locale.toLowerCase().includes(input.toLowerCase());
    });
    setLocaleList(filteredLocaleList);
  };

  useEffect(() => {
    if (typeof locale === 'undefined') {
      navigate('/locales/' + locales[localeList[0]]);
    } else {
      for (let loc in locales) {
        if (locales[loc] === locale) {
          // TODO toscroll in mui
          setLocaleIndex(localeList.indexOf(loc));
        }
      }
    }
    // eslint-disable-next-line
  }, []);

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <SearchBar
          value=""
          onChange={requestSearch}
        />
        <List>
          {localeList.map((text, index) => (
            <ListItemButton selected={localeIndex === index} key={text} onClick={() => clickHandler(index)} >
              <ListItemText primary={text} secondary={locales[localeList[index]]} />
            </ListItemButton>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default LocaleDrawer;