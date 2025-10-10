import { prisma } from "@fn";

const seedZonasUrbanizaciones = async () => {
    // Datos base
    const zonas = [
        { estado: "Guarico", zona: "Altagracia de Orituco", codigoPostal: 2320 },
        { estado: "Guarico", zona: "Barbacoa", codigoPostal: 2334 },
        { estado: "Guarico", zona: "Cabruta", codigoPostal: 8007 },
        { estado: "Guarico", zona: "Calabozo", codigoPostal: 2312 },
        { estado: "Guarico", zona: "Camatagua", codigoPostal: 2335 },
        { estado: "Guarico", zona: "Camatagua", codigoPostal: 7001 },
        { estado: "Guarico", zona: "Cambural de Cataure", codigoPostal: 2301 },
        { estado: "Guarico", zona: "Carmen de Cura", codigoPostal: 2311 },
        { estado: "Guarico", zona: "Cazorla", codigoPostal: 2301 },
        { estado: "Guarico", zona: "Chaguaramas", codigoPostal: 2358 },
        { estado: "Guarico", zona: "Corozopando", codigoPostal: 2301 },
        { estado: "Guarico", zona: "Dos Caminos", codigoPostal: 2301 },
        { estado: "Guarico", zona: "El Calvario", codigoPostal: 2303 },
        { estado: "Guarico", zona: "El Caro de La Negra", codigoPostal: 2301 },
        { estado: "Guarico", zona: "El Corozo", codigoPostal: 2301 },
        { estado: "Guarico", zona: "El Palito", codigoPostal: 2301 },
        { estado: "Guarico", zona: "El Punzón", codigoPostal: 2301 },
        { estado: "Guarico", zona: "El Rastro", codigoPostal: 2304 },
        { estado: "Guarico", zona: "El Socorro", codigoPostal: 2355 },
        { estado: "Guarico", zona: "El Sombrero", codigoPostal: 2319 },
        { estado: "Guarico", zona: "Espino", codigoPostal: 2301 },
        { estado: "Guarico", zona: "Francisco de Tiznado", codigoPostal: 2301 },
        { estado: "Guarico", zona: "Guardatinaja", codigoPostal: 2316 },
        { estado: "Guarico", zona: "Guaripa", codigoPostal: 2301 },
        { estado: "Guarico", zona: "Ipare de Orituco", codigoPostal: 2301 },
        { estado: "Guarico", zona: "La Arboleda", codigoPostal: 2301 },
        { estado: "Guarico", zona: "La Esperanza", codigoPostal: 2301 },
        { estado: "Guarico", zona: "Las Mercedes del Llano", codigoPostal: 2356 },
        { estado: "Guarico", zona: "Las Minas", codigoPostal: 2301 },
        { estado: "Guarico", zona: "Lezama", codigoPostal: 2301 },
        { estado: "Guarico", zona: "Libertad de Orituco", codigoPostal: 2301 },
        { estado: "Guarico", zona: "Los Pozotes", codigoPostal: 2301 },
        { estado: "Guarico", zona: "Mamonal", codigoPostal: 2301 },
        { estado: "Guarico", zona: "Ortíz", codigoPostal: 2302 },
        { estado: "Guarico", zona: "Otras Poblaciones", codigoPostal: 2301 },
        { estado: "Guarico", zona: "Parapara de Ortíz", codigoPostal: 2301 },
        { estado: "Guarico", zona: "Paso Real de Macaira", codigoPostal: 2301 },
        { estado: "Guarico", zona: "Pirital", codigoPostal: 2301 },
        { estado: "Guarico", zona: "Roblecito", codigoPostal: 2301 },
        { estado: "Guarico", zona: "Sabana Grande de Orituco", codigoPostal: 2301 },
        { estado: "Guarico", zona: "San Casimiro", codigoPostal: 2338 },
        { estado: "Guarico", zona: "San Francisco de Cara", codigoPostal: 2301 },
        { estado: "Guarico", zona: "San Francisco de Macaira", codigoPostal: 2301 },
        { estado: "Guarico", zona: "San José de Anare", codigoPostal: 2301 },
        { estado: "Guarico", zona: "San José de Guaribe", codigoPostal: 2301 },
        { estado: "Guarico", zona: "San José de Tiznados", codigoPostal: 2305 },
        { estado: "Guarico", zona: "San Jose Unare", codigoPostal: 2351 },
        { estado: "Guarico", zona: "San Juan de los Morros", codigoPostal: 2301 },
        { estado: "Guarico", zona: "San Rafael de Laya", codigoPostal: 2301 },
        { estado: "Guarico", zona: "San Rafael de Orituco", codigoPostal: 2301 },
        { estado: "Guarico", zona: "San Sebastián", codigoPostal: 2340 },
        { estado: "Guarico", zona: "Santa María de Ipire", codigoPostal: 2354 },
        { estado: "Guarico", zona: "Santa Rita de Manapire", codigoPostal: 2301 },
        { estado: "Guarico", zona: "Taguay", codigoPostal: 2301 },
        { estado: "Guarico", zona: "Tucupido", codigoPostal: 2301 },
        { estado: "Guarico", zona: "Valle de Morín (Aragua)", codigoPostal: 2301 },
        { estado: "Guarico", zona: "Valle La Pascua", codigoPostal: 2350 },
        { estado: "Guarico", zona: "Zaraza", codigoPostal: 2332 },
    ];

    // Crear el estado si no existe
    const estadoNombre = "Guarico";
    let estado = await prisma.estadoPais.findFirst({ where: { estado: estadoNombre } });

    if (!estado) {
        estado = await prisma.estadoPais.create({
            data: { estado: estadoNombre },
        });
        console.log(`✅ Estado "${estadoNombre}" creado`);
    } else {
        console.log(`ℹ️ Estado "${estadoNombre}" ya existe`);
    }

    // Insertar zonas y urbanizaciones
    for (const item of zonas) {
        const existe = await prisma.zonaUrbanizacion.findFirst({
            where: {
                zona: item.zona,
                codigoPostal: item.codigoPostal,
                estadoPaisId: estado.id,
            },
        });

        if (!existe) {
            await prisma.zonaUrbanizacion.create({
                data: {
                    zona: item.zona,
                    codigoPostal: item.codigoPostal,
                    estadoPaisId: estado.id,
                },
            });
            console.log(`✅ Zona "${item.zona}" creada`);
        } else {
            console.log(`ℹ️ Zona "${item.zona}" ya existe`);
        }
    }

    console.log("🌍 Seed de zonas completado ✅");
};

export default seedZonasUrbanizaciones;
