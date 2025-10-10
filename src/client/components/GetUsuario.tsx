'use client'
import React, { useState } from 'react';
import { useLazyQuery } from '@apollo/client/react';
import { GET_USUARIO } from '@/query'; // ajusta la ruta según tu estructura

interface GetUsuarioProps { }

const GetUsuario: React.FC<GetUsuarioProps> = () => {
    const [token, setToken] = useState('');
    const [response, setResponse] = useState<any>(null);

    const [getUsuario, { loading, error }] = useLazyQuery(GET_USUARIO);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;

        try {
            const { data } = await getUsuario({
                variables: { token },
            });
            setResponse(data.getUsuario); // aquí manejas la respuesta
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="flex gap-8 p-6">
            {/* Formulario */}
            <form
                onSubmit={handleSubmit}
                className="w-1/2 p-6 border rounded-lg shadow-md bg-white flex flex-col gap-4"
            >
                <h2 className="text-xl font-bold mb-4 text-gray-800">Consultar Usuario</h2>

                <div>
                    <label className="block mb-1 font-medium text-gray-700">Token:</label>
                    <input
                        type="text"
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        required
                        className="w-full border rounded px-3 py-2 focus:ring focus:ring-blue-200"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                    {loading ? 'Consultando...' : 'Obtener Usuario'}
                </button>

                {error && (
                    <p className="text-red-500 text-sm mt-2">Error: {error.message}</p>
                )}
            </form>

            {/* Resultado en formato JSON */}
            <div className="w-1/2 p-6 border rounded-lg shadow-md bg-gray-50">
                <h2 className="text-xl font-bold mb-4 text-gray-800">Respuesta</h2>
                {response ? (
                    <pre className="bg-white p-4 rounded shadow-inner text-sm overflow-auto max-h-[500px] text-gray-800">
                        {JSON.stringify(response, null, 2)}
                    </pre>
                ) : (
                    <p className="text-gray-500">Aquí aparecerá la información del usuario...</p>
                )}
            </div>
        </div>
    );
};

export default GetUsuario;
