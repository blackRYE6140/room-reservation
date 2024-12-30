import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ClientService } from '../../service/client/client.service'; 
import { Client } from '../../class/client/client'; 
import { HttpClientModule } from '@angular/common/http';
import { NgxPaginationModule } from 'ngx-pagination';
import { ThemeService } from '../../service/theme/theme.service';
import { ConfirmationModalComponent } from '../../confirmation-modal/confirmation-modal.component'; 
import { MatDialog } from '@angular/material/dialog';
import { ReservationComponent } from '../reservation/reservation.component'
import Swal from 'sweetalert2';

@Component({
  selector: 'app-client',
  standalone: true,
  providers: [ClientService],
  imports: [RouterOutlet,FormsModule,CommonModule,RouterOutlet,RouterLink,RouterLinkActive, HttpClientModule,NgxPaginationModule],
  templateUrl: './client.component.html',
  styleUrl: './client.component.scss'
})
export class ClientComponent {
  resultData: Client[] = [] ;
  createClient: Client = new Client();
  selectedClientId: any = null; 
  searchKeyword: string = '';

  pageSize = 6; 
  p = 1;

  showModal: boolean = false;

  darkMode= false ;

  constructor(private service: ClientService, private themeService: ThemeService , private dialog: MatDialog) {}

  ngOnInit() {
    this.show() ;
    this.themeService.darkMode$.subscribe(mode => {
      this.darkMode = mode;
    });
  }

  show(){
    this.service.getAll().subscribe((res: any) => {
      console.log(res, "res==>");
      this.resultData = res.data ;
    });
  }

  //confirmation modale
  openConfirmationModal(actionType: 'update' | 'delete' | 'add', id: any) {
    Swal.fire({
        title: 'Êtes-vous sûr?',
        text: `Voulez-vous vraiment ${actionType} ce client?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Oui, continuez!',
        cancelButtonText: 'Non, annuler'
    }).then((result) => {
        if (result.isConfirmed) {
            if (actionType === 'delete') {
                this.deleteClient(id);
            } else {
                this.clientSubmit();
            }
            Swal.fire(
                'Effectué!',
                `Le client a été ${actionType}d.`,
                'success'
            );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            Swal.fire(
                'Annulé',
                `Le client n'a pas été ${actionType}d.`,
                'error'
            );
        }
    });
}


clientSubmit() {
  if (this.selectedClientId) {
      this.service.update(this.selectedClientId, this.createClient).subscribe((res: any) => {
          console.log(res, "res==>");
          this.show();
          this.createClient = new Client(); 
          this.selectedClientId = null;
          this.toggleModal();
          Swal.fire('Succès', 'Client mis à jour avec succès', 'success');
      }, (error) => {
          console.error('Erreur de mise à jour:', error);
          Swal.fire('Erreur', 'Échec de la mise à jour du client', 'error');
      });
  } else {
      this.service.create(this.createClient).subscribe((res: any) => {
          console.log(res, "res==>");
          this.show();
          this.createClient = new Client(); 
          this.toggleModal();
          Swal.fire('Succès', 'Client créé avec succès', 'success');
      }, (error) => {
          console.error('Erreur de création:', error);
          Swal.fire('Erreur', 'Échec de la création du client', 'error');
      });
  }
}


deleteClient(id: any) {
  this.service.delete(id).subscribe((res: any) => {
      console.log(res, "res==>");
      this.show();
      Swal.fire('Supprimé!', 'Client a été supprimé.', 'success');
  }, (error) => {
      console.error('Erreur de suppression:', error);
      Swal.fire('Erreur', 'Échec de la suppression du client', 'error');
  });
}


  editClient(client: Client) {
    this.toggleModal();
    this.selectedClientId = client.idcli;
    this.createClient = { ...client };
  }

  searchClient(): void {
    this.service.search(this.searchKeyword).subscribe((res: any) => {
      console.log(res, "res==>");
      this.resultData = res.data;
    });
  }

  reserver(){
    location.href="/reservation";
  }
  
  toggleModal() {
    this.showModal = !this.showModal;
  }

  //controlle champ variable
  nomcliController: string = '';
  numidentiteController: string = '';
  contactController: string = '';
  nationaliteController: string = '';
  //controlle champ efface les erreurs
  regnomcli(text: any) {
    var valeur = text;
    var SansChiffre = valeur.replace(/[0-9]/g, "");
    this.nomcliController = SansChiffre;
  }
  regnumidentite(text: any) {
    var valeur = text;
    var SansLettre = valeur.replace(/[a-zA-Z]/g, "");
    this.numidentiteController = SansLettre;
  }
  regcontact(text: any) {
    var valeur = text;
    var SansChiffre = valeur.replace(/[a-zA-Z]/g, "");
    this.contactController = SansChiffre;
  }
  regnationalite(text: any) {
    var valeur = text;
    var SansChiffre = valeur.replace(/[0-9]/g, "");
    this.nationaliteController = SansChiffre;
  }
  
}
