'use client';
import React, { useState, useEffect } from 'react';
import { useMutation, useLazyQuery } from '@apollo/client/react';
import { CREAR_ZONA_URBANIZACION, OBTENER_ESTADOS } from '@/query';

interface CrearZonaUrbanizacionProps { }

const CrearZonaUrbanizacion: React.FC<CrearZonaUrbanizacionProps> = () => {
    const [token, setToken] = useState('');
    const [estadoPaisId, setEstadoPaisId] = useState<number | null>(null);
    const [codigoPostal, setCodigoPostal] = useState('');
    const [zona, setZona] = useState('');
    const [response, setResponse] = useState<any>(null);
    const [estados, setEstados] = useState<any[]>([]);

    // Mutación para crear la zona
    const [crearZonaUrbanizacion, { loading: creating, error: createError }] = useMutation(
        CREAR_ZONA_URBANIZACION,
        {
            onCompleted: (data: any) => setResponse(data.crearZonaUrbanizacion),
        }
    );

    // Lazy query para obtener los estados
    const [getEstados, { loading: loadingEstados, error: estadosError }] = useLazyQuery(OBTENER_ESTADOS);

    // Cargar token y obtener estados automáticamente
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
            fetchEstados(storedToken);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchEstados = async (tokenValue: string) => {
        try {
            const { data }: any = await getEstados({
                variables: { token: tokenValue },
            });
            if (data?.obtenerEstados?.data) {
                setEstados(data.obtenerEstados.data);
            }
        } catch (err) {
            console.error('Error cargando estados:', err);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token || !estadoPaisId) return;

        localStorage.setItem('token', token);

        crearZonaUrbanizacion({
            variables: {
                token,
                estadoPaisId,
                codigoPostal: parseInt(codigoPostal),
                zona,
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
                <h2 className="text-xl font-bold mb-4 text-gray-800">Crear Zona Urbanización</h2>

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

                <div>
                    <label className="block mb-1 font-medium text-gray-700">Estado País:</label>
                    <select
                        value={estadoPaisId ?? ''}
                        onChange={(e) => setEstadoPaisId(parseInt(e.target.value))}
                        required
                        className="w-full border rounded px-3 py-2 focus:ring focus:ring-green-200"
                    >
                        <option value="" disabled>
                            Seleccione un estado
                        </option>
                        {estados.map((estado) => (
                            <option key={estado.id} value={estado.id}>
                                {estado.estado}
                            </option>
                        ))}
                    </select>
                    {loadingEstados && <p className="text-gray-500 text-sm mt-1">Cargando estados...</p>}
                    {estadosError && <p className="text-red-500 text-sm mt-1">{estadosError.message}</p>}
                </div>

                <div>
                    <label className="block mb-1 font-medium text-gray-700">Código Postal:</label>
                    <input
                        type="number"
                        value={codigoPostal}
                        onChange={(e) => setCodigoPostal(e.target.value)}
                        required
                        className="w-full border rounded px-3 py-2 focus:ring focus:ring-green-200"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium text-gray-700">Zona:</label>
                    <input
                        type="text"
                        value={zona}
                        onChange={(e) => setZona(e.target.value)}
                        required
                        className="w-full border rounded px-3 py-2 focus:ring focus:ring-green-200"
                    />
                </div>

                <button
                    type="submit"
                    disabled={creating}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                >
                    {creating ? 'Creando...' : 'Crear Zona'}
                </button>

                {createError && <p className="text-red-500 mt-2">Error: {createError.message}</p>}
            </form>

            {/* Resultado */}
            <div className="w-1/2 p-6 border rounded-lg shadow-md bg-gray-50">
                <h2 className="text-xl font-bold mb-4 text-gray-800">Respuesta</h2>
                {response ? (
                    <pre className="bg-white p-4 rounded shadow-inner text-sm overflow-auto max-h-[600px] text-gray-800">
                        {JSON.stringify(response, null, 2)}
                    </pre>
                ) : (
                    <p className="text-gray-500">Aquí aparecerá la respuesta de la mutación...</p>
                )}
            </div>
        </div>
    );
};

export default CrearZonaUrbanizacion;
