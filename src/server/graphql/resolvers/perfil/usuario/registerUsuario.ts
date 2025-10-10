import {
    encriptarContrasena,
    crearBitacora,
    successResponse,
    errorResponse,
    prisma,
    verificarToken,
    generarToken,
    validarCapchat,
    hasAccess,
    notAccess
} from "@fn";
import { AccionesBitacora, Rol, Vigencia } from "@prisma/client";

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
            select: { vigencia: true },
        });

        if (!cedulaAutorizada) {
            return errorResponse({ message: "Cedula no autorizada" });
        }

        if (cedulaAutorizada.vigencia === Vigencia.INACTIVO) {
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
            const { isAuthenticated, rol: rolUser, id: usuarioId } = await verificarToken(token);

            if (!isAuthenticated) {
                return errorResponse({ message: "Token inválido o expirado" });
            }

            if (notAccess({ denegar: [DOCENTE], rolUser })) {
                return errorResponse({ message: "No tiene permisos para asignar este rol" });
            }

            if (hasAccess({ permitir: [SUPER], rolUser })) {
                // Puede asignar cualquier rol
                rolAsignado = rolaAsignado;
            }

            else if (hasAccess({ permitir: [ADMIN], rolUser })) {
                // Puede asignar ADMIN, DOCENTE o AREA

                if (hasAccess({ permitir: [ADMIN, DOCENTE, AREA], rolUser })) {
                    rolAsignado = rolaAsignado;
                }
            }

            crearBitacora({
                usuarioId,
                accion: `Registro de nuevo usuario (${rolAsignado})`,
                type: AccionesBitacora.REGISTRO_USUARIO,
            });
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

        //busca la cedula en cedulaAutorizada
        await prisma.cedulaAutorizada.update({
            where: { cedula },
            data: {
                vigencia: Vigencia.INACTIVO,
            },
        });


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

        console.log("registerUsuario: ", data)

        return successResponse({
            message: "Usuario registrado",
            data
        });

    } catch (error) {
        console.error("Error en el registro:", error);
        return errorResponse({ message: "Error al registrar usuario" });
    }
};

export default registerUsuario;
