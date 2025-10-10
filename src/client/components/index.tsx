'use client'
import React from 'react'
import Demo from './Demo'
import RegistrarUsuario from './RegistrarUsuario'

interface IndexProps { }

const Index: React.FC<IndexProps> = () => {

    return (
        <div>
            <Demo />
            <RegistrarUsuario />
        </div>
    );
}

export default Index;
