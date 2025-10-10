'use client'
import React, { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { REGISTER_USUARIO } from '@/query';
import { Rol } from '@/generated/enums';

interface RegistrarUsuarioProps { }

const roles = Object.values(Rol);

const RegistrarUsuario: React.FC<RegistrarUsuarioProps> = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [cedula, setCedula] = useState('');
    const [rol, setRol] = useState(roles[0]);
    const [token, setToken] = useState('');
    const [response, setResponse] = useState<any>(null);

    const [registerUsuario, { loading, error }] = useMutation(REGISTER_USUARIO, {
        onCompleted: (data: any) => setResponse(data.registerUsuario),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        registerUsuario({
            variables: {
                email,
                password,
                cedula: parseInt(cedula),
                rol,
                token
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
                <h2 className="text-xl font-bold mb-4">Registrar Usuario</h2>

                <div>
                    <label className="block mb-1 font-medium">Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full border rounded px-3 py-2"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full border rounded px-3 py-2"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">Cédula:</label>
                    <input
                        type="number"
                        value={cedula}
                        onChange={(e) => setCedula(e.target.value)}
                        required
                        className="w-full border rounded px-3 py-2"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">Token (opcional):</label>
                    <input
                        type="text"
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">Rol:</label>
                    <select
                        value={rol}
                        onChange={(e: any) => setRol(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                        disabled={!token}
                    >
                        {roles.map((r) => (
                            <option key={r} value={r}>
                                {r}
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                    {loading ? 'Registrando...' : 'Registrar'}
                </button>

                {error && <p className="text-red-500 mt-2">Error: {error.message}</p>}
            </form>

            {/* Resultado */}
            <div className="w-1/2 p-6 border rounded-lg shadow-md bg-gray-50">
                <h2 className="text-xl font-bold mb-4">Respuesta</h2>
                {response ? (
                    <pre className="bg-white p-4 rounded overflow-auto text-sm">
                        {JSON.stringify(response, null, 2)}
                    </pre>
                ) : (
                    <p className="text-gray-500">Aquí aparecerá la respuesta de la query...</p>
                )}
            </div>
        </div>
    );
};

export default RegistrarUsuario;
