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
    const { email, password, cedula, rol: rolaAsignado, token, captchaToken } = args;

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

        const { SUPER, ADMIN, AREA, DOCENTE, } = Rol

        let rolAsignado: Rol = DOCENTE;

        // Si hay token, verificar permisos para asignar rol
        if (token && rolaAsignado) {
            const { isAuthenticated, rol: rolUser } = await verificarToken(token);

            if (!isAuthenticated) {
                return errorResponse({ message: "Token inválido o expirado" });
            }

            if (rolUser === SUPER) {
                // Puede asignar cualquier rol
                rolAsignado = rolaAsignado;
            } else if (rolUser === ADMIN) {
                // Puede asignar ADMIN, DOCENTE o AREA
                const rolesPermitidos: Rol[] = [ADMIN, DOCENTE, AREA];
                if (rolesPermitidos.includes(rolaAsignado)) {
                    rolAsignado = rolaAsignado;
                } else {
                    return errorResponse({ message: "No tiene permisos para asignar este rol" });
                }
            } else {
                // Otros roles (AREA, DOCENTE, etc.) no pueden asignar roles
                return errorResponse({ message: "No tiene permisos para asignar roles" });
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

        crearBitacora({
            usuarioId: nuevoUsuario.id,
            accion: `Registro de nuevo usuario (${rolAsignado})`,
            type: AccionesBitacora.REGISTRO_USUARIO,
        });

        // Generar token de sesión
        const tokenGenerado = generarToken({ id: nuevoUsuario.id });

        const data = {
            ...nuevoUsuario,
            token: tokenGenerado,
        }

        return successResponse({
            message: "Usuario registrado",
            data
        });
    } catch (error) {
        console.error("Error en el registro:", error);
        return errorResponse({ message: "Error al registrar usuario" });
    } finally {
        await prisma.$disconnect();
    }
};

export default registerUsuario;
