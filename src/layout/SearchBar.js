import {useState, useCallback} from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import Search from '@mui/icons-material/Search';

const SearchBar = ({...props}) => {
  const [searchString, setSearchString] = useState(props.value);
  const handleChange = useCallback((event) => {
    setSearchString(event.target.value);
    if (props.onChange) {
        props.onChange(event.target.value);
    }
  }, [props]);

  return (
    <FormControl  sx={{marginLeft: 1, marginTop: 2}}>
      <InputLabel>Search</InputLabel>
      <Input
        value={searchString}
        label={'Search'}
        sx={{width: 300 }}
        onChange={handleChange}
        endAdornment={
          <InputAdornment position="end">
            <Search />
          </InputAdornment>
        }
      />
    </FormControl>
  );
};

export default SearchBar;