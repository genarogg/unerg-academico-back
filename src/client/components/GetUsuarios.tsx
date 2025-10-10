'use client'
import React, { useState, useEffect } from 'react';
import { useLazyQuery } from '@apollo/client/react';
import { GET_USUARIOS } from '@/query'; // ajusta la ruta según tu estructura

interface GetUsuariosProps { }

const GetUsuarios: React.FC<GetUsuariosProps> = () => {
  const [token, setToken] = useState('');
  const [filtro, setFiltro] = useState('');
  const [response, setResponse] = useState<any[]>([]);

  const [getUsuarios, { loading, error }] = useLazyQuery(GET_USUARIOS);

  // Ejecuta automáticamente la consulta si hay token guardado
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      getUsuarios({ variables: { token: storedToken, filtro: '' } })
        .then(({ data }: any) => {
          console.log('Respuesta completa:', data);
          if (data?.getUsuarios?.data) {
            setResponse(data.getUsuarios.data);
          } else {
            console.warn('No se encontró la propiedad data dentro de getUsuarios');
          }
        })
        .catch((err) => console.error('Error ejecutando query:', err));
    }
  }, [getUsuarios]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    localStorage.setItem('token', token);

    try {
      const { data }: any = await getUsuarios({ variables: { token, filtro } });
      console.log('Respuesta manual:', data);
      if (data?.getUsuarios?.data) {
        setResponse(data.getUsuarios.data);
      } else {
        setResponse([]);
        console.warn('No se encontró la propiedad data dentro de getUsuarios');
      }
    } catch (err) {
      console.error('Error en handleSubmit:', err);
    }
  };

  return (
    <div className="flex gap-8 p-6">
      {/* Formulario */}
      <form
        onSubmit={handleSubmit}
        className="w-1/2 p-6 border rounded-lg shadow-md bg-white flex flex-col gap-4"
      >
        <h2 className="text-xl font-bold mb-4 text-gray-800">Consultar Usuarios</h2>

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

        <div>
          <label className="block mb-1 font-medium text-gray-700">Filtro (opcional):</label>
          <input
            type="text"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            placeholder="Email, rol u otro"
            className="w-full border rounded px-3 py-2 focus:ring focus:ring-blue-200"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? 'Consultando...' : 'Obtener Usuarios'}
        </button>

        {error && (
          <p className="text-red-500 text-sm mt-2">Error: {error.message}</p>
        )}
      </form>

      {/* Resultado */}
      <div className="w-1/2 p-6 border rounded-lg shadow-md bg-gray-50">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Respuesta</h2>
        {response.length > 0 ? (
          <pre className="bg-white p-4 rounded shadow-inner text-sm overflow-auto max-h-[500px] text-gray-800">
            {JSON.stringify(response, null, 2)}
          </pre>
        ) : (
          <p className="text-gray-500">Aquí aparecerá la información de los usuarios...</p>
        )}
      </div>
    </div>
  );
};

export default GetUsuarios;
