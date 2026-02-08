import { Route, Routes } from 'react-router-dom';
import { models } from './data/models';
import AppLayout from './components/AppLayout';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import ModelPage from './pages/models/ModelPage';

function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/models" element={<DashboardPage />} />
        <Route path="/models/:modelId" element={<ModelPage models={models} />} />
      </Routes>
    </AppLayout>
  );
}

export default App;
