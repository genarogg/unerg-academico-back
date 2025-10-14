import registerUsuario from "./registerUsuario";
import loginUsuario from "./loginUsuario";
import resetPassword from "./resetSendEmail";
import resetPassWithToken from "./resetPassWithToken";

import validarSesion from "./validarSesion";
import getUsuarios from "./getUsuarios";
import getUsuario from "./getUsuario";


const resolvers = {
    Query: {
        validarSesion,
        getUsuarios,
        getUsuario
    },

    Mutation: {
        registerUsuario,
        loginUsuario,
        resetPassword,
        resetPassWithToken
    }
};

export default resolvers;