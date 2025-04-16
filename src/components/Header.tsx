import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { useMediaQuery } from 'usehooks-ts'; // Using hook for responsiveness

// Assuming VAULT_IDS is defined correctly and includes all your vaults
const VAULT_IDS = ['Neuroscience', 'Space', 'Bioengineering', 'Robots', 'AI'];
// Configuration: How many vault links to show before putting in "More" ON MOBILE
const MAX_VISIBLE_VAULT_LINKS_MOBILE = 1; // Adjust this number as needed
const MOBILE_BREAKPOINT = '(max-width: 768px)'; // Adjust breakpoint as needed

const Header: React.FC = () => {
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery(MOBILE_BREAKPOINT);

  const visibleVaults = isMobile ? [] : VAULT_IDS;
  const hiddenVaults = isMobile ? VAULT_IDS : [];
  
  const showVaultsButton = isMobile && hiddenVaults.length > 0;

  const toggleMoreMenu = (event: React.MouseEvent) => {
      event.stopPropagation();
      setIsMoreMenuOpen(prev => !prev);
  };

  // Effect to close dropdown if clicked outside
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
      {/* Nav container uses flexbox with space-between */}
      <nav>
        {/* Home link always visible on the left */}
        <NavLink to="/">Home</NavLink>

        {/* Wrapper div for vault links AND the More menu */}
        {/* This wrapper will be pushed to the right by justify-content: space-between */}
        <div className="vault-links-wrapper">
            {/* Directly visible vault links */}
            {visibleVaults.map(id => (
              <NavLink key={id} to={`/vaults/${id}`}>
                {id.charAt(0).toUpperCase() + id.slice(1)}
              </NavLink>
            ))}

            {/* "Vaults" button and Dropdown (conditionally rendered inside wrapper) */}
            {showVaultsButton && (
              <div className="more-menu-container" ref={moreMenuRef}>
                <button
                  type="button"
                  className="more-button"
                  onClick={toggleMoreMenu}
                  aria-haspopup="true"
                  aria-expanded={isMoreMenuOpen}
                >
                  Vaults
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
      </nav>
    </header>
  );
};

export default Header;
