import { Injectable } from '@angular/core';
import { ReservationComponent } from '../../component/reservation/reservation.component'

@Injectable({
  providedIn: 'root',
})
export class RoutesModalService {

  constructor(private reservation: ReservationComponent) { }
  Modal(){
    this.reservation.toggleModalres();
  }
}
