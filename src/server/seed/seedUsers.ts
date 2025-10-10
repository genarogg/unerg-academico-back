import { encriptarContrasena, prisma } from "@fn";
import { Rol, Sex } from "@prisma/client";

// Función para generar un número aleatorio dentro de un rango
const randomInt = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

// Datos de ejemplo
const nombres = ["Juan", "María", "Carlos", "Ana", "Luis", "Sofía"];
const apellidos = ["Pérez", "González", "Rodríguez", "López", "Martínez"];

const seedUsers = async () => {
    const users = [
        { email: "super@super.com", password: "super", rol: Rol.SUPER },
        { email: "admin@admin.com", password: "admin", rol: Rol.ADMIN },
        { email: "area@area.com", password: "area", rol: Rol.AREA },
        { email: "docente@docente.com", password: "docente", rol: Rol.DOCENTE },
    ];

    for (const user of users) {
        const { email, password, rol } = user;

        const existingUser = await prisma.usuario.findUnique({
            where: { email },
            include: { DatosPersonales: true },
        });

        if (!existingUser) {
            const hashedPassword = await encriptarContrasena({ password });

            await prisma.usuario.create({
                data: {
                    email,
                    password: hashedPassword,
                    rol,
                    DatosPersonales: {
                        create: {
                            primerNombre: nombres[randomInt(0, nombres.length - 1)],
                            segundoNombre: nombres[randomInt(0, nombres.length - 1)],
                            primerApellido: apellidos[randomInt(0, apellidos.length - 1)],
                            segundoApellido: apellidos[randomInt(0, apellidos.length - 1)],
                            sexo: Math.random() > 0.5 ? Sex.HOMBRE : Sex.MUJER,
                            fechaNacimiento: new Date(
                                1980 + randomInt(0, 20),
                                randomInt(0, 11),
                                randomInt(1, 28)
                            ),
                            numeroCedula: randomInt(1000000, 9999999),
                            telefono: `809-${randomInt(100, 999)}-${randomInt(1000, 9999)}`,
                        },
                    },
                },
            });

            console.log(`Usuario ${email} creado con datos personales`);
        } else {
            console.log(`Usuario ${email} ya existe`);
        }
    }
};

export default seedUsers;
