import React from 'react';
import { NavLink } from 'react-router-dom';

const VAULT_IDS = ['Neuroscience', 'Space', 'Bioengineering', 'Robots', 'AI'];

const Header: React.FC = () => {
  return (
    <header>
      <nav>
        <NavLink to="/">Home</NavLink>
        <div style={{ flexGrow: 1 }}></div>
        {VAULT_IDS.map(id => (
          <NavLink key={id} to={`/vaults/${id}`} style={{ marginLeft: '8px' }}>
            {id.charAt(0).toUpperCase() + id.slice(1)} {}
          </NavLink>
        ))}
      </nav>
    </header>
  );
};

export default Header;