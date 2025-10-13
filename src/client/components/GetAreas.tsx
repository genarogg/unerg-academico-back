'use client';
import React, { useEffect, useState } from 'react';
import { useLazyQuery } from '@apollo/client/react';
import { GET_AREAS } from '@/query';

const GetAreas: React.FC = () => {
    const [token, setToken] = useState('');
    const [campusId, setCampusId] = useState<number | undefined>(undefined);
    const [response, setResponse] = useState<any>(null);

    const [fetchAreas, { loading, error }] = useLazyQuery(GET_AREAS);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) setToken(storedToken);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;

        try {
            const { data }: any = await fetchAreas({
                variables: {
                    token,
                    campusId: campusId ? Number(campusId) : undefined,
                },
            });

            console.log('Respuesta completa:', data);
            if (data?.obtenerAreas) {
                setResponse(data.obtenerAreas);
            } else {
                setResponse(null);
            }
        } catch (err) {
            console.error('Error ejecutando query:', err);
        }
    };

    return (
        <div className="flex gap-8 p-6">
            {/* Formulario */}
            <form
                onSubmit={handleSubmit}
                className="w-1/2 p-6 border rounded-lg shadow-md bg-white flex flex-col gap-4"
            >
                <h2 className="text-xl font-bold mb-4 text-gray-800">Consultar Áreas</h2>

                <div>
                    <label className="block mb-1 font-medium text-gray-700">Token:</label>
                    <input
                        type="text"
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium text-gray-700">Campus ID (opcional):</label>
                    <input
                        type="number"
                        value={campusId || ''}
                        onChange={(e) => setCampusId(e.target.value ? Number(e.target.value) : undefined)}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                    {loading ? 'Consultando...' : 'Obtener Áreas'}
                </button>

                {error && <p className="text-red-500 text-sm mt-2">Error: {error.message}</p>}
            </form>

            {/* Resultado */}
            <div className="w-1/2 p-6 border rounded-lg shadow-md bg-gray-50">
                <h2 className="text-xl font-bold mb-4 text-gray-800">Respuesta del servidor</h2>
                {response ? (
                    <pre className="bg-white p-4 rounded shadow-inner text-sm overflow-auto max-h-[600px] text-gray-800">
                        {JSON.stringify(response, null, 2)}
                    </pre>
                ) : (
                    <p className="text-gray-500">Aquí aparecerá la respuesta...</p>
                )}
            </div>
        </div>
    );
};

export default GetAreas;
