'use client'
import React, { useState, useEffect } from 'react';
import { useLazyQuery } from '@apollo/client/react';
import { GET_USUARIO } from '@/query'; // ajusta la ruta según tu estructura

interface GetUsuarioProps { }

const GetUsuario: React.FC<GetUsuarioProps> = () => {
    const [token, setToken] = useState('');
    const [filtro, setFiltro] = useState(''); // 👈 nuevo estado para filtro
    const [response, setResponse] = useState<any>(null);

    const [getUsuario, { loading, error }] = useLazyQuery(GET_USUARIO);

    // Al montar el componente, buscar token en localStorage
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
            // Ejecutar la query automáticamente si hay token
            getUsuario({ variables: { token: storedToken } })
                .then(({ data }: any) => setResponse(data.getUsuario))
                .catch(console.error);
        }
    }, [getUsuario]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;

        // Guardar el token en localStorage
        localStorage.setItem('token', token);

        try {
            const { data }: any = await getUsuario({
                variables: { token, filtro: filtro || undefined } // 👈 pasar filtro si existe
            });
            setResponse(data.getUsuario);
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

                {/* Input Token */}
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

                {/* Input Filtro */}
                <div>
                    <label className="block mb-1 font-medium text-gray-700">
                        Filtro (email y cédula):
                    </label>
                    <input
                        type="text"
                        value={filtro}
                        onChange={(e) => setFiltro(e.target.value)}
                        placeholder="Ingresa email o número de cédula"
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
