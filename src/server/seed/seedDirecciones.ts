import { prisma } from "@fn";

// Función para generar un número aleatorio dentro de un rango
const randomInt = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

// Datos de ejemplo
const calles = ["Av. Bolívar", "Calle 23", "Av. Libertador", "Calle Central", "Calle 5"];

const agregarDirecciones = async () => {
    // Obtener todos los usuarios con DatosPersonales pero sin dirección
    const usuarios = await prisma.usuario.findMany({
        where: {
            datosPersonales: {
                isNot: null,
                direccionId: undefined, // TypeScript friendly
            },
        },
        include: {
            datosPersonales: true,
        },
    });

    // Obtener todos los estados y zonas existentes
    const estados = await prisma.estadoPais.findMany();
    const zonas = await prisma.zonaUrbanizacion.findMany();

    for (const usuario of usuarios) {
        const datosPersonales = usuario.datosPersonales;
        if (!datosPersonales) continue;

        // Filtrar zonas según el estado aleatorio
        const estado = estados[randomInt(0, estados.length - 1)];
        const zonasEstado = zonas.filter(z => z.estadoPaisId === estado.id);
        if (zonasEstado.length === 0) continue;

        const zona = zonasEstado[randomInt(0, zonasEstado.length - 1)];

        // Crear la dirección
        const direccion = await prisma.direccion.create({
            data: {
                calle: calles[randomInt(0, calles.length - 1)],
                numeroCasa: randomInt(1, 200),
                zonaUrbanizacionId: zona.id,
            },
        });

        // Actualizar DatosPersonales con la dirección creada
        await prisma.datosPersonales.update({
            where: { id: datosPersonales.id },
            data: {
                direccionId: direccion.id, // aquí ya es number, no null
            },
        });

        console.log(`Dirección agregada a ${usuario.email}`);
    }
};

export default agregarDirecciones;
