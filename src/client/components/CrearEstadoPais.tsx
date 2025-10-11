'use client';
import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client/react';
import { CREAR_ESTADO_PAIS } from '@/query';

interface CrearEstadoPaisProps { }

const CrearEstadoPais: React.FC<CrearEstadoPaisProps> = () => {
    const [token, setToken] = useState('');
    const [estado, setEstado] = useState('');
    const [response, setResponse] = useState<any>(null);

    const [crearEstadoPais, { loading, error }] = useMutation(CREAR_ESTADO_PAIS, {
        onCompleted: (data: any) => setResponse(data.crearEstadoPais),
    });

    // ✅ Buscar token en localStorage al montar el componente
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        crearEstadoPais({
            variables: {
                token,
                estado,
            },
        });
    };

    return (
        <div className="flex gap-8 p-6">
            {/* Formulario */}
            <form
                onSubmit={handleSubmit}
                className="w-1/2 p-6 border rounded-lg shadow-md bg-white flex flex-col gap-4"
            >
                <h2 className="text-xl font-bold mb-4">Crear Estado País</h2>

                <div>
                    <label className="block mb-1 font-medium">Token:</label>
                    <input
                        type="text"
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        placeholder="Token de sesión"
                        className="w-full border rounded px-3 py-2"
                    />
                    {!token && (
                        <p className="text-sm text-yellow-600 mt-1">
                            ⚠️ No se encontró token en el almacenamiento local.
                        </p>
                    )}
                </div>

                <div>
                    <label className="block mb-1 font-medium">Estado:</label>
                    <input
                        type="text"
                        value={estado}
                        onChange={(e) => setEstado(e.target.value)}
                        required
                        placeholder="Ejemplo: Táchira"
                        className="w-full border rounded px-3 py-2"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading || !token}
                    className={`px-4 py-2 rounded text-white transition ${
                        loading || !token
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-green-600 hover:bg-green-700'
                    }`}
                >
                    {loading ? 'Creando...' : 'Crear Estado'}
                </button>

                {error && (
                    <p className="text-red-500 mt-2">
                        Error: {error.message}
                    </p>
                )}
            </form>

            {/* Resultado */}
            <div className="w-1/2 p-6 border rounded-lg shadow-md bg-gray-50">
                <h2 className="text-xl font-bold mb-4">Respuesta</h2>
                {response ? (
                    <pre className="bg-white p-4 rounded overflow-auto text-sm">
                        {JSON.stringify(response, null, 2)}
                    </pre>
                ) : (
                    <p className="text-gray-500">
                        Aquí aparecerá la respuesta de la query...
                    </p>
                )}
            </div>
        </div>
    );
};

export default CrearEstadoPais;
