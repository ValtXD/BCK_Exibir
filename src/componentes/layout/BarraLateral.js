import React, { useState } from 'react';
import './BarraLateral.css';
import { Link } from 'react-router-dom';
import { FiHome, FiBookOpen, FiPlus } from 'react-icons/fi';

function BarraLateral() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState(1);

  const handleIconClick = (iconId) => {
    setSelectedIcon(iconId);
  };

  const handleMouseEnter = () => {
    setIsExpanded(true);
  };

  const handleMouseLeave = () => {
    setIsExpanded(false);
  };

  return (
    <div className={`layout ${isExpanded ? 'expanded' : ''}`}>
      <div
        className={`BarraLateral ${isExpanded ? 'expanded' : ''}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Link to="/" onClick={() => handleIconClick(1)}>
          <div className={`icon-container ${selectedIcon === 1 ? 'selected' : ''}`}>
            <i className="icon"><FiHome /></i>
            {isExpanded && <span className="icon-label">Home</span>}
          </div>
        </Link>

        <Link to="/Exibir" onClick={() => handleIconClick(2)}>
          <div className={`icon-container ${selectedIcon === 2 ? 'selected' : ''}`}>
            <i className="icon"><FiBookOpen /></i>
            {isExpanded && <span className="icon-label">Exibir</span>}
          </div>
        </Link>

        <Link to="/Adicionar" onClick={() => handleIconClick(3)}>
          <div className={`icon-container ${selectedIcon === 3 ? 'selected' : ''}`}>
            <i className="icon"><FiPlus /></i>
            {isExpanded && <span className="icon-label">Adicionar</span>}
          </div>
        </Link>

      </div>
    </div>
  );
}

export default BarraLateral;
