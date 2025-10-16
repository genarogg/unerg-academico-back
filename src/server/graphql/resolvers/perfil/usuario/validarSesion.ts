import { verificarToken, successResponse, errorResponse, prisma } from "@fn";

interface validarSesionArgs {
    token: string;
}

const validarSesion = async (_: unknown, { token }: validarSesionArgs) => {
    try {

        if (!token) {
            return errorResponse({ message: 'Token no proporcionado' });
        }

        const { isAuthenticated, id: usuarioID } = await verificarToken(token);

        if (!isAuthenticated) {
            return errorResponse({ message: 'Token inválido o expirado' });
        }

        const usuario = await prisma.usuario.findUnique({
            where: { id: usuarioID },
            include: {
                datosPersonales: true,
                redirect: true,
            }
        });

        return successResponse({
            message: 'Token verificado exitosamente',
            data: usuario
        });

    } catch (error: any) {
        return errorResponse({ message: error.message });
    }
};

export default validarSesion;