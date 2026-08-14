import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './context/AuthContext.jsx';

import Landing from './pages/Landing.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Onboarding from './pages/Onboarding.jsx';
import Dashboard from './pages/Dashboard.jsx';
import AskKrishna from './pages/ai/AskKrishna.jsx';
import TalkToSukoon from './pages/ai/TalkToSukoon.jsx';
import MoodTracker from './pages/MoodTracker.jsx';
import Journal from './pages/Journal.jsx';
import GratitudeGarden from './pages/GratitudeGarden.jsx';
import Breathe from './pages/Breathe.jsx';
import UnloadMind from './pages/UnloadMind.jsx';
import Sleep from './pages/Sleep.jsx';
import Insights from './pages/Insights.jsx';
import Profile from './pages/Profile.jsx';
import Settings from './pages/Settings.jsx';
import NotFound from './pages/NotFound.jsx';
import AppLayout from './components/layout/AppLayout.jsx';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-indigo-950 text-cream">
        <div className="animate-pulse text-lg">Finding your quiet space…</div>
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  if (!user.onboardingCompleted) return <Navigate to="/onboarding" replace />;
  return children;
};

function App() {
  return (
    <>
      <Toaster position="top-center" toastOptions={{ style: { background: '#1B2148', color: '#F5F1E8', border: '1px solid rgba(212,175,106,0.3)' } }} />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/onboarding" element={<Onboarding />} />

        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/ask-krishna" element={<AskKrishna />} />
          <Route path="/talk" element={<TalkToSukoon />} />
          <Route path="/mood" element={<MoodTracker />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/gratitude" element={<GratitudeGarden />} />
          <Route path="/breathe" element={<Breathe />} />
          <Route path="/unload" element={<UnloadMind />} />
          <Route path="/sleep" element={<Sleep />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
