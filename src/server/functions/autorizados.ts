interface AuthParams {
    permitir: string[];
    rolUser: string;
}

interface AuthParamsNegated {
    denegar: string[];
    rolUser: string;
}

/**
 * Verifica si el usuario está autorizado según su rol.
 * Retorna true si el rol del usuario está dentro del arreglo de permitir.
 */
export const hasAccess = ({ permitir, rolUser }: AuthParams): boolean =>
    permitir.includes(rolUser);

/**
 * Verifica si el usuario **no** está autorizado según su rol.
 * Retorna true si el rol del usuario está dentro del arreglo de noPermitidos.
 */
export const notAccess = ({ denegar, rolUser }: AuthParamsNegated): boolean =>
    denegar.includes(rolUser);