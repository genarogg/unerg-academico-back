'use client'
import React from 'react'
import Demo from './Demo'
import RegistrarUsuario from './RegistrarUsuario'
import LoginUsuario from './LoginUsuario'
import Titulo from './Titulo'

interface IndexProps { }

const Index: React.FC<IndexProps> = () => {
    return (
        <div className="space-y-10">
            <Titulo texto="Ejemplo de Query: Demo" />
            <Demo />

            <Titulo texto="Registro de Usuario" />
            <RegistrarUsuario />

            <Titulo texto="Login de Usuario" />
            <LoginUsuario />
        </div>
    );
}

export default Index;
