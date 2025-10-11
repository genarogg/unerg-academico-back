'use client'
import React, { useState, useEffect } from 'react'
import { useLazyQuery } from '@apollo/client/react'
import { OBTENER_ESTADOS } from '@/query' // asegúrate de tener la query exportada

interface GetEstadosPaisProps { }

const GetEstadosPais: React.FC<GetEstadosPaisProps> = () => {
    const [token, setToken] = useState('')
    const [response, setResponse] = useState<any>(null)

    const [getEstados, { loading, error }] = useLazyQuery(OBTENER_ESTADOS)

    // Ejecuta automáticamente la consulta si hay token guardado
    useEffect(() => {
        const storedToken = localStorage.getItem('token')
        if (storedToken) {
            setToken(storedToken)
            fetchEstados(storedToken)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const fetchEstados = async (tokenValue: string) => {
        try {
            const { data }: any = await getEstados({
                variables: {
                    token: tokenValue,
                },
            })

            console.log('Respuesta completa:', data)
            if (data?.obtenerEstados) {
                setResponse(data.obtenerEstados)
            } else {
                setResponse(null)
            }
        } catch (err) {
            console.error('Error ejecutando query:', err)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!token) return
        localStorage.setItem('token', token)
        await fetchEstados(token)
    }

    return (
        <div className="flex gap-8 p-6">
            {/* Formulario */}
            <form
                onSubmit={handleSubmit}
                className="w-1/2 p-6 border rounded-lg shadow-md bg-white flex flex-col gap-4"
            >
                <h2 className="text-xl font-bold mb-4 text-gray-800">
                    Consultar Estados del País
                </h2>

                <div>
                    <label className="block mb-1 font-medium text-gray-700">Token:</label>
                    <input
                        type="text"
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        required
                        className="w-full border rounded px-3 py-2 focus:ring focus:ring-green-200"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                >
                    {loading ? 'Consultando...' : 'Obtener Estados'}
                </button>

                {error && (
                    <p className="text-red-500 text-sm mt-2">Error: {error.message}</p>
                )}
            </form>

            {/* Resultado */}
            <div className="w-1/2 p-6 border rounded-lg shadow-md bg-gray-50">
                <h2 className="text-xl font-bold mb-4 text-gray-800">
                    Respuesta JSON
                </h2>

                {response ? (
                    <pre className="bg-white p-4 rounded shadow-inner text-sm overflow-auto max-h-[600px] text-gray-800">
                        {JSON.stringify(response, null, 2)}
                    </pre>
                ) : (
                    <p className="text-gray-500">
                        Aquí aparecerá la respuesta completa del servidor...
                    </p>
                )}
            </div>
        </div>
    )
}

export default GetEstadosPais
