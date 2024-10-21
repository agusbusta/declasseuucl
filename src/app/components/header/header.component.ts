import {NzDateMode, NzDatePickerComponent} from "ng-zorro-antd/date-picker";
import {FormsModule} from "@angular/forms";
import {NgClass, NgIf} from "@angular/common";
import {Component, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';
import {Router, RouterModule} from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    NzDatePickerComponent,
    FormsModule,
    NgIf,
    NgClass,
    RouterModule
  ],
  templateUrl: './header.component.html', // Verifica que esta ruta sea correcta
  styleUrls: ['./header.component.scss'], // Verifica que esta ruta sea correcta
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent {

  @Input() isVisible:boolean = true;

  @Input() textToSearch = "";
  minDate: Date = new Date(1968, 0, 1);
  maxDate: Date = new Date(1991, 11, 31);
  @Input() desde = new Date(1968, 0, 1);
  @Input() hasta = new Date(1991, 11, 31);


  @Output() searchEvent = new EventEmitter<{ desde: any, hasta: any, textToSearch: any }>();

  desdePlaceholder: string | string[] = 'Desde';
  hastaPlaceholder: string | string[] = 'Hasta';


  disabledDateDesde = (current: Date): boolean => {
    return current < this.minDate || current > this.maxDate || current > this.hasta;
  };

  disabledDateHasta = (current: Date): boolean => {
    return current < this.minDate || current > this.maxDate || current < this.desde;
  };

  buscar() {
    const searchData = {
      desde: this.desde,
      hasta: this.hasta,
      textToSearch: this.textToSearch
    };
    this.searchEvent.emit(searchData);
  }

  constructor(private router: Router) { }

  navigateToHome() {
    this.router.navigate(['/']);
    this.clearSearch();
  }

  clearSearch() {
    this.textToSearch = "";
    this.desde = new Date(1968, 0, 1);
    this.hasta = new Date(1991, 11, 31);
    // Emitir el evento de búsqueda con los valores limpiados
    this.buscar();
  }

}
