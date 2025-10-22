import {
    crearBitacora,
    successResponse,
    errorResponse,
    prisma,
    generarToken,
    compararContrasena,
    validarCapchat
} from "@fn";

import { AccionesBitacora } from "@prisma/client";

interface LoginUsuarioArgs {
    email: string;
    password: string;
    captchaToken?: string;
}

const loginUsuario = async (_: unknown, args: LoginUsuarioArgs) => {

    const { email, password, captchaToken } = args;

    if (!email || !password) {
        return errorResponse({ message: "Email y contraseña son obligatorios" });
    }

    // Validar reCAPTCHA solo en producción
    if (captchaToken) {
        const captchaValidado = await validarCapchat(captchaToken)

        if (!captchaValidado) {

            return errorResponse({ message: 'Error al validar captcha' });
        }
    }

    try {
        const usuario = await prisma.usuario.findUnique({
            where: { email },
            include: { datosPersonales: true },
        });

        console.log(usuario)

        if (!usuario) {
            return errorResponse({ message: "Credenciales incorrectas" });
        }

        const passwordValida = await compararContrasena({
            password,
            hashedPassword: usuario.password
        });

        if (!passwordValida) {
            return errorResponse({ message: "Credenciales incorrectas" });
        }


        const token = generarToken({ id: usuario.id });

        await crearBitacora({
            usuarioId: usuario.id,
            accion: "inicio de sesión",
            type: AccionesBitacora.LOGIN
        });

        const data = {
            ...usuario,
            token,
        }

        console.log("loginUsuario: ", data)

        return successResponse({
            message: "Inicio de sesión exitoso",
            data
        });
    } catch (error) {
        console.error("Error en el login:", error);
        return errorResponse({ message: "Error al iniciar sesión" });
    }
};

export default loginUsuario;
