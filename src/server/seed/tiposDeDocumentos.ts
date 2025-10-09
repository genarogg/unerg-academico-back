import { prisma } from "@fn";

const seedTiposDocumento = async () => {
    // Tipos de documento a crear
    const documentos = ["cedula", "cuenta bancaria", "certificado de salud mental"];

    for (const nombre of documentos) {
        const existente = await prisma.tipoDocumento.findFirst({
            where: { nombre },
        });

        if (!existente) {
            await prisma.tipoDocumento.create({
                data: {
                    nombre
                },
            });

            console.log(`✅ Tipo de documento "${nombre}" creado`);
        } else {
            console.log(`⚠️ Tipo de documento "${nombre}" ya existe`);
        }
    }

    console.log("✔️ Seed de Tipos de Documento completado");
};

export default seedTiposDocumento;
