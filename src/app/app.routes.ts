import { Routes } from '@angular/router';
import { LoginComponent } from './component/login/login.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { ChambreComponent } from './component/chambre/chambre.component';
import { ClientComponent } from './component/client/client.component';
import { ReservationComponent } from './component/reservation/reservation.component';

export const routes: Routes = [
    { 
        path: '', 
        redirectTo: '/login', 
        pathMatch: 'full' 
      },
      { 
        path: 'login', 
        component: LoginComponent,
        title: "Login"
      },
      { 
        path:"" , 
        title: "Reservation de chambre",
        children: [
          {
            path:"dashboard",
            component: DashboardComponent,
            title: "Dashboard"
          },
          {
            path:"chambre",
            component: ChambreComponent,
            title: "Chambre"
          },
          {
            path:"client",
            component: ClientComponent,
            title: "Client"
          },
          {
            path:"reservation",
            component: ReservationComponent,
            title: "Reservation"
          },
        ]
      },
];
