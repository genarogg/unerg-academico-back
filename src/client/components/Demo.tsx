'use client'
import React, { useEffect } from 'react'
import { GET_HELLO } from "@/query"
import { useQuery } from '@apollo/client/react'
// Define la query


// Define el tipo de datos que esperamos
interface HelloData {
    hello: string
}

interface DemoProps { }

const Demo: React.FC<DemoProps> = () => {
    const { data, loading, error } = useQuery<HelloData>(GET_HELLO)

    useEffect(() => {
        if (loading) console.log('Cargando...')
        if (error) console.error('Error:', error)
        if (data) console.log('Resultado de la query:', data)
    }, [data, loading, error])

    return (
        <div className="flex justify-center bg-gray-100">
            {loading && (
                <div className="bg-blue-500 text-white px-6 py-4 w-full shadow-lg text-center text-lg font-semibold animate-pulse">
                    Cargando...
                </div>
            )}
            {error && (
                <div className="bg-red-500 text-white px-6 py-4 w-full shadow-lg text-center text-lg font-semibold">
                    Error: {error.message}
                </div>
            )}
            {data && (
                <div className="bg-green-500 text-white px-6 py-4 w-full shadow-lg text-center text-lg font-semibold">
                    Consulta exitosa: {data.hello}
                </div>
            )}
        </div>
    )
}

export default Demo
