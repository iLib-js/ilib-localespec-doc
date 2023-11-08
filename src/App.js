import { Route, Routes } from 'react-router-dom';
import Layout from './layout';
import LocaleRef from './pages/LocaleRef';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/locales/:locale" element={<LocaleRef />} />
      </Route>
    </Routes>
  );
};

export default App;