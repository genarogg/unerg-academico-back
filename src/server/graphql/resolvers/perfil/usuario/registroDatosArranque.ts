import {
    successResponse,
    errorResponse,
    prisma,
    verificarToken,
    crearBitacora,
} from "@fn";
import { AccionesBitacora, EstatusDocumento, Sex } from "@prisma/client";
import { valhallaSimpleUpload } from "valhalla-cloud";

interface registroDatosArranqueArgs {
    token: string;
    datosPersonales: {
        primerNombre: string;
        segundoNombre: string;
        tercerNombre?: string;
        primerApellido: string;
        segundoApellido: string;
        numeroCedula: string;
        numeroBancario: string;
        telefono: string;
        fechaNacimiento: string;
        sexo: Sex;
        direccion: {
            estadoId: string;
            zonaId: string;
            calle: string;
            numeroCasa: string;
            codigoPostal: number;
        };
        expediente: {
            documentos: {
                tipoDocumento: string;
                archivo: string;
            }[];
        };
    };
}

const registroDatosArranque = async (_: unknown, args: registroDatosArranqueArgs) => {
    const { token, datosPersonales } = args;

    if (!token) return errorResponse({ message: "Token es requerido" });

    try {
        const { isAuthenticated, id: usuarioId } = await verificarToken(token);
        if (!isAuthenticated) return errorResponse({ message: "Token inválido o expirado" });

        const usuario = await prisma.usuario.findUnique({ where: { id: usuarioId } });
        if (!usuario) return errorResponse({ message: "Usuario no encontrado" });

        const {
            primerNombre,
            segundoNombre,
            tercerNombre,
            primerApellido,
            segundoApellido,
            numeroCedula,
            numeroBancario,
            telefono,
            fechaNacimiento,
            sexo,
            direccion,
            expediente
        } = datosPersonales;

        if (!direccion) return errorResponse({ message: "Dirección es requerida" });

        const documentos = expediente.documentos || [];
        const docAvatar = documentos.find(doc => doc.tipoDocumento === "avatar");
        const docCedula = documentos.find(doc => doc.tipoDocumento === "img-cedula");

        if (!docAvatar || !docCedula) return errorResponse({ message: "Faltan documentos" });

        const serverPath = `${numeroCedula}-${primerNombre}-${primerApellido}`;

        // 🔒 Ejecutar toda la lógica dentro de una transacción
        const resultado = await prisma.$transaction(async (tx) => {
            // 1️⃣ Crear dirección
            const zona = await tx.zonaUrbanizacion.findUnique({ where: { id: Number(direccion.zonaId) } });
            if (!zona) throw new Error("Zona o estado no válidos");

            const nuevaDireccion = await tx.direccion.create({
                data: {
                    zonaUrbanizacionId: Number(direccion.zonaId),
                    calle: direccion.calle,
                    numeroCasa: Number(direccion.numeroCasa)
                }
            });

            // 2️⃣ Actualizar datos personales
            const datos = await tx.datosPersonales.update({
                where: { usuarioId },
                data: {
                    primerNombre,
                    segundoNombre,
                    tercerNombre,
                    primerApellido,
                    segundoApellido,
                    numeroCedula: Number(numeroCedula),
                    numeroBancario,
                    telefono,
                    fechaNacimiento,
                    sexo,
                    direccionId: nuevaDireccion.id
                }
            });

            // 3️⃣ Obtener expediente existente
            const expedienteExistente = await tx.expediente.findUnique({ where: { datosPersonalesId: datos.id } });
            if (!expedienteExistente) throw new Error("No existe un expediente asociado a estos datos personales");

            // 4️⃣ Subir documentos y guardar en DB
            const documentosSubidos = [
                { doc: docAvatar, nombre: "avatar" },
                { doc: docCedula, nombre: "img-cedula" }
            ];

            for (const { doc, nombre } of documentosSubidos) {
                const tipo = await tx.tipoDocumento.findFirst({ where: { nombre } });
                if (!tipo) throw new Error(`Tipo de documento no válido: ${nombre}`);

                const archivoSubido = await valhallaSimpleUpload({
                    base64Data: doc.archivo,
                    name: nombre,
                    serverPath
                });

                await tx.documento.create({
                    data: {
                        tipoDocumentoId: tipo.id,
                        expedienteId: expedienteExistente.id,
                        url: (archivoSubido as any).data.id.toString(),
                        estatus: EstatusDocumento.PENDIENTE
                    }
                });
            }

            return { datos, expediente: expedienteExistente };
        });

        // 5️⃣ Crear bitácora
        await crearBitacora({
            usuarioId,
            accion: "Registro de datos personales",
            type: AccionesBitacora.REGISTRO_DATOS_PERSONALES
        });

        // 6️⃣ Respuesta final
        return successResponse({
            message: "Datos personales guardados correctamente",
            data: {
                ...usuario,
                datosPersonales: {
                    ...resultado.datos,
                    expediente: {
                        ...resultado.expediente
                    }
                }
            }
        });

    } catch (error) {
        console.error("❌ Error en registroDatosArranque:", error);
        return errorResponse({ message: "Error al guardar los datos personales" });
    }
};

export default registroDatosArranque;
