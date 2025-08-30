import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LogoIcon } from './icons/LogoIcon';
import { Role } from '../types';

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  const activeLinkStyle = {
    color: '#78350f', // amber-800
    textDecoration: 'underline',
    textUnderlineOffset: '4px',
  };

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <NavLink to="/" className="flex-shrink-0 flex items-center gap-2">
              <LogoIcon />
              <span className="text-xl font-bold text-amber-900 tracking-tight">The Gilded Spoon</span>
            </NavLink>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <NavLink
                to="/"
                className="text-gray-600 hover:text-amber-800 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                style={({ isActive }) => (isActive ? activeLinkStyle : {})}
              >
                Book a Table
              </NavLink>
              {user?.role === Role.ADMIN && (
                <NavLink
                  to="/admin"
                  className="text-gray-600 hover:text-amber-800 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                   style={({ isActive }) => (isActive ? activeLinkStyle : {})}
                >
                  Admin Dashboard
                </NavLink>
              )}
              {user && (
                <NavLink
                  to="/my-reservations"
                  className="text-gray-600 hover:text-amber-800 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                   style={({ isActive }) => (isActive ? activeLinkStyle : {})}
                >
                  My Reservations
                </NavLink>
              )}
            </div>
          </div>
          <div className="flex items-center">
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-700">Welcome, {user.name}</span>
                <button
                  onClick={logout}
                  className="bg-amber-800 text-white hover:bg-amber-900 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <NavLink
                to="/auth"
                className="bg-amber-800 text-white hover:bg-amber-900 px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Login / Sign Up
              </NavLink>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
