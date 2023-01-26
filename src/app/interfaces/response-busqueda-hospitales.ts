import { Hospital } from "../models/hospital.model";

export interface ResponseBusquedaHospitales {
    ok: boolean,
    resultado: Hospital[]
}
