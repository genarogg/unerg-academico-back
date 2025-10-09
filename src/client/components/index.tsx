'use client'
import React, { useEffect } from 'react'
import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client/react'

// Define la query
const GET_HELLO = gql`
  query {
    hello
  }
`;

// Define el tipo de datos que esperamos
interface HelloData {
    hello: string;
}

interface DemoProps { }

const Demo: React.FC<DemoProps> = () => {
    const { data, loading, error } = useQuery<HelloData>(GET_HELLO);

    useEffect(() => {
        if (loading) console.log('Cargando...');
        if (error) console.error('Error:', error);
        if (data) console.log('Resultado de la query:', data);
    }, [data, loading, error]);

    return (
        <div>
            <p>hola mundo</p>
            {loading && <p>Cargando...</p>}
            {error && <p>Error: {error.message}</p>}
            {data && <p>Consulta exitosa: {data.hello}</p>}
        </div>
    );
}

export default Demo;
