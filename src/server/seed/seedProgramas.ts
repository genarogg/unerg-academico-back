import { prisma } from "@fn";
import { NivelAcademico, Modalidad, Vigencia } from "@prisma/client";

// Función para generar un número aleatorio dentro de un rango
const randomInt = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

// Lista base de programas académicos por tipo de área
const programasPorArea: Record<string, string[]> = {
    "Ingeniería y Tecnología": [
        "Ingeniería en Sistemas",
        "Ingeniería Civil",
        "Ingeniería Eléctrica",
        "Ingeniería Industrial",
    ],
    "Ciencias de la Salud": [
        "Medicina",
        "Enfermería",
        "Bioanálisis",
        "Fisioterapia",
    ],
    "Ciencias Sociales": [
        "Sociología",
        "Psicología",
        "Trabajo Social",
        "Comunicación Social",
    ],
    "Educación": [
        "Educación Inicial",
        "Educación Integral",
        "Educación Física",
        "Orientación y Consejería",
    ],
    "Administración y Economía": [
        "Administración de Empresas",
        "Contaduría Pública",
        "Economía",
        "Gestión Financiera",
    ],
    "Ciencias Jurídicas y Políticas": [
        "Derecho",
        "Ciencias Políticas",
        "Criminología",
    ],
    "Arte y Comunicación": [
        "Diseño Gráfico",
        "Comunicación Audiovisual",
        "Bellas Artes",
    ],
};

// Arrays de valores para enums
const niveles = Object.values(NivelAcademico);
const modalidades = Object.values(Modalidad);
const vigencias = Object.values(Vigencia);

const seedProgramas = async () => {
    // Obtener todas las áreas existentes
    const areas = await prisma.area.findMany();

    if (areas.length === 0) {
        console.warn("⚠️ No hay áreas registradas. Ejecuta primero el seed de áreas.");
        return;
    }

    for (const area of areas) {
        // Buscar los programas sugeridos para el nombre del área
        const posiblesProgramas =
            programasPorArea[area.nombre] || [
                "Programa General",
                "Programa Especializado",
            ];

        // Crear entre 2 y 3 programas por área
        const cantidad = randomInt(2, 3);
        const seleccionados = posiblesProgramas
            .sort(() => 0.5 - Math.random())
            .slice(0, cantidad);

        for (const nombre of seleccionados) {
            // Verificar si ya existe ese programa en esta área
            const existe = await prisma.programa.findFirst({
                where: { nombre, area_id: area.id },
            });

            if (!existe) {
                await prisma.programa.create({
                    data: {
                        nombre,
                        area_id: area.id,
                        nivelAcademico: niveles[randomInt(0, niveles.length - 1)],
                        modalidad: modalidades[randomInt(0, modalidades.length - 1)],
                        duracion_anios: randomInt(3, 5),
                        vigencia: vigencias[randomInt(0, vigencias.length - 1)],
                    },
                });

                console.log(`✅ Programa "${nombre}" creado en el área "${area.nombre}"`);
            } else {
                console.log(`⚠️ El programa "${nombre}" ya existe en el área "${area.nombre}"`);
            }
        }
    }

    console.log("🌱 Seed de programas completado correctamente.");
};

export default seedProgramas;
