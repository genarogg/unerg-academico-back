'use client'
import React, { useEffect, useState } from 'react';

interface TokenManagerProps {
    storageKey?: string; // Clave usada en localStorage (por defecto 'token')
}

const TokenManager: React.FC<TokenManagerProps> = ({ storageKey = 'token' }) => {
    const [token, setToken] = useState('');
    const [isLoaded, setIsLoaded] = useState(false);

    // ✅ Cargar token desde localStorage al montar el componente
    useEffect(() => {
        try {
            const savedToken = localStorage.getItem(storageKey);
            if (savedToken) {
                setToken(savedToken);
                console.log('🔑 Token cargado desde localStorage');
            } else {
                console.log('⚠️ No hay token guardado');
            }
            setIsLoaded(true);
        } catch (error) {
            console.error('Error al cargar token desde localStorage:', error);
        }
    }, [storageKey]);

    // ✅ Guardar token automáticamente cuando cambia
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setToken(value);
        localStorage.setItem(storageKey, value);
    };

    // 📋 Copiar token al portapapeles
    const handleCopy = async () => {
        if (token) {
            await navigator.clipboard.writeText(token);
            
        }
    };

    // 📥 Pegar token desde portapapeles
    const handlePaste = async () => {
        const text = await navigator.clipboard.readText();
        setToken(text);
        localStorage.setItem(storageKey, text);
    };

    // 🗑️ Limpiar token del input y del localStorage
    const handleClear = () => {
        setToken('');
        localStorage.removeItem(storageKey);
    };

    // Mientras carga el token del storage, evita flicker visual
    if (!isLoaded) return null;

    return (
        <div className="p-6 border rounded-lg shadow-md bg-white flex flex-col gap-4 w-full max-w-2xl mx-auto">
            <h2 className="text-lg font-semibold text-gray-800 text-center">
                Administrar Token
            </h2>

            <div className="flex gap-3 flex-wrap">
                <input
                    type="text"
                    value={token}
                    onChange={handleChange}
                    placeholder="Ingresa o pega tu token aquí..."
                    className="flex-1 border rounded px-3 py-2 focus:ring focus:ring-blue-200"
                />

                <button
                    type="button"
                    onClick={handlePaste}
                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
                >
                    Pegar
                </button>

                <button
                    type="button"
                    onClick={handleCopy}
                    disabled={!token}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition disabled:opacity-50"
                >
                    Copiar
                </button>

                <button
                    type="button"
                    onClick={handleClear}
                    disabled={!token}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition disabled:opacity-50"
                >
                    Limpiar
                </button>
            </div>

            {token ? (
                <p className="text-sm text-gray-600 break-all">
                    <span className="font-semibold">Token cargado:</span> {token}
                </p>
            ) : (
                <p className="text-sm text-gray-500 text-center italic">
                    No hay token guardado en el navegador.
                </p>
            )}
        </div>
    );
};

export default TokenManager;
