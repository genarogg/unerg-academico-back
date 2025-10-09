import cleanPrisma from "./cleanPrisma.js";

const clean = async () => {
    try {
        const result = cleanPrisma();
  
        if (result) {
            console.log('✅ Limpieza de Prisma completada con éxito.');
        } else {
            console.log('⚠️ Limpieza de Prisma no se realizó correctamente.');
        }
    } catch (error) {
        console.error('❌ Error al ejecutar la tarea de limpieza:', error);
    }
}


clean();