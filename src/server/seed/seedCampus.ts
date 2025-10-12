import { prisma } from "@fn";
import { TipoCampus } from "@prisma/client";

// Función para generar un número aleatorio dentro de un rango
const randomInt = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

// Nombres de campus de ejemplo
const nombresCampus = [
    "Campus Central",
    "Núcleo Los Andes",
    "Sede Oriente",
    "Campus Metropolitano",
    "Núcleo Llanos",
    "Aula Móvil Experimental",
];

// Tipos de campus disponibles
const tiposCampus = Object.values(TipoCampus);

// Genera una fecha aleatoria entre dos años
const randomDate = (start: Date, end: Date) =>
    new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

const seedCampus = async () => {
    const zonas = await prisma.zonaUrbanizacion.findMany();

    if (zonas.length === 0) {
        console.warn("⚠️ No hay zonas de urbanización registradas. Crea algunas primero.");
        return;
    }

    for (const nombre of nombresCampus) {
        const zona = zonas[randomInt(0, zonas.length - 1)];

        const existingCampus = await prisma.campus.findFirst({
            where: { zona_urbanizacion_id: zona.id },
        });

        if (!existingCampus) {
            const tipo = tiposCampus[randomInt(0, tiposCampus.length - 1)];

            // Fecha de creación aleatoria dentro de los últimos 5 años
            const fecha_creacion = randomDate(
                new Date(new Date().setFullYear(new Date().getFullYear() - 5)),
                new Date()
            );

            // Fecha de cierre entre 1 y 3 años después de la creación
            const fecha_cierre = new Date(
                fecha_creacion.getFullYear() + randomInt(1, 3),
                fecha_creacion.getMonth(),
                fecha_creacion.getDate()
            );

            await prisma.campus.create({
                data: {
                    zona_urbanizacion_id: zona.id,
                    tipo,
                    fecha_creacion,
                    fecha_cierre,
                },
            });

            console.log(
                `✅ Campus "${nombre}" (${tipo}) creado en zona ID ${zona.id}`
            );
        } else {
            console.log(`⚠️ Campus ya existe en la zona ID ${zona.id}`);
        }
    }

    console.log("🌱 Seed de campus completado");
};

export default seedCampus;
