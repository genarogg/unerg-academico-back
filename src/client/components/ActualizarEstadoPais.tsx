'use client'
import React, { useState, useEffect } from 'react'
import { useLazyQuery, useMutation } from '@apollo/client/react'
import { OBTENER_ESTADOS, ACTUALIZAR_ESTADO_PAIS } from '@/query'

interface Estado {
  id: number
  estado: string
  vigencia: string | boolean
}

const ActualizarEstadoPais: React.FC = () => {
  const [token, setToken] = useState('')
  const [estadoId, setEstadoId] = useState<number | null>(null)
  const [nuevoNombre, setNuevoNombre] = useState('')
  const [vigencia, setVigencia] = useState<'ACTIVO' | 'INACTIVO'>('ACTIVO')
  const [estados, setEstados] = useState<Estado[]>([])
  const [response, setResponse] = useState<any>(null)

  // Lazy query para obtener los estados
  const [getEstados] = useLazyQuery(OBTENER_ESTADOS)
  // Mutation para actualizar estado
  const [actualizarEstado, { loading: loadingActualizar, error: errorActualizar }] = useMutation(ACTUALIZAR_ESTADO_PAIS, {
    onCompleted: (data: any) => setResponse(data.actualizarEstadoPais),
  })

  // Cargar token y estados al iniciar
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
      const { data }: any = await getEstados({ variables: { token: tokenValue } })
      if (data?.obtenerEstados?.data) {
        setEstados(data.obtenerEstados.data)
      }
    } catch (err) {
      console.error('Error al obtener estados:', err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token || !estadoId) return
    localStorage.setItem('token', token)

    try {
      await actualizarEstado({
        variables: {
          token,
          id: estadoId,
          estado: nuevoNombre,
          vigencia,
        },
      })
      // Actualizar la lista de estados
      fetchEstados(token)
    } catch (err) {
      console.error('Error al actualizar estado:', err)
    }
  }

  return (
    <div className="flex gap-8 p-6">
      {/* Formulario */}
      <form
        onSubmit={handleSubmit}
        className="w-1/2 p-6 border rounded-lg shadow-md bg-white flex flex-col gap-4"
      >
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          Actualizar Estado País
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

        <div>
          <label className="block mb-1 font-medium text-gray-700">Seleccionar Estado:</label>
          <select
            value={estadoId ?? ''}
            onChange={(e) => setEstadoId(Number(e.target.value))}
            required
            className="w-full border rounded px-3 py-2 focus:ring focus:ring-green-200"
          >
            <option value="" disabled>-- Seleccione un estado --</option>
            {estados.map((estado) => (
              <option key={estado.id} value={estado.id}>
                {estado.estado} ({estado.vigencia})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">Nuevo nombre del estado:</label>
          <input
            type="text"
            value={nuevoNombre}
            onChange={(e) => setNuevoNombre(e.target.value)}
            required
            className="w-full border rounded px-3 py-2 focus:ring focus:ring-green-200"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">Vigencia:</label>
          <select
            value={vigencia}
            onChange={(e) => setVigencia(e.target.value as 'ACTIVO' | 'INACTIVO')}
            className="w-full border rounded px-3 py-2 focus:ring focus:ring-green-200"
          >
            <option value="ACTIVO">Activo</option>
            <option value="INACTIVO">Inactivo</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loadingActualizar}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          {loadingActualizar ? 'Actualizando...' : 'Actualizar Estado'}
        </button>

        {errorActualizar && (
          <p className="text-red-500 text-sm mt-2">Error: {errorActualizar.message}</p>
        )}
      </form>

      {/* Resultado */}
      <div className="w-1/2 p-6 border rounded-lg shadow-md bg-gray-50">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Respuesta JSON</h2>
        {response ? (
          <pre className="bg-white p-4 rounded shadow-inner text-sm overflow-auto max-h-[600px] text-gray-800">
            {JSON.stringify(response, null, 2)}
          </pre>
        ) : (
          <p className="text-gray-500">
            Aquí aparecerá la respuesta del servidor después de actualizar...
          </p>
        )}
      </div>
    </div>
  )
}

export default ActualizarEstadoPais
