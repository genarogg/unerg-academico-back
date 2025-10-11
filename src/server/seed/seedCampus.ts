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

const seedCampus = async () => {
    // Obtenemos todas las zonas de urbanización para asignarles campus
    const zonas = await prisma.zonaUrbanizacion.findMany();

    if (zonas.length === 0) {
        console.warn("⚠️ No hay zonas de urbanización registradas. Crea algunas primero.");
        return;
    }

    for (const nombre of nombresCampus) {
        // Seleccionamos una zona aleatoria existente
        const zona = zonas[randomInt(0, zonas.length - 1)];

        // Revisamos si ya existe un campus con ese nombre y zona
        const existingCampus = await prisma.campus.findFirst({
            where: { zona_urbanizacion_id: zona.id, tipo: { in: tiposCampus } },
        });

        if (!existingCampus) {
            const tipo = tiposCampus[randomInt(0, tiposCampus.length - 1)];

            await prisma.campus.create({
                data: {
                    zona_urbanizacion_id: zona.id,
                    tipo,
                },
            });

            console.log(`✅ Campus "${nombre}" (${tipo}) creado en zona ID ${zona.id}`);
        } else {
            console.log(`⚠️ Campus ya existe en la zona ID ${zona.id}`);
        }
    }

    console.log("🌱 Seed de campus completado");
};

export default seedCampus;
