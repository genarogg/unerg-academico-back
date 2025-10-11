'use client';
import React, { useState, useEffect } from 'react';
import { useMutation, useLazyQuery } from '@apollo/client/react';
import { ACTUALIZAR_DATOS_PERSONALES, OBTENER_DATOS_PERSONALES } from '@/query';

interface ActualizarDatosPersonalesProps { }

const ActualizarDatosPersonales: React.FC<ActualizarDatosPersonalesProps> = () => {
    const [token, setToken] = useState('');
    const [formData, setFormData] = useState({
        primerNombre: '',
        segundoNombre: '',
        tercerNombre: '',
        primerApellido: '',
        segundoApellido: '',
        sexo: '',
        fechaNacimiento: '',
        numeroCedula: '',
        numeroBancario: '',
        telefono: '',
        zonaUrbanizacionId: '',
        calle: '',
        numeroCasa: ''
    });
    const [response, setResponse] = useState<any>(null);

    // Mutation para actualizar
    const [actualizarDatos, { loading: loadingMutation, error: errorMutation }] = useMutation(ACTUALIZAR_DATOS_PERSONALES);

    // Query para obtener datos actuales
    const [getDatosPersonales, { loading: loadingQuery }] = useLazyQuery(OBTENER_DATOS_PERSONALES);

    // Cargar token y datos actuales
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
            cargarDatosActuales(storedToken);
        }
    }, []);

    const cargarDatosActuales = async (tokenValue: string) => {
        try {
            const { data }: any = await getDatosPersonales({
                variables: { token: tokenValue }
            });

            if (data?.obtenerDatosPersonales?.data) {
                const datos = data.obtenerDatosPersonales.data;
                setFormData({
                    primerNombre: datos.primerNombre || '',
                    segundoNombre: datos.segundoNombre || '',
                    tercerNombre: datos.tercerNombre || '',
                    primerApellido: datos.primerApellido || '',
                    segundoApellido: datos.segundoApellido || '',
                    sexo: datos.sexo || '',
                    fechaNacimiento: datos.fechaNacimiento ? datos.fechaNacimiento.split('T')[0] : '',
                    numeroCedula: datos.numeroCedula || '',
                    numeroBancario: datos.numeroBancario || '',
                    telefono: datos.telefono || '',
                    zonaUrbanizacionId: datos.direccion?.zonaUrbanizacion?.id?.toString() || '',
                    calle: datos.direccion?.calle || '',
                    numeroCasa: datos.direccion?.numeroCasa || ''
                });
            }
        } catch (err) {
            console.error('Error cargando datos:', err);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;

        try {
            localStorage.setItem('token', token);

            // Preparar variables, enviando solo los campos que tienen valor
            const variables: any = { token };

            if (formData.primerNombre) variables.primerNombre = formData.primerNombre;
            if (formData.segundoNombre) variables.segundoNombre = formData.segundoNombre;
            if (formData.tercerNombre) variables.tercerNombre = formData.tercerNombre;
            if (formData.primerApellido) variables.primerApellido = formData.primerApellido;
            if (formData.segundoApellido) variables.segundoApellido = formData.segundoApellido;
            if (formData.sexo) variables.sexo = formData.sexo;
            if (formData.fechaNacimiento) variables.fechaNacimiento = formData.fechaNacimiento;
            if (formData.numeroCedula) variables.numeroCedula = parseInt(formData.numeroCedula);
            if (formData.numeroBancario) variables.numeroBancario = formData.numeroBancario;
            if (formData.telefono) variables.telefono = formData.telefono;
            if (formData.zonaUrbanizacionId) variables.zonaUrbanizacionId = parseInt(formData.zonaUrbanizacionId);
            if (formData.calle) variables.calle = formData.calle;
            if (formData.numeroCasa) variables.numeroCasa = parseInt(formData.numeroCasa);

            const { data } = await actualizarDatos({ variables });

            if (data?.actualizarDatosPersonales) {
                setResponse(data.actualizarDatosPersonales);
            }
        } catch (err) {
            console.error('Error actualizando datos:', err);
        }
    };

    return (
        <div className="flex gap-8 p-6">
            {/* Formulario */}
            <form
                onSubmit={handleSubmit}
                className="w-1/2 p-6 border rounded-lg shadow-md bg-white flex flex-col gap-4 overflow-y-auto max-h-[calc(100vh-3rem)]"
            >
                <h2 className="text-xl font-bold mb-4 text-gray-800">
                    Actualizar Datos Personales
                </h2>

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

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-1 font-medium text-gray-700">Primer Nombre:</label>
                        <input
                            type="text"
                            name="primerNombre"
                            value={formData.primerNombre}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2 focus:ring focus:ring-blue-200"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium text-gray-700">Segundo Nombre:</label>
                        <input
                            type="text"
                            name="segundoNombre"
                            value={formData.segundoNombre}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2 focus:ring focus:ring-blue-200"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium text-gray-700">Tercer Nombre:</label>
                        <input
                            type="text"
                            name="tercerNombre"
                            value={formData.tercerNombre}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2 focus:ring focus:ring-blue-200"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium text-gray-700">Primer Apellido:</label>
                        <input
                            type="text"
                            name="primerApellido"
                            value={formData.primerApellido}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2 focus:ring focus:ring-blue-200"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium text-gray-700">Segundo Apellido:</label>
                        <input
                            type="text"
                            name="segundoApellido"
                            value={formData.segundoApellido}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2 focus:ring focus:ring-blue-200"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium text-gray-700">Sexo:</label>
                        <select
                            name="sexo"
                            value={formData.sexo}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2 focus:ring focus:ring-blue-200"
                        >
                            <option value="">Seleccionar...</option>
                            <option value="MASCULINO">Masculino</option>
                            <option value="FEMENINO">Femenino</option>
                        </select>
                    </div>

                    <div>
                        <label className="block mb-1 font-medium text-gray-700">Fecha de Nacimiento:</label>
                        <input
                            type="date"
                            name="fechaNacimiento"
                            value={formData.fechaNacimiento}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2 focus:ring focus:ring-blue-200"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium text-gray-700">Número de Cédula:</label>
                        <input
                            type="text"
                            name="numeroCedula"
                            value={formData.numeroCedula}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2 focus:ring focus:ring-blue-200"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium text-gray-700">Número Bancario:</label>
                        <input
                            type="text"
                            name="numeroBancario"
                            value={formData.numeroBancario}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2 focus:ring focus:ring-blue-200"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium text-gray-700">Teléfono:</label>
                        <input
                            type="tel"
                            name="telefono"
                            value={formData.telefono}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2 focus:ring focus:ring-blue-200"
                        />
                    </div>
                </div>

                <h3 className="text-lg font-semibold mt-4 text-gray-800">Dirección</h3>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-1 font-medium text-gray-700">Calle:</label>
                        <input
                            type="text"
                            name="calle"
                            value={formData.calle}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2 focus:ring focus:ring-blue-200"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium text-gray-700">Número de Casa:</label>
                        <input
                            type="text"
                            name="numeroCasa"
                            value={formData.numeroCasa}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2 focus:ring focus:ring-blue-200"
                        />
                    </div>

                    <div className="col-span-2">
                        <label className="block mb-1 font-medium text-gray-700">ID Zona/Urbanización:</label>
                        <input
                            type="number"
                            name="zonaUrbanizacionId"
                            value={formData.zonaUrbanizacionId}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2 focus:ring focus:ring-blue-200"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loadingMutation || loadingQuery}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition mt-4"
                >
                    {loadingMutation ? 'Actualizando...' : 'Actualizar Datos'}
                </button>

                {errorMutation && (
                    <p className="text-red-500 mt-2 text-sm">
                        Error: {errorMutation.message}
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
                    <p className="text-gray-500">Aquí aparecerá la respuesta del servidor...</p>
                )}
            </div>
        </div>
    );
};

export default ActualizarDatosPersonales;