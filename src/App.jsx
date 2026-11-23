import React, { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './hooks/AuthContext.jsx';
import Layout from './components/Layout/Layout.jsx';
import { RouteLoading } from './App.styles.js';

const Opening = lazy(() => import('./pages/Opening/Opening.jsx'));
const HomePage = lazy(() => import('./pages/HomePage/HomePage.jsx'));
const GroupBuyDetailPage = lazy(() => import('./pages/GroupBuyDetailPage/GroupBuyDetailPage.jsx'));
const UsedDetailPage = lazy(() => import('./pages/UsedDetailPage/UsedDetailPage.jsx'));
const NewPostPage = lazy(() => import('./pages/NewPostPage/NewPostPage.jsx'));
const MyActivityPage = lazy(() => import('./pages/MyActivityPage/MyActivityPage.jsx'));
const LoginPage = lazy(() => import('./pages/LoginPage/LoginPage.jsx'));

export default function App() {
  return <AuthProvider><Suspense fallback={<RouteLoading role="status">09INU를 불러오고 있어요…</RouteLoading>}><Routes>
    <Route path="/" element={<Opening />} />
    <Route element={<Layout />}>
      <Route path="/home" element={<HomePage />} />
      <Route path="/groupbuys/:id" element={<GroupBuyDetailPage />} />
      <Route path="/used/:id" element={<UsedDetailPage />} />
      <Route path="/new" element={<NewPostPage />} />
      <Route path="/me" element={<MyActivityPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Route>
  </Routes></Suspense></AuthProvider>;
}
