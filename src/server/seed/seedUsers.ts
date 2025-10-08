import { encriptarContrasena, prisma } from "src/server/functions";
import { Rol } from "@prisma/client";

const seedUsers = async () => {
    const users = [
        {

            email: "admin@admin.com",
            password: "admin",
            rol: Rol.SUPER,
        },
        {

            email: "usuario@gmail.com",
            password: "demo",
            rol: Rol.ADMIN,
        },
        {
            email: "asistente@gmail.com",
            password: "demo",
            rol: Rol.AREA,
        },
    ];

    for (const user of users) {
        const { email, password, rol } = user;
        const existingUser = await prisma.usuario.findUnique({
            where: { email: user.email },
        });

        if (!existingUser) {
            const hashedPassword = await encriptarContrasena({ password });
            await prisma.usuario.create({
                data: {

                    email,
                    password: hashedPassword,
                    rol,
                },
            });
            console.log(`Usuario ${user.email} creado`);
        } else {
            console.log(`Usuario ${user.email} ya existe`);
        }
    }
};

export default seedUsers;