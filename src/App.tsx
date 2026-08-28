/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { HashRouter, Routes, Route } from 'react-router-dom';
import { DatasetProvider } from './context/DatasetContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Dataset from './pages/Dataset';
import Preprocessing from './pages/Preprocessing';
import EDA from './pages/EDA';
import PlacementInsights from './pages/PlacementInsights';
import Prediction from './pages/Prediction';
import SalaryAnalysis from './pages/SalaryAnalysis';
import Reports from './pages/Reports';
import About from './pages/About';

export default function App() {
  return (
    <DatasetProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="dataset" element={<Dataset />} />
            <Route path="preprocessing" element={<Preprocessing />} />
            <Route path="exploratory" element={<EDA />} />
            <Route path="placement-insights" element={<PlacementInsights />} />
            <Route path="prediction" element={<Prediction />} />
            <Route path="salary" element={<SalaryAnalysis />} />
            <Route path="reports" element={<Reports />} />
            <Route path="about" element={<About />} />
          </Route>
        </Routes>
      </HashRouter>
    </DatasetProvider>
  );
}
