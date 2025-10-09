import { Rol, AccionesBitacora, Sex, Vigencia } from '@prisma/client';

const createEnumString = (enumObj: object) => {
    const keys = Object.keys(enumObj);
    if (keys.length === 0) {
        return 'EMPTY_ENUM';
    }
    return keys.map(key => `${key}`).join('\n        ');
};

const enums = /* GraphQL */`
    enum Rol {
        ${createEnumString(Rol)}
    }
    enum AccionesBitacora {
        ${createEnumString(AccionesBitacora)}
    }
     enum Sex {
        ${createEnumString(Sex)}
    }
     enum Vigencia {
        ${createEnumString(Vigencia)}
    }
`;

export default enums;