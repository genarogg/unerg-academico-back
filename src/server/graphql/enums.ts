import {
    Rol, AccionesBitacora, Sex, Vigencia,
    EstatusDocumento, NivelAcademico, TipoStudio,
    TipoCampus, Modalidad
} from '@prisma/client';

const createEnumString = (enumObj: object) => {
    const keys = Object.keys(enumObj);
    if (keys.length === 0) return 'EMPTY_ENUM';
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
    enum EstatusDocumento {
        ${createEnumString(EstatusDocumento)}
    }
    enum NivelAcademico {
        ${createEnumString(NivelAcademico)}
    }
    enum TipoStudio {
        ${createEnumString(TipoStudio)}
    }
    enum TipoCampus {
        ${createEnumString(TipoCampus)}
    }
    enum Modalidad {
        ${createEnumString(Modalidad)}
    }
`;

export default enums;