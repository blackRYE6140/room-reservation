import { CommonModule, formatDate } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ReservationService } from '../../service/reservation/reservation.service';
import { ChambreService } from '../../service/chambre/chambre.service';
import { Reservation } from '../../class/reservation/reservation';
import { Chambre } from '../../class/chambre/chambre';
import { HttpClientModule } from '@angular/common/http';
import { NgxPaginationModule } from 'ngx-pagination';
import { ThemeService } from '../../service/theme/theme.service';
import { ConfirmationModalComponent } from '../../confirmation-modal/confirmation-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Client } from '../../class/client/client';
import { ClientService } from '../../service/client/client.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reservation',
  standalone: true,
  providers: [ReservationService, ChambreService, ClientService],
  imports: [RouterOutlet, FormsModule, CommonModule, RouterLink, RouterLinkActive, HttpClientModule, NgxPaginationModule],
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.scss']
})
export class ReservationComponent {
  resultData: Reservation[] = [];
  filteredData: Reservation[] = [];
  createReservation: Reservation = new Reservation();
  selectedReservationId: any = null;
  startDate: string | undefined;
  endDate: string | undefined;
  searchByDate: boolean = false;
  searchKeyword: string = '';

  pageSize = 6;
  p = 1;

  showModal: boolean = false;
  darkMode = false;

  constructor(private service: ReservationService, private clientService: ClientService, private themeService: ThemeService, private chambreService: ChambreService, private dialog: MatDialog) {
    this.createReservation.numch = [];
  }

  ngOnInit() {
    this.setCurrentDate();
    this.show();
    this.themeService.darkMode$.subscribe(mode => {
      this.darkMode = mode;
    });
    this.showChambre();
    this.showNumch();

    this.searchReservation(this.startDate, this.endDate);
  }
 
  show() {
    this.service.getAll().subscribe((res: any) => {
      console.log(res, "res==>");
      this.resultData = res.data;
    });
  }

  openConfirmationModal(actionType: 'update' | 'delete' | 'add', id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you really want to ${actionType} this reservation?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, do it!',
      cancelButtonText: 'No, cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        if (actionType === 'delete') {
          this.deleteReservation(id);
        } else if (actionType === 'update' || actionType === 'add') {
          this.reservationSubmit();
        }
        Swal.fire(
          'Done!',
          `The reservation has been ${actionType}d.`,
          'success'
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          `The reservation was not ${actionType}d.`,
          'error'
        );
      }
    });
  }

  reservationSubmit() {
    if (this.selectedReservationId) {
      this.service.update(this.selectedReservationId, this.createReservation).subscribe(
        (res: any) => {
          this.show();
          this.createReservation = new Reservation();
          this.selectedReservationId = null;
          this.toggleModalres();
          Swal.fire('Success', 'Reservation updated successfully', 'success');
        },
        (error) => {
          console.error('Update Error:', error);
          Swal.fire('Error', 'Failed to update reservation', 'error');
        }
      );
    } else {
      this.service.create(this.createReservation).subscribe(
        (res: any) => {
          this.show();
          this.createReservation = new Reservation();
          this.toggleModalres();
          Swal.fire('Success', 'Reservation created successfully', 'success');
        },
        (error) => {
          console.error('Create Error:', error);
          Swal.fire('Error', 'Failed to create reservation', 'error');
        }
      );
    }
  }
  
  deleteReservation(id: any) {
    this.service.delete(id).subscribe(
      (res: any) => {
        this.show();
        Swal.fire('Deleted!', 'Reservation has been deleted.', 'success');
      },
      (error) => {
        console.error('Delete Error:', error);
        Swal.fire('Error', 'Failed to delete reservation', 'error');
      }
    );
  }

  editReservation(reservation: Reservation) {
    this.toggleModalres();
    this.selectedReservationId = reservation.idres;

    // Copiez la réservation sélectionnée dans createReservation
    this.createReservation = { ...reservation };

    // Assurez-vous que createReservation.numch est un tableau
    if (!Array.isArray(this.createReservation.numch)) {
      this.createReservation.numch = [];
    }

    // Parcourez les numéros de chambre sélectionnés
    for (const room of this.createReservation.numch) {
      // Trouvez l'index de la chambre dans la liste des chambres
      const index = this.chambreData.findIndex(chambre => chambre.numch === room);
      // Vérifiez si l'index est valide
      if (index !== -1) {
        // Cochez la case à cocher correspondante dans la liste des chambres
        const roomCheckbox = document.getElementById(room) as HTMLInputElement;
        if (roomCheckbox) {
          roomCheckbox.checked = true;
        }
      }
    }
  }

  toggleSearchMode(event: any) {
    this.searchByDate = event.target.value === 'date';
  }

  searchReservation(startDate: string | undefined, endDate: string | undefined) {
    const filterStartDate = startDate ? new Date(startDate) : null;
    const filterEndDate = endDate ? new Date(endDate) : null;
  
    const table = document.querySelector("table");
    if (table) {
      const tr = table.getElementsByTagName("tr");
      for (let i = 1; i < tr.length; i++) {  // Start from 1 to skip the header row
        const tds = tr[i].getElementsByTagName("td");
        const reservationDateArr = tds[3]?.textContent;
        const reservationDateDep = tds[4]?.textContent;
  
        if (reservationDateArr && reservationDateDep) {
          const dateArr = new Date(reservationDateArr);
          const dateDep = new Date(reservationDateDep);
          
          let show = true;
          
          if (filterStartDate && filterEndDate) {
            show = (dateArr >= filterStartDate && dateDep <= filterEndDate);
          } else if (filterStartDate) {
            show = (dateArr >= filterStartDate);
          } else if (filterEndDate) {
            show = (dateDep <= filterEndDate);
          }
          
          tr[i].style.display = show ? "" : "none";
        } else {
          tr[i].style.display = "none";
        }
      }
    }
  }

  clearSearch() {
    this.startDate = undefined;
    this.endDate = undefined;
    this.searchKeyword = '';
    this.searchReservation(this.startDate, this.endDate); // Appeler la fonction de recherche pour réinitialiser les filtres
  }
  
  search(event: Event): void {
    const input = event.target as HTMLInputElement;
    const filter = input.value.toUpperCase();
    const table = document.querySelector("table");
    if (table) {
      const tr = table.getElementsByTagName("tr");
      for (let i = 1; i < tr.length; i++) {  // Start from 1 to skip the header row
        const tds = tr[i].getElementsByTagName("td");
        let show = false;
        for (let j = 0; j < tds.length - 1; j++) {  // Skip the last column (actions)
          const td = tds[j];
          if (td) {
            const txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
              show = true;
              break;
            }
          }
        }
        tr[i].style.display = show ? "" : "none";
      }
    }
  }

  toggleModalres() {
    this.showModal = !this.showModal;
  }

  setCurrentDate(): void {
    this.createReservation.dateres = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');
  }

  calculateTotalPrice(): void {
    if (this.createReservation.datearr && this.createReservation.datedep) {
      const startDate = new Date(this.createReservation.datearr);
      const endDate = new Date(this.createReservation.datedep);
  
      if (this.createReservation.dateres === this.createReservation.datearr) {
        this.createReservation.etat = 'Confirmée';
      } else if (this.createReservation.dateres && new Date(this.createReservation.dateres) < new Date(startDate)) {
        this.createReservation.etat = 'En attente';
      } else {
        this.createReservation.etat = '' ;  // Ou une valeur par défaut si nécessaire
      }
      
  
      const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  
      const prixRes = parseFloat(this.createReservation.prixres || '0');
      const avance = parseFloat(this.createReservation.avance || '0');
  
      if (!isNaN(prixRes) && !isNaN(avance)) {
        this.createReservation.prixtotal = ((prixRes * days) - avance).toFixed(2);
      }
    }
  }

  updateTotalRoomPrice() {
    let totalPrice = 0;
    if (this.createReservation.numch) {  // Ensure numch is defined
      for (const roomNum of this.createReservation.numch) {
        const room = this.chambreData.find(chambre => chambre.numch === roomNum);
        if (room && typeof room.prix === 'number') {  // Check if prix is a number
          totalPrice += room.prix;
        }
      }
    }
    this.createReservation.prixres = totalPrice.toFixed(2);
    this.calculateTotalPrice(); // Recalculate the total price including the reservation dates
  }

  onRoomCheckboxChange(event: any, room: string) {
    if (!this.createReservation.numch) {
      this.createReservation.numch = [];
    }
    if (event.target.checked) {
      this.createReservation.numch.push(room);
    } else {
      const index = this.createReservation.numch.indexOf(room);
      if (index > -1) {
        this.createReservation.numch.splice(index, 1);
      }
    }
    this.updateTotalRoomPrice();
  }

  chambreData: Chambre[] = [];
  totalRooms: number = 0;
  roomGroups: string[][] = []; 
  IdcliData: Client[] = [];

  showNumch() {
    this.clientService.getAll().subscribe((res: any) => {
      console.log(res, "res==>");
      this.IdcliData = res.data;
      if (this.IdcliData.length > 0) {
        this.createReservation.idcli = this.IdcliData[0].idcli;
      }
    });
  }

  chunkArrayNumch(arr: any[], size: number) {
    let result = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    return result;
  }
  
  chunkArray(array: string[], chunkSize: number): string[][] {
    const result: string[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      result.push(array.slice(i, i + chunkSize));
    }
    return result;
  }

  showChambre() {
    this.chambreService.getAll().subscribe((res: any) => {
      console.log(res, "res==>");
      this.chambreData = res.data;
      this.roomGroups = this.chunkArray(this.chambreData.map(chambre => chambre.numch || ''), 5);
      this.totalRooms = this.chambreData.length;
    });
  }

  selectedReservation: Reservation | null = null;

  selectReservation(reservation: Reservation) {
    this.selectedReservation = reservation;
  }

  generatePDF(reservation: Reservation) {
    this.clientService.getClientById(reservation.idcli).subscribe((client: Client) => {
      const doc = new jsPDF();
      const logoUrl = 'assets/image/logo_karibo.png';
      const logoWidth = 40;
      const logoHeight = 20;
      doc.addImage(logoUrl, 'PNG', 15, 15, logoWidth, logoHeight);
  
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`Invoice ID: ${reservation.idres}`, 15, 60);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, 60);
      doc.text(`Invoice: ${reservation.etat}`, 15, 70);
  
      doc.text(`Name: ${client.nomcli}`, 15, 80);
      doc.text(`Contact: ${client.contact}`, 15, 90);
      doc.text(`Nationality: ${client.nationalite}`, 15, 100);
  
      (doc as any).autoTable({
        startY: 116,
        head: [['Room Number', 'Reservation Date', 'Arrival Date', 'Departure Date', 'Advance Paid', 'Price per Day', 'Total Price']],
        body: [
          [
            reservation.numch,
            reservation.dateres,
            reservation.datearr,
            reservation.datedep,
            reservation.avance,
            reservation.prixres,
            reservation.prixtotal
          ]
        ],
        theme: 'grid',
        headStyles: { fillColor: [53, 53, 116] },
        alternateRowStyles: { fillColor: [240, 240, 240] },
        margin: { top: 140 },
      });
  
      const pdfData = doc.output('blob');
      const pdfFile = new File([pdfData], `${client.nomcli}_invoice_N${reservation.idres}.pdf`, { type: 'application/pdf' });
      const url = URL.createObjectURL(pdfFile);
      const downloadLink = document.createElement('a');
      downloadLink.href = url;
      downloadLink.download = `${client.nomcli}_invoice_N${reservation.idres}.pdf`;
      downloadLink.click();
      URL.revokeObjectURL(url);
  
      Swal.fire('Success', 'PDF generated and downloaded successfully', 'success');
    });
  }
}
