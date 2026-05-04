import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ItemList from './pages/ItemList';
import Cadastro from './pages/Cadastro';
import Projects from './pages/Projects';
import LPDSPreview from './pages/LPDSPreview';
import PTRPreview from './pages/PTRPreview';
import Embalagens from './pages/Embalagens';
import Fornecedores from './pages/Fornecedores';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/items" element={<ItemList />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/lpds-preview" element={<LPDSPreview />} />
          <Route path="/ptr-preview" element={<PTRPreview />} />
          <Route path="/embalagens" element={<Embalagens />} />
          <Route path="/fornecedores" element={<Fornecedores />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
