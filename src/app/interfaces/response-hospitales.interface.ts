import { Hospital } from "../models/hospital.model";

export interface ResponseHospital {
    ok: boolean;
    hospitales: Hospital[];
}