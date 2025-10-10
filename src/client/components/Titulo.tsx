'use client'
import React from 'react';

interface TituloProps {
  texto: string;
  colorFondo?: string; // Permite personalizar el color opcionalmente
}

const Titulo: React.FC<TituloProps> = ({ texto, colorFondo = 'bg-black' }) => {
  return (
    <h2
      className={`text-2xl font-semibold text-center text-white py-3 shadow-md mb-6 ${colorFondo}`}
    >
      {texto}
    </h2>
  );
};

export default Titulo;
