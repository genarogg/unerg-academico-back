import { prisma, log } from "@fn";
import seedUsers from "./usuario/seedUsers";
import seedDocentes from "./seedDocentes";
import seedCedulasAutorizadas from "./seedCedulasAutorizadas"
import seedZonasUrbanizaciones from "./seedZonasUrbanizaciones"
import seedTiposDocumento from "./tiposDeDocumentos"
import agregarDirecciones from "./seedDirecciones";
import seedCampus from "./seedCampus"
import seedAreas from "./seedAreas"
import seedProgramas from "./seedProgramas"

import seedActividadDocente from "./seedActividadDocente"
import seedEstatusLaboral from "./seedEstatusLaboral"
import seedDedicacion from "./seedDedicacion"

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const seed = async () => {
    try {

        const adminUser = await prisma.usuario.findUnique({
            where: { email: "admin@admin.com" },
        });

        if (adminUser) {
            log.info("Usuario admin@admin.com ya existe. Saltando la creación de usuarios.");
            return;
        }

        await seedUsers();
        await delay(100);

        await seedDocentes()
        await delay(100);

        await seedCedulasAutorizadas()
        await delay(100);

        await seedZonasUrbanizaciones()
        await delay(100);

        await seedTiposDocumento()
        await delay(100);

        await agregarDirecciones()
        await delay(100);

        await seedCampus()
        await delay(100);

        await seedAreas()
        await delay(100);

        await seedProgramas()
        await delay(100);

        await seedActividadDocente()
        await delay(100);

        await seedEstatusLaboral()
        await delay(100);
        
        await seedDedicacion()
        await delay(100);

        log.info("Usuarios creados exitosamente.");
    } catch (error) {
        console.error("Error al sembrar la base de datos:", error);
    }
};

export default seed;