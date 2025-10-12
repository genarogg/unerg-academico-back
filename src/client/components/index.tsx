'use client'
import React from 'react'
import Demo from './Demo'
import RegistrarUsuario from './RegistrarUsuario'
import LoginUsuario from './LoginUsuario'
import Titulo from './Titulo'
import TokenManager from "./TokenManager"
import GetUsuario from './GetUsuario'
import GetUsuarios from './GetUsuarios'

import CrearEstadoPais from "./CrearEstadoPais"
import GetEstadosPais from "./GetEstadoPais"
import ActualizarEstadoPais from './ActualizarEstadoPais'

import CrearZonaUrbanizacion from './CrearZonaUrbanizacion'
import GetZonasUrbanizacion from './GetZonasUrbanizacion'
import ActualizarZonaUrbanizacion from './ActualizarZonaUrbanizacion'

// import ActualizarDatosPersonales from './ActualizarDatosPersonales'

import VerDatosPersonales from './VerDatosPersonales'
import ActualizarDatosPersonales from './ActualizarDatosPersonales'


interface IndexProps { }

const Index: React.FC<IndexProps> = () => {
    return (
        <div className="space-y-10">

            {/* <Titulo texto="Ejemplo de Query: Demo" />
            <Demo />

            <Titulo texto="Token Local" colorFondo="bg-gray-800" />
            <TokenManager />

            <Titulo texto="Registro de Usuario" />
            <RegistrarUsuario />

            <Titulo texto="Login de Usuario" />
            <LoginUsuario />

            <Titulo texto="Get Usuario" />
            <GetUsuario />

            <Titulo texto="Ver Datos Personales" />
            <VerDatosPersonales />

            <Titulo texto="Actualizar Datos Personales" />
            <ActualizarDatosPersonales />
            
            <Titulo texto="Get Usuarios" />
            <GetUsuarios />

            <Titulo texto="crear estado del pais" />
            <CrearEstadoPais />

            <Titulo texto="obtener estados del pais" />
            <GetEstadosPais />

            <Titulo texto="actualizar estado del pais" />
            <ActualizarEstadoPais />


            <Titulo texto="crear zona urbanizacion" />
            <CrearZonaUrbanizacion />

            <Titulo texto="obtener zonas urbanizacion" />
            <GetZonasUrbanizacion />

           

            <Titulo texto="actualizar zona urbanizacion" />
            <ActualizarZonaUrbanizacion /> */}
        </div>
    );
}

export default Index;
