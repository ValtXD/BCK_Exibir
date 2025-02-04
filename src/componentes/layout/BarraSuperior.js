import React, { useState } from 'react';
import './BarraSuperior.css';

const BarraSuperior = () => {
  const [showUserInfo, setShowUserInfo] = useState(false);

  const toggleUserInfo = () => {
    setShowUserInfo(!showUserInfo);
  };

  return (
    <div className="BarraSuperior">
      <div className="BarraSuperior-left">
          <img src="/logo-super.png" 
          alt="Foto de Perfil" 
          className="logo-super"/>
        </div>
      <div className="BarraSuperior-right">
        <img 
          src="/perfil.webp" 
          alt="Foto de Perfil" 
          className="foto-perfil" 
          onClick={toggleUserInfo}
        />
        {showUserInfo && (
          <div className="user-info-dropdown">
          <img 
          src="/perfil.webp" 
          alt="Foto de Perfil" 
          className="foto-perfil"/>
          <button type='exit' className='ButtonSair'>Sair</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BarraSuperior;
