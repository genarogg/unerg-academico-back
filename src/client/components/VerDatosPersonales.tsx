'use client';
import React, { useState, useEffect } from 'react';
import { useLazyQuery } from '@apollo/client/react';
import { OBTENER_DATOS_PERSONALES } from '@/query';

interface VerDatosPersonalesProps { }

const VerDatosPersonales: React.FC<VerDatosPersonalesProps> = () => {
    const [token, setToken] = useState('');
    const [response, setResponse] = useState<any>(null);

    // Lazy query para obtener datos personales
    const [getDatosPersonales, { loading, error, data }] = useLazyQuery(OBTENER_DATOS_PERSONALES);

    // Actualizar response cuando data cambie
    useEffect(() => {
        if (data?.obtenerDatosPersonales) {
            setResponse(data.obtenerDatosPersonales);
        }
    }, [data]);

    // Cargar token automáticamente
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);

    const handleFetch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;
        localStorage.setItem('token', token);
        getDatosPersonales({ variables: { token } });
    };

    const datos = response?.data;

    return (
        <div className="flex gap-8 p-6">
            {/* Formulario */}
            <form
                onSubmit={handleFetch}
                className="w-1/2 p-6 border rounded-lg shadow-md bg-white flex flex-col gap-4"
            >
                <h2 className="text-xl font-bold mb-4 text-gray-800">
                    Consultar Datos Personales
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
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                    {loading ? 'Consultando...' : 'Consultar'}
                </button>

                {error && (
                    <p className="text-red-500 mt-2 text-sm">
                        Error: {error.message}
                    </p>
                )}
            </form>

            {/* Resultado */}
            <div className="w-1/2 p-6 border rounded-lg shadow-md bg-gray-50">
                <h2 className="text-xl font-bold mb-4 text-gray-800">Respuesta completa</h2>
                {response ? (
                    <pre className="bg-white p-4 rounded shadow-inner text-sm overflow-auto max-h-[600px] text-gray-800">
                        {JSON.stringify(response, null, 2)}
                    </pre>
                ) : (
                    <p className="text-gray-500">Aquí aparecerá la respuesta completa del servidor...</p>
                )}
            </div>
        </div>
    );
};

export default VerDatosPersonales;