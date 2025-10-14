import { verificarToken, successResponse, errorResponse } from "@fn";

interface validarSesionArgs {
    token: string;
}

const validarSesion = async (_: unknown, { token }: validarSesionArgs) => {
    try {

        if (!token) {
            return errorResponse({ message: 'Token no proporcionado' });
        }
        
        const usuario = await verificarToken(token);

        if (!usuario.id) {
            return errorResponse({ message: 'Token inválido o expirado' });
        }

        return successResponse({
            message: 'Token verificado exitosamente',
            data: usuario
        });

    } catch (error: any) {
        return errorResponse({ message: error.message });
    }
};

export default validarSesion;