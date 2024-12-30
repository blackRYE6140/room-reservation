import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ChambreService } from '../../service/chambre/chambre.service';
import { Chambre } from '../../class/chambre/chambre';
import { HttpClientModule } from '@angular/common/http';
import { NgxPaginationModule } from 'ngx-pagination';
import { ThemeService } from '../../service/theme/theme.service';
import { ConfirmationModalComponent } from '../../confirmation-modal/confirmation-modal.component'; 
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-chambre',
  standalone: true,
  providers: [ChambreService],
  imports: [FormsModule, CommonModule, HttpClientModule, NgxPaginationModule],
  templateUrl: './chambre.component.html',
  styleUrl: './chambre.component.scss'
})
export class ChambreComponent {
  resultData: Chambre[] = [] ;
  createChambre: Chambre = new Chambre();
  selectedChambreId: any = null; 
  searchKeyword: string = '';

  pageSize = 6; 
  p = 1;

  showModal: boolean = false;

  darkMode= false ;

  constructor(private service: ChambreService, private themeService: ThemeService,  private dialog: MatDialog) {}

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

  toggleModal() {
    this.showModal = !this.showModal;
  }

   //confirmation modale
   openConfirmationModal(actionType: 'update' | 'delete' | 'add', id: any) {
    Swal.fire({
        title: 'Êtes-vous sûr?',
        text: `Voulez-vous vraiment ${actionType} cette chambre?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Oui, continuez!',
        cancelButtonText: 'Non, annuler'
    }).then((result) => {
        if (result.isConfirmed) {
            if (actionType === 'delete') {
                this.deleteChambre(id);
            } else {
                this.chambreSubmit();
            }
            Swal.fire(
                'Effectué!',
                `La chambre a été ${actionType}d.`,
                'success'
            );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            Swal.fire(
                'Annulé',
                `La chambre n'a pas été ${actionType}d.`,
                'error'
            );
        }
    });
}




  chambreSubmit() {
    if(this.selectedChambreId) {
        this.service.update(this.selectedChambreId, this.createChambre).subscribe((res: any) => {
            console.log(res, "res==>");
            this.show();
            this.createChambre = new Chambre(); 
            this.selectedChambreId = null;
            this.toggleModal();
            Swal.fire('Succès', 'Chambre mise à jour avec succès', 'success');
        }, (error) => {
            console.error('Erreur de mise à jour:', error);
            Swal.fire('Erreur', 'Échec de la mise à jour de la chambre', 'error');
        });
    }  
    else {   
        this.service.create(this.createChambre).subscribe((res: any) => {
            console.log(res, "res==>");
            this.show();
            this.createChambre = new Chambre(); 
            this.toggleModal();
            Swal.fire('Succès', 'Chambre créée avec succès', 'success');
        }, (error) => {
            console.error('Erreur de création:', error);
            Swal.fire('Erreur', 'Échec de la création de la chambre', 'error');
        });
    }
  }


  deleteChambre(id: any) {
    this.service.delete(id).subscribe((res: any) => {
        console.log(res, "res==>");
        this.show();
        Swal.fire('Supprimé!', 'Chambre a été supprimée.', 'success');
    }, (error) => {
        console.error('Erreur de suppression:', error);
        Swal.fire('Erreur', 'Échec de la suppression de la chambre', 'error');
    });
  }

  
  editChambre(chambre: Chambre) {
    this.toggleModal();
    this.selectedChambreId = chambre.numch;
    this.createChambre = { ...chambre };
  }

  searchChambre(): void {
    this.service.search(this.searchKeyword).subscribe((res: any) => {
      console.log(res, "res==>");
      this.resultData = res.data;
    });
  }


  //controlle champ variable
  numchController: string = '';
  nbrpersoController: string = '';
  prixController: string = '';
  //controlle champ efface les erreurs
  regnumch(text: any) {
    var valeur = text;
    var SansChiffre = valeur.replace(/[0-9]/g, "");
    this.numchController = SansChiffre;
  }
  regnbrperso(text: any) {
    var valeur = text;
    var SansChiffre = valeur.replace(/[a-zA-Z]/g, "");
    this.nbrpersoController = SansChiffre;
  }
  regprix(text: any) {
    var valeur = text;
    var SansChiffre = valeur.replace(/[a-zA-Z]/g, "");
    this.prixController = SansChiffre;
  }
 
}
