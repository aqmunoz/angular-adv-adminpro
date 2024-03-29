
import { NgModule } from "@angular/core"
import { RouterModule, Routes } from "@angular/router"

import { DashboardComponent } from "./dashboard/dashboard.component"
import { Grafica1Component } from "./grafica1/grafica1.component"
import { PagesComponent } from "./pages.component"
import { ProgressComponent } from "./progress/progress.component"
import { AccountSettingsComponent } from "./account-settings/account-settings.component"
import { PromesaComponent } from "./promesa/promesa.component"
import { RxjsComponent } from "./rxjs/rxjs.component"
import { AuthGuard } from "../guards/auth.guard"
import { PerfilComponent } from "./perfil/perfil.component"
import { UsuariosComponent   } from "./mantenimientos/usuarios/usuarios.component";
import { HospitalesComponent } from "./mantenimientos/hospitales/hospitales.component"
import { MedicosComponent } from "./mantenimientos/medicos/medicos.component"
import { MedicoComponent } from "./mantenimientos/medicos/medico.component"

const routes: Routes = [
    {
        path: 'dashboard',
        component: PagesComponent,
        canActivate: [AuthGuard],
        children: [
            { path: '', component: DashboardComponent, data: {titulo: 'Dashboard'} },
            { path: 'progress', component: ProgressComponent, data: {titulo: 'Progress'} },
            { path: 'grafica1', component: Grafica1Component, data: {titulo: 'Gráfica'} },
            { path: 'account-settings', component: AccountSettingsComponent, data: {titulo: 'Account settings'} },
            { path: 'promesa', component: PromesaComponent, data: {titulo: 'Promesa'} },
            { path: 'rxjs', component: RxjsComponent, data: {titulo: 'RxJS'} },
            { path: 'perfil', component: PerfilComponent, data: {titulo: 'Perfil de usuario'} },
            
            //Mantenimientos
            
            { path: 'usuarios', component: UsuariosComponent, data: {titulo: 'Mantenimiento de usuarios'} },
            { path: 'hospitales', component: HospitalesComponent, data: {titulo: 'Mantenimiento de hospitales'} },
            { path: 'medicos', component: MedicosComponent, data: {titulo: 'Mantenimiento de médicos'} },
            { path: 'medico/:id', component: MedicoComponent, data: {titulo: 'Mantenimiento de médicos'} },
        ]
    },
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule { }