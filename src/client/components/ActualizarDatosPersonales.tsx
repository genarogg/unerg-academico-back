'use client'
import React, { useState, useEffect } from 'react'
import { useLazyQuery, useMutation } from '@apollo/client/react'
import { OBTENER_DATOS_PERSONALES, ACTUALIZAR_DATOS_PERSONALES } from '@/query'

interface ActualizarDatosPersonalesProps { }

const ActualizarDatosPersonales: React.FC<ActualizarDatosPersonalesProps> = () => {
    const [token, setToken] = useState('')
    const [response, setResponse] = useState<any>(null)

    // Campos de datos personales
    const [primerNombre, setPrimerNombre] = useState('')
    const [segundoNombre, setSegundoNombre] = useState('')
    const [tercerNombre, setTercerNombre] = useState('')
    const [primerApellido, setPrimerApellido] = useState('')
    const [segundoApellido, setSegundoApellido] = useState('')
    const [sexo, setSexo] = useState<'MUJER' | 'HOMBRE'>('MUJER')
    const [fechaNacimiento, setFechaNacimiento] = useState('')
    const [numeroCedula, setNumeroCedula] = useState<number | null>(null)
    const [numeroBancario, setNumeroBancario] = useState('')
    const [telefono, setTelefono] = useState('')
    const [calle, setCalle] = useState('')
    const [numeroCasa, setNumeroCasa] = useState<number | null>(null)
    const [zonaUrbanizacionId, setZonaUrbanizacionId] = useState<number | null>(null)

    const [getDatosPersonales, { data: datosData }] = useLazyQuery(OBTENER_DATOS_PERSONALES)
    const [actualizarDatos, { loading, error }] = useMutation(ACTUALIZAR_DATOS_PERSONALES, {
        onCompleted: (data: any) => setResponse(data.actualizarDatosPersonales),
    })

    useEffect(() => {
        const storedToken = localStorage.getItem('token')
        if (storedToken) {
            setToken(storedToken)
            getDatosPersonales({ variables: { token: storedToken } })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Llenar los inputs con los datos actuales
    useEffect(() => {
        if (!datosData?.obtenerDatosPersonales?.data) return
        const d = datosData.obtenerDatosPersonales.data
        setPrimerNombre(d.primerNombre || '')
        setSegundoNombre(d.segundoNombre || '')
        setTercerNombre(d.tercerNombre || '')
        setPrimerApellido(d.primerApellido || '')
        setSegundoApellido(d.segundoApellido || '')
        setSexo(d.sexo || 'M')
        setFechaNacimiento(d.fechaNacimiento || '')
        setNumeroCedula(d.numeroCedula || null)
        setNumeroBancario(d.numeroBancario || '')
        setTelefono(d.telefono || '')
        setCalle(d.direccion?.calle || '')
        setNumeroCasa(d.direccion?.numeroCasa || null)
        setZonaUrbanizacionId(d.direccion?.zonaUrbanizacion?.id || null)
    }, [datosData])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!token) return
        localStorage.setItem('token', token)

        await actualizarDatos({
            variables: {
                token,
                primerNombre,
                segundoNombre,
                tercerNombre,
                primerApellido,
                segundoApellido,
                sexo,
                fechaNacimiento,
                numeroCedula,
                numeroBancario,
                telefono,
                calle,
                numeroCasa,
                zonaUrbanizacionId,
            },
        })
    }

    return (
        <div className="flex gap-8 p-6">
            <form
                onSubmit={handleSubmit}
                className="w-1/2 p-6 border rounded-lg shadow-md bg-white flex flex-col gap-4"
            >
                <h2 className="text-xl font-bold mb-4">Actualizar Datos Personales</h2>

                <div>
                    <label className="block mb-1 font-medium">Token:</label>
                    <input
                        type="text"
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        required
                        className="w-full border rounded px-3 py-2"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">Primer Nombre:</label>
                    <input
                        type="text"
                        value={primerNombre}
                        onChange={(e) => setPrimerNombre(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">Segundo Nombre:</label>
                    <input
                        type="text"
                        value={segundoNombre}
                        onChange={(e) => setSegundoNombre(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">Tercer Nombre:</label>
                    <input
                        type="text"
                        value={tercerNombre}
                        onChange={(e) => setTercerNombre(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">Primer Apellido:</label>
                    <input
                        type="text"
                        value={primerApellido}
                        onChange={(e) => setPrimerApellido(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">Segundo Apellido:</label>
                    <input
                        type="text"
                        value={segundoApellido}
                        onChange={(e) => setSegundoApellido(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">Sexo:</label>
                    <select
                        value={sexo}
                        onChange={(e: any) => setSexo(e.target.value as 'MUJER' | 'HOMBRE')}
                        className="w-full border rounded px-3 py-2"
                    >
                        <option value="M">Masculino</option>
                        <option value="F">Femenino</option>
                    </select>
                </div>

                <div>
                    <label className="block mb-1 font-medium">Fecha de Nacimiento:</label>
                    <input
                        type="date"
                        value={fechaNacimiento}
                        onChange={(e) => setFechaNacimiento(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">Número de Cédula:</label>
                    <input
                        type="number"
                        value={numeroCedula ?? ''}
                        onChange={(e) => setNumeroCedula(Number(e.target.value))}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">Número Bancario:</label>
                    <input
                        type="text"
                        value={numeroBancario}
                        onChange={(e) => setNumeroBancario(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">Teléfono:</label>
                    <input
                        type="text"
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">Calle:</label>
                    <input
                        type="text"
                        value={calle}
                        onChange={(e) => setCalle(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">Número de Casa:</label>
                    <input
                        type="number"
                        value={numeroCasa ?? ''}
                        onChange={(e) => setNumeroCasa(Number(e.target.value))}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">Zona Urbanización ID:</label>
                    <input
                        type="number"
                        value={zonaUrbanizacionId ?? ''}
                        onChange={(e) => setZonaUrbanizacionId(Number(e.target.value))}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    {loading ? 'Actualizando...' : 'Actualizar Datos'}
                </button>

                {error && <p className="text-red-500 mt-2">{error.message}</p>}
            </form>

            {/* Resultado JSON */}
            <div className="w-1/2 p-6 border rounded-lg shadow-md bg-gray-50">
                <h2 className="text-xl font-bold mb-4">Respuesta JSON</h2>
                {response ? (
                    <pre className="bg-white p-4 rounded overflow-auto max-h-[600px]">
                        {JSON.stringify(response, null, 2)}
                    </pre>
                ) : (
                    <p className="text-gray-500">Aquí aparecerá la respuesta del servidor...</p>
                )}
            </div>
        </div>
    )
}

export default ActualizarDatosPersonales
