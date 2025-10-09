interface AuthParams {
    rolesPermitidos: string[];
    rolUsuario: string;
}

/**
 * Verifica si el usuario está autorizado según su rol.
 * Retorna true si el rol del usuario está dentro del arreglo de rolesPermitidos.
 */
export const isAuth = ({ rolesPermitidos, rolUsuario }: AuthParams): boolean =>
    rolesPermitidos.includes(rolUsuario);

/**
 * Verifica si el usuario **no** está autorizado según su rol.
 * Retorna true si el rol del usuario NO está dentro del arreglo de rolesPermitidos.
 */
export const notAuth = ({ rolesPermitidos, rolUsuario }: AuthParams): boolean =>
    !rolesPermitidos.includes(rolUsuario);
