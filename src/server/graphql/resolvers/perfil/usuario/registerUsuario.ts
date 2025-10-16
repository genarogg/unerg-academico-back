
import {
    encriptarContrasena,
    crearBitacora,
    successResponse,
    errorResponse,
    prisma,
    generarToken,
    validarCapchat,
} from "@fn";
import { AccionesBitacora, Rol, Vigencia } from "@prisma/client";

interface RegisterUsuarioArgs {
    email: string;
    password: string;
    cedula: number;
    captchaToken?: string;
}

const registerUsuario = async (_: unknown, args: RegisterUsuarioArgs) => {
    const { email, password, cedula, captchaToken } = args;

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

        let rolAsignado: Rol = Rol.DOCENTE;

        // Encriptar contraseña
        const hashedPassword = await encriptarContrasena({ password });

        // Crear usuario en la base de datos
        const nuevoUsuario = await prisma.usuario.create({
            data: {
                email,
                password: hashedPassword,
                rol: rolAsignado,
                datosPersonales: {
                    create: {
                        numeroCedula: Number(cedula),
                        expediente: {
                            create: {}
                        }
                    },

                },
                redirect: {
                    create: {
                        datosPersonales: false,
                    }
                },


            },
            include: {
                datosPersonales: true,
                redirect: true,
            }
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
            token: tokenGenerado,
            ...nuevoUsuario,
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