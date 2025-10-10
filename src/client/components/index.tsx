'use client'
import React from 'react'
import Demo from './Demo'
import RegistrarUsuario from './RegistrarUsuario'
import LoginUsuario from './LoginUsuario'
import Titulo from './Titulo'
import TokenManager from "./TokenManager"
import GetUsuario from './GetUsuario'
import GetUsuarios from './GetUsuarios' // <--- Importa el nuevo componente

interface IndexProps { }

const Index: React.FC<IndexProps> = () => {
    return (
        <div className="space-y-10">

            <Titulo texto="Ejemplo de Query: Demo" />
            <Demo />

            <Titulo texto="Token Local" colorFondo="bg-gray-800" />
            <TokenManager />

            <Titulo texto="Registro de Usuario" />
            <RegistrarUsuario />

            <Titulo texto="Login de Usuario" />
            <LoginUsuario />

            <Titulo texto="Get Usuario" />
            <GetUsuario />

            <Titulo texto="Get Usuarios" />
            <GetUsuarios />
        </div>
    );
}

export default Index;
