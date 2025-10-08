import {
    encriptarContrasena,
    crearBitacora,
    successResponse,
    errorResponse,
    prisma,
    verificarToken,
    generarToken,
    validarCapchat,
} from "src/server/functions";
import { AccionesBitacora, Rol, CedulaAutorizadaStatus } from "@prisma/client";

interface RegisterUsuarioArgs {
    email: string;
    password: string;
    cedula: number;
    token?: string;
    rol?: Rol;
    captchaToken?: string;
}

const registerUsuario = async (_: unknown, args: RegisterUsuarioArgs) => {
    const { email, password, cedula, rol, token, captchaToken } = args;

    // Validar campos mínimos
    if (!email || !password || !cedula) {
        return errorResponse({ message: "Faltan campos obligatorios" });
    }

    // Validar reCAPTCHA solo en producción
    if (captchaToken) {
        const captchaValidado = await validarCapchat(captchaToken)

        if (!captchaValidado) {

            return errorResponse({ message: 'Error al validar captcha' });
        }
    }

    try {

        // verificar si la cedula esta autorizada
        const cedulaAutorizada = await prisma.cedulaAutorizada.findUnique({
            where: { cedula },
            select: { estatus: true },
        });

        if (!cedulaAutorizada) {
            return errorResponse({ message: "Cedula no autorizada" });
        }

        if (cedulaAutorizada.estatus === CedulaAutorizadaStatus.INACTIVO) {
            return errorResponse({ message: "Cedula no autorizada" });
        }

        // Verificar si el correo ya existe
        const existe = await prisma.usuario.findUnique({ where: { email } });
        if (existe) {
            return errorResponse({ message: "El correo ya está registrado" });
        }

        // Rol asignado por defecto
        let rolAsignado: Rol = Rol.DOCENTE;

        // Si hay token, verificar permisos para asignar rol
        if (token) {
            const usuarioAutenticado = await verificarToken(token);

            if (!usuarioAutenticado?.id) {
                return errorResponse({ message: "Token inválido o expirado" });
            }

            if (rol) {
                const rolValido = Object.values(Rol).includes(rol);
                if (!rolValido) {
                    return errorResponse({ message: "Rol inválido" });
                }

                const esAdmin =
                    usuarioAutenticado.rol === Rol.ADMIN ||
                    usuarioAutenticado.rol === Rol.SUPER;

                if (!esAdmin) {
                    return errorResponse({
                        message: "No tienes permisos para asignar roles personalizados",
                    });
                }

                rolAsignado = rol;
            }
        }

        // Encriptar contraseña
        const hashedPassword = await encriptarContrasena({ password });

        // Crear usuario en la base de datos
        const nuevoUsuario = await prisma.usuario.create({
            data: {
                email,
                password: hashedPassword,
                rol: rolAsignado,
            },
        });

        // Registrar acción en bitácora (opcional, puede eliminarse si lo deseas)
        await crearBitacora({
            usuarioId: nuevoUsuario.id,
            accion: `Registro de nuevo usuario (${rolAsignado})`,
            type: AccionesBitacora.LOGIN,
        });

        // Generar token de sesión
        const tokenGenerado = generarToken({ id: nuevoUsuario.id });

        return successResponse({
            message: "Usuario registrado correctamente",
            data: {
                id: nuevoUsuario.id,
                email: nuevoUsuario.email,
                rol: nuevoUsuario.rol,
                token: tokenGenerado,
            },
        });
    } catch (error) {
        console.error("Error en el registro:", error);
        return errorResponse({ message: "Error al registrar usuario" });
    } finally {
        await prisma.$disconnect();
    }
};

export default registerUsuario;
