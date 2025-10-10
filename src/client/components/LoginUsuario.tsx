'use client'
import React, { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { LOGIN_USUARIO } from '@/query'; // ajusta la ruta según tu estructura

interface LoginUsuarioProps { }

const LoginUsuario: React.FC<LoginUsuarioProps> = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [captchaToken, setCaptchaToken] = useState('');
    const [response, setResponse] = useState<any>(null);

    const [loginUsuario, { loading, error }] = useMutation(LOGIN_USUARIO, {
        onCompleted: (data: any) => setResponse(data.loginUsuario),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        loginUsuario({
            variables: {
                email,
                password,
                captchaToken: captchaToken || null,
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
                <h2 className="text-xl font-bold mb-4 text-gray-800">Iniciar Sesión</h2>

                <div>
                    <label className="block mb-1 font-medium text-gray-700">Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full border rounded px-3 py-2 focus:ring focus:ring-blue-200"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium text-gray-700">Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full border rounded px-3 py-2 focus:ring focus:ring-blue-200"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium text-gray-700">
                        Captcha Token (opcional):
                    </label>
                    <input
                        type="text"
                        value={captchaToken}
                        onChange={(e) => setCaptchaToken(e.target.value)}
                        className="w-full border rounded px-3 py-2 focus:ring focus:ring-blue-200"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                    {loading ? 'Verificando...' : 'Iniciar Sesión'}
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
                    <p className="text-gray-500">Aquí aparecerá la respuesta del login...</p>
                )}
            </div>
        </div>
    );
};

export default LoginUsuario;
