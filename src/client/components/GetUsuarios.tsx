'use client'
import React, { useState, useEffect } from 'react';
import { useLazyQuery } from '@apollo/client/react';
import { GET_USUARIOS } from '@/query'; // ajusta la ruta según tu estructura

interface GetUsuariosProps { }

const GetUsuarios: React.FC<GetUsuariosProps> = () => {
  const [token, setToken] = useState('');
  const [filtro, setFiltro] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);

  const [response, setResponse] = useState<any>(null);

  const [getUsuarios, { loading, error }] = useLazyQuery(GET_USUARIOS);

  // Ejecuta automáticamente la consulta si hay token guardado
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      fetchUsuarios(storedToken, filtro, page, limit);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit]);

  const fetchUsuarios = async (
    tokenValue: string,
    filtroValue: string,
    pageValue: number,
    limitValue: number
  ) => {
    try {
      const { data }: any = await getUsuarios({
        variables: {
          token: tokenValue,
          filtro: filtroValue,
          page: pageValue,
          limit: limitValue,
        },
      });

      console.log('Respuesta completa:', data);

      if (data?.getUsuarios) {
        setResponse(data.getUsuarios); // 👈 ahora guardamos todo el objeto
      } else {
        setResponse(null);
      }
    } catch (err) {
      console.error('Error ejecutando query:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    localStorage.setItem('token', token);
    await fetchUsuarios(token, filtro, page, limit);
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

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block mb-1 font-medium text-gray-700">Página:</label>
            <input
              type="number"
              value={page}
              onChange={(e) => setPage(Number(e.target.value))}
              min={1}
              className="w-full border rounded px-3 py-2 focus:ring focus:ring-blue-200"
            />
          </div>
          <div className="flex-1">
            <label className="block mb-1 font-medium text-gray-700">Límite:</label>
            <input
              type="number"
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              min={1}
              className="w-full border rounded px-3 py-2 focus:ring focus:ring-blue-200"
            />
          </div>
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
        <h2 className="text-xl font-bold mb-4 text-gray-800">Respuesta completa</h2>
        {response ? (
          <pre className="bg-white p-4 rounded shadow-inner text-sm overflow-auto max-h-[600px] text-gray-800">
            {JSON.stringify(response, null, 2)}
          </pre>
        ) : (
          <p className="text-gray-500">Aquí aparecerá la respuesta completa del servidor...</p>
        )}
      </div>
    </div>
  );
};

export default GetUsuarios;
