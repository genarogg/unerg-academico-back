import { prisma } from "@fn";

// Lista de nombres de áreas académicas
const nombresAreas = [
    "Ingeniería y Tecnología",
    "Ciencias de la Salud",
    "Ciencias Sociales",
    "Educación",
    "Administración y Economía",
    "Ciencias Jurídicas y Políticas",
    "Arte y Comunicación",
];

// Función para generar un número aleatorio dentro de un rango
const randomInt = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

const seedAreas = async () => {
    // Obtener todos los campus disponibles
    const campusList = await prisma.campus.findMany();

    if (campusList.length === 0) {
        console.warn("⚠️ No hay campus registrados. Debes ejecutar primero el seed de campus.");
        return;
    }

    for (const campus of campusList) {
        // Crear entre 2 y 4 áreas por campus
        const totalAreas = randomInt(2, 4);

        for (let i = 0; i < totalAreas; i++) {
            const nombre =
                nombresAreas[randomInt(0, nombresAreas.length - 1)];

            // Verificar si ya existe el área en este campus
            const existingArea = await prisma.area.findFirst({
                where: { nombre, campusId: campus.id },
            });

            if (!existingArea) {
                await prisma.area.create({
                    data: {
                        nombre,
                        campusId: campus.id,
                    },
                });

                console.log(
                    `✅ Área "${nombre}" creada en el campus ID ${campus.id}`
                );
            } else {
                console.log(
                    `⚠️ El área "${nombre}" ya existe en el campus ID ${campus.id}`
                );
            }
        }
    }

    console.log("🌱 Seed de áreas completado correctamente.");
};

export default seedAreas;
