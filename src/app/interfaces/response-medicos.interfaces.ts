import { Medico } from "../models/medico.model";

export interface ResponseMedico {
    ok: boolean;
    medicos: Medico[];
}