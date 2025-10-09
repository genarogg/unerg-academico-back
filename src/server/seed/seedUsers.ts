import { encriptarContrasena, prisma } from "src/server/functions";
import { Rol } from "@prisma/client";

const seedUsers = async () => {
    const users = [
        {

            email: "super@super.com",
            password: "super",
            rol: Rol.SUPER,
        },
        {

            email: "admin@admin.com",
            password: "admin",
            rol: Rol.ADMIN,
        },
        {
            email: "area@area.com",
            password: "area",
            rol: Rol.AREA,
        },
        {
            email: "docente@docente.com",
            password: "docente",
            rol: Rol.DOCENTE,
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