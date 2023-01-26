import { Medico } from "../models/medico.model";

export interface ResponseMedicoEdit {
    ok: boolean;
    medico: Medico;
}