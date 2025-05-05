import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { useMediaQuery } from 'usehooks-ts';
import { useTheme } from '../context/ThemeContext';
import { FiSun, FiMoon } from 'react-icons/fi';

const VAULT_IDS = ['Neuroscience', 'Space', 'Bioengineering', 'Robots', 'AI'];

const MOBILE_BREAKPOINT = '(max-width: 860px)';

const Header: React.FC = () => {
    const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
    const moreMenuRef = useRef<HTMLDivElement>(null);
    const isMobile = useMediaQuery(MOBILE_BREAKPOINT);
    const { theme, toggleTheme } = useTheme();

    // Decide which vault links are visible directly vs in "More" menu
    // Example: Keep all vaults in the "More" menu on mobile for simplicity
    const visibleVaults = isMobile ? [] : VAULT_IDS;
    const hiddenVaults = isMobile ? VAULT_IDS : [];
    const showVaultsButton = isMobile && hiddenVaults.length > 0;

    const toggleMoreMenu = (event: React.MouseEvent) => {
        event.stopPropagation();
        setIsMoreMenuOpen(prev => !prev);
    };

    // Effect to close dropdown (no changes needed here)
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
                setIsMoreMenuOpen(false);
            }
        };
        if (showVaultsButton && isMoreMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMoreMenuOpen, showVaultsButton]);

    return (
        <header>
            <nav>
                <div className="vault-links-wrapper">
                  <NavLink to="/">Home</NavLink>
                  <NavLink to="/blog">Blog</NavLink>
                </div>
                {/* Wrapper for Vault links AND the More menu */}
                <div className="vault-links-wrapper">
                    {/* Directly visible vault links (Desktop) */}
                    {visibleVaults.map(id => (
                        <NavLink key={id} to={`/vaults/${id}`}>
                            {id.charAt(0).toUpperCase() + id.slice(1)}
                        </NavLink>
                    ))}

                    {/* "Vaults" button and Dropdown (Mobile) */}
                    {showVaultsButton && (
                        <div className="more-menu-container" ref={moreMenuRef}>
                            <button
                                type="button"
                                className="more-button"
                                onClick={toggleMoreMenu}
                                aria-haspopup="true"
                                aria-expanded={isMoreMenuOpen}
                            >
                                Vaults {/* Changed text from "More" */}
                            </button>

                            {isMoreMenuOpen && (
                                <div className="more-dropdown-menu">
                                    {hiddenVaults.map(id => (
                                        <NavLink
                                            key={id}
                                            to={`/vaults/${id}`}
                                            onClick={() => setIsMoreMenuOpen(false)}
                                        >
                                            {id.charAt(0).toUpperCase() + id.slice(1)}
                                        </NavLink>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div> {/* End vault-links-wrapper */}

                {/* Theme Toggle Button (remains at the end) */}
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