/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import TestSeriesDetails from './pages/TestSeriesDetails';
import TestSession from './pages/TestSession';
import Results from './pages/Results';
import InstantDoubt from './pages/InstantDoubt';
import { ThemeProvider } from './components/ThemeProvider';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const user = localStorage.getItem('user');
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="shiksha-setu-theme">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Auth />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="test-series/:seriesId" element={<ProtectedRoute><TestSeriesDetails /></ProtectedRoute>} />
            <Route path="test/:testId" element={<ProtectedRoute><TestSession /></ProtectedRoute>} />
            <Route path="results/:testId" element={<ProtectedRoute><Results /></ProtectedRoute>} />
            <Route path="instant-doubt" element={<ProtectedRoute><InstantDoubt /></ProtectedRoute>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
