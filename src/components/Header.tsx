import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { FiSun, FiMoon } from 'react-icons/fi';

const Header: React.FC = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <header>
            <nav>
                <div className="vault-links-wrapper">
                  <NavLink to="/">Home</NavLink>
                  <NavLink to="/blog">Blog</NavLink>
                </div>
                
                <div className="vault-links-wrapper">
                    <NavLink to="/nexus">
                        Nexus
                    </NavLink>
                </div>

                <button
                    type="button"
                    onClick={toggleTheme}
                    className="theme-toggle-button"
                    aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                    title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                >
                    {theme === 'light' ? <FiMoon /> : <FiSun />}
                </button>
            </nav>
        </header>
    );
};

export default Header;