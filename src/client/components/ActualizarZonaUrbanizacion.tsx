'use client'
import React, { useState, useEffect } from 'react'
import { useLazyQuery, useMutation } from '@apollo/client/react'
import { OBTENER_ZONAS_URBANIZACION, OBTENER_ESTADOS, ACTUALIZAR_ZONA_URBANIZACION } from '@/query'

interface ActualizarZonaProps { }

const ActualizarZonaUrbanizacion: React.FC<ActualizarZonaProps> = () => {
  const [token, setToken] = useState('')
  const [zonaId, setZonaId] = useState<number | null>(null)
  const [estadoPaisId, setEstadoPaisId] = useState<number | null>(null)
  const [codigoPostal, setCodigoPostal] = useState('')
  const [zonaNombre, setZonaNombre] = useState('')
  const [vigencia, setVigencia] = useState<'ACTIVO' | 'INACTIVO'>('ACTIVO')
  const [response, setResponse] = useState<any>(null)

  const [getZonas, { data: zonasData }] = useLazyQuery(OBTENER_ZONAS_URBANIZACION)
  const [getEstados, { data: estadosData }] = useLazyQuery(OBTENER_ESTADOS)
  const [actualizarZona, { loading, error }] = useMutation(ACTUALIZAR_ZONA_URBANIZACION, {
    onCompleted: (data: any) => setResponse(data.actualizarZonaUrbanizacion),
  })

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    if (storedToken) {
      setToken(storedToken)
      getZonas({ variables: { token: storedToken } })
      getEstados({ variables: { token: storedToken } })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Cuando se selecciona una zona, llenar los inputs con los valores actuales
  useEffect(() => {
    if (!zonaId || !zonasData) return
    const selected = zonasData.obtenerZonasUrbanizacion.data.find((z: any) => z.id === zonaId)
    if (selected) {
      setEstadoPaisId(selected.estadoPaisId)
      setCodigoPostal(selected.codigoPostal.toString())
      setZonaNombre(selected.zona)
      setVigencia(selected.vigencia as 'ACTIVO' | 'INACTIVO')
    }
  }, [zonaId, zonasData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token || !zonaId) return
    localStorage.setItem('token', token)

    await actualizarZona({
      variables: {
        token,
        id: zonaId,
        estadoPaisId,
        codigoPostal: parseInt(codigoPostal),
        zona: zonaNombre,
        vigencia, // siempre enviamos un valor válido
      },
    })
  }

  return (
    <div className="flex gap-8 p-6">
      <form
        onSubmit={handleSubmit}
        className="w-1/2 p-6 border rounded-lg shadow-md bg-white flex flex-col gap-4"
      >
        <h2 className="text-xl font-bold mb-4">Actualizar Zona Urbanización</h2>

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
          <label className="block mb-1 font-medium">Zona a actualizar:</label>
          <select
            value={zonaId ?? ''}
            onChange={(e) => setZonaId(Number(e.target.value))}
            required
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Selecciona una zona</option>
            {zonasData?.obtenerZonasUrbanizacion?.data?.map((z: any) => (
              <option key={z.id} value={z.id}>
                {z.zona} ({z.codigoPostal})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Estado del país:</label>
          <select
            value={estadoPaisId ?? ''}
            onChange={(e) => setEstadoPaisId(Number(e.target.value))}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Selecciona un estado</option>
            {estadosData?.obtenerEstados?.data?.map((e: any) => (
              <option key={e.id} value={e.id}>{e.estado}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Código Postal:</label>
          <input
            type="number"
            value={codigoPostal}
            onChange={(e) => setCodigoPostal(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Nombre de Zona:</label>
          <input
            type="text"
            value={zonaNombre}
            onChange={(e) => setZonaNombre(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Vigencia:</label>
          <select
            value={vigencia}
            onChange={(e) => setVigencia(e.target.value as 'ACTIVO' | 'INACTIVO')}
            className="w-full border rounded px-3 py-2"
          >
            <option value="ACTIVO">ACTIVO</option>
            <option value="INACTIVO">INACTIVO</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? 'Actualizando...' : 'Actualizar Zona'}
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

export default ActualizarZonaUrbanizacion
