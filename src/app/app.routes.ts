import { RouterModule, Routes } from '@angular/router'
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';


const APP_ROUTES: Routes = [

    {path:'home', component: HomeComponent},
    {path:'login', component: LoginComponent},
    {path:'register', component: RegisterComponent},
    {path:'**', redirectTo: 'home', pathMatch:'full'}
];

export const APP_ROUTING = RouterModule.forRoot(APP_ROUTES);