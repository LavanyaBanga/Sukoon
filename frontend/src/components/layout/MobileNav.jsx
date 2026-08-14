import React from 'react';
import { NavLink } from 'react-router-dom';

import {
  Home,
  Bird,
  BookOpen,
  BarChart3,
  Menu,
} from 'lucide-react';

import { motion } from 'framer-motion';

const items = [
  {
    to: '/dashboard',
    icon: Home,
    label: 'Home',
  },
  {
    to: '/ask-krishna',
    icon: Bird,
    label: 'Krishna',
  },
  {
    to: '/journal',
    icon: BookOpen,
    label: 'Journal',
  },
  {
    to: '/insights',
    icon: BarChart3,
    label: 'Insights',
  },
  {
    to: '/settings',
    icon: Menu,
    label: 'More',
  },
];

const MobileNav = () => {
  return (
    <nav
      className="
        fixed
        bottom-0
        left-0
        right-0
        z-50
        md:hidden

        border-t
        border-pink-100

        bg-white/90
        backdrop-blur-xl

        shadow-[0_-8px_30px_rgba(100,80,100,0.08)]

        px-2
        pt-2

        pb-[calc(0.5rem+env(safe-area-inset-bottom))]
      "
    >
      {/* subtle top glow */}

      <div className="pointer-events-none absolute inset-x-0 -top-6 h-10 bg-gradient-to-t from-pink-100/30 to-transparent blur-xl" />


      <div className="relative grid grid-cols-5 gap-1">

        {items.map(
          ({
            to,
            icon: Icon,
            label,
          }) => (
            <NavLink
              key={to}
              to={to}
              className="block"
            >
              {({ isActive }) => (
                <motion.div
                  whileTap={{
                    scale: 0.92,
                  }}
                  className={`
                    relative
                    flex
                    min-h-[58px]
                    flex-col
                    items-center
                    justify-center
                    gap-1

                    rounded-2xl

                    px-1
                    py-1.5

                    text-[10px]

                    transition-all
                    duration-200

                    ${
                      isActive
                        ? `
                          bg-gradient-to-br
                          from-blue-50
                          via-pink-50
                          to-yellow-50

                          font-medium
                          text-[#4F6C7B]

                          shadow-sm
                        `
                        : `
                          text-slate-400

                          active:bg-pink-50/60
                        `
                    }
                  `}
                >

                  {/* ACTIVE TOP LINE */}

                  {isActive && (
                    <motion.span
                      layoutId="mobile-active"
                      className="
                        absolute
                        -top-2
                        left-1/2

                        h-[3px]
                        w-8

                        -translate-x-1/2

                        rounded-b-full

                        bg-gradient-to-r
                        from-[#5B86D0]
                        via-[#D58FA7]
                        to-[#D5A13C]
                      "
                    />
                  )}


                  {/* ICON CONTAINER */}

                  <div
                    className={`
                      flex
                      h-8
                      w-8
                      items-center
                      justify-center

                      rounded-xl

                      transition-all

                      ${
                        isActive
                          ? `
                            bg-white
                            text-[#5B86B5]
                            shadow-sm
                          `
                          : `
                            bg-transparent
                            text-slate-400
                          `
                      }
                    `}
                  >
                    <Icon size={19} />
                  </div>


                  {/* LABEL */}

                  <span
                    className={
                      isActive
                        ? 'text-[#526E7C]'
                        : 'text-[#97A6AE]'
                    }
                  >
                    {label}
                  </span>

                </motion.div>
              )}
            </NavLink>
          )
        )}

      </div>


      {/* SMALL DECORATION */}

      <div className="pointer-events-none absolute right-2 top-1 text-[9px] opacity-30">
        ✨
      </div>

    </nav>
  );
};

export default MobileNav;