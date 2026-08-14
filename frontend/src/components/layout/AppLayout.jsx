import React from 'react';
import { Outlet } from 'react-router-dom';

import Sidebar from './Sidebar.jsx';
import MobileNav from './MobileNav.jsx';
import SOSButton from '../ui/SOSButton.jsx';

const AppLayout = () => {
  return (
    <div
      className="
        relative
        flex
        min-h-screen
        w-full
        items-stretch
        overflow-x-hidden
        bg-indigo-950
        bg-aurora-dark
        noise
      "
    >

      {/* =========================
          DESKTOP SIDEBAR
      ========================= */}

      <Sidebar />


      {/* =========================
          MAIN CONTENT
      ========================= */}

      <main
        className="
          min-w-0
          flex-1
          pb-24
          md:pb-0
        "
      >

        <div
          className="
            mx-auto
            w-full
            max-w-6xl
            px-4
            py-6
            sm:px-6
            sm:py-10
          "
        >
          <Outlet />
        </div>

      </main>


      {/* =========================
          MOBILE NAV
      ========================= */}

      <MobileNav />


      {/* =========================
          SOS BUTTON
      ========================= */}

      <SOSButton />

    </div>
  );
};

export default AppLayout;