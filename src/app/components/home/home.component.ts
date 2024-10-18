import { Component, HostListener, OnInit, PLATFORM_ID, Inject} from '@angular/core';
import {HeaderComponent} from "../header/header.component";
import {FooterComponent} from "../footer/footer.component";
import {NzPaginationComponent} from "ng-zorro-antd/pagination";
import { NgClass, NgForOf, NgIf } from "@angular/common";
import {DocumentsService} from "../../services/documents.service";
import {Document} from "../../model/document.model";
import { Clipboard } from '@angular/cdk/clipboard';
import { HttpClient } from '@angular/common/http';
import {NzDatePickerComponent} from "ng-zorro-antd/date-picker";
import {FormsModule} from "@angular/forms";
import {NzSpinComponent} from "ng-zorro-antd/spin";
import {ActivatedRoute, Router} from "@angular/router";
import { isPlatformBrowser } from '@angular/common';
import {LucideIconsModule} from "../../shared/lucide-icons.module";
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    NzPaginationComponent,
    NgIf,
    NgForOf,
    NgClass,
    NzDatePickerComponent,
    FormsModule,
    NzSpinComponent,
    LucideIconsModule,

  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  showHeader: boolean = true;
  documents: Document[] = [];
  pageSize:number=10;

  totalDocuments = 0;
  detailDocument: any;
  documentId = undefined;

  basePath = 'https://declasseuucl.vercel.app';

  currentPage: number=1;
  search: any = "";
  from: string = "01-01-1968";
  to: string = "31-12-1991";
  isLoading: boolean = true;
  isMobile = false;
  isBrowser: boolean;
  isSearchResult: boolean = false;
  headerTitle: string = 'Archivos más visitados'; // Título por defecto
  originalHeaderTitle: string = this.headerTitle; // Título original

  constructor(private documentsService : DocumentsService,
              private clipboard: Clipboard,
              private http: HttpClient,
              private route: ActivatedRoute,
              private router: Router,
              private viewportScroller: ViewportScroller,
              @Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: { target: { innerWidth: number; }; }) {
    if (this.isBrowser) {
      this.checkIfMobile(event.target.innerWidth);
    }
  }


  ngOnInit(): void {
    if (this.isBrowser) {
        this.checkIfMobile(window.innerWidth);
    }

    this.route.queryParams.subscribe(params => {
        this.currentPage = 1; // Siempre comenzamos en la primera página
        this.search = params['keyword'] || "";
        this.pageSize = 10; // Aseguramos que siempre sean 10 documentos

        this.from = params['from'] || this.from;
        this.to = params['to'] || this.to;

        this.documentId = params['documentId'];

        // Verificar si hay parámetros de búsqueda
        if (!params['keyword'] && !params['from'] && !params['to']) {
            this.isSearchResult = false; // No hay resultados de búsqueda
            this.headerTitle = 'Archivos más visitados'; // Título correcto
        } else {
            this.isSearchResult = true; // Hay resultados de búsqueda
            this.headerTitle = 'Resultados de la búsqueda'; // Título de búsqueda
        }

        // Obtener los documentos de la primera página
        this.documentsService.getDocuments(this.getUrl())
            .subscribe(response => {
                this.isLoading = false;
                // @ts-ignore
                this.documents = response.content;
                // @ts-ignore
                this.totalDocuments = response.totalElements;

                if (this.documentId) {
                    this.loadDocumentDetail(this.documentId);
                }
            });
    });
  }
  

  loadDocumentDetail(documentId: number) {
    this.isLoading = true; // Iniciar el estado de carga
    this.showHeader = false; // Ocultar el encabezado mientras se carga

    // Obtener los detalles del documento
    this.documentsService.getDetail(documentId).subscribe(response => {
        this.detailDocument = response;
        this.detailDocument.contentFormated = this.detailDocument.content.replace(/\r\n/g, '<br><br>');
        this.detailDocument.traductionFormated = this.detailDocument.traduction.replace(/\r\n|\n/g, function(match: string) {
            return match === '\r\n' ? '<br><br>' : '<br>';
        });
        this.isLoading = false; // Finalizar el estado de carga

        // Desplazar al inicio de la página
        if (isPlatformBrowser(this.platformId)) {
            setTimeout(() => {
                this.viewportScroller.scrollToPosition([0, 0]);
            });
        }
    }, error => {
        this.isLoading = false; // Finalizar el estado de carga en caso de error
        console.error('Error al obtener los detalles del documento', error);
    });
  }

  convertirTextoAFecha(textoFecha: string): Date {
    const [dia, mes, anio] = textoFecha.split('-').map(Number);
    return new Date(anio, mes - 1, dia); // el mes es de 0 a 11 en JavaScript Date
  }

  get fechaDesde(): Date {
    return this.convertirTextoAFecha(this.from);
  }

  get fechaHasta(): Date {
    return this.convertirTextoAFecha(this.to);
  }

  checkIfMobile(width: number) {
    this.isMobile = width < 768;
  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event: any) {
    // Evitar que el usuario vuelva atrás
    history.pushState(null, document.title, window.location.href);
    // Realizar las acciones necesarias, como mostrar el encabezado
    this.showHeader = true;
  }
  maxSubject(subject: string) {
    if(subject.length > 20) {
      return subject.substring(0,20) + "...";
    }
    return subject;
  }

  getDocumentImageUrl(document: Document) {
    return this.basePath + '/api/image/' + document.id;
  }

  onPageChange(pageIndex: number): void {

    const filter: any = {
      currentPage: pageIndex,
      size: this.pageSize,
      keyword: this.search,
      to: this.to,
      from: this.from
    }
    this.router.navigate(
      [''],
      { queryParams: filter }
    );
  }

  getUrl() {

    let url = `${this.basePath}/api/documents/search?page=${this.currentPage}&size=${this.pageSize}&keyword=${this.search ? this.search : ''}`;
    if(this.from) {
      url += '&startDate=' + this.from;
    }
    if(this.to) {
      url += '&endDate=' + this.to;
    }
    return url;
  }

  getDetail(documentId: number | undefined) {
    const filter: any = {
      currentPage: this.currentPage,
      size: this.pageSize,
      keyword: this.search,
      to: this.to,
      from: this.from,
      documentId: documentId
    }
    this.router.navigate(
      [''],
      { queryParams: filter }
    );
  }

  

  copyToClipboard(text: string) {
    this.clipboard.copy(text);
  }

  descargaOriginal(detailDocument: any) {
    const url =  `${this.basePath}/api/${detailDocument.id}/download/pdf`;
    this.isLoading = true;
    // Realizar la solicitud GET para descargar el archivo PDF
    this.http.get(url, { responseType: 'blob' }).subscribe((response: Blob) => {
      this.isLoading = false;
      // Crear un objeto Blob con la respuesta y descargarlo
      const blob = new Blob([response], { type: 'application/pdf' });
      const urlBlob = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = urlBlob;
      anchor.download =  detailDocument.name;
      anchor.click();
      window.URL.revokeObjectURL(urlBlob);
    }, error => {
      console.error('Error al descargar el archivo PDF', error);
    });
  }

  descargaTranscripcion(detailDocument: any) {
    const url = `${this.basePath}/api/${detailDocument.id}/transcription/pdf`;
    this.isLoading = true;
    // Realizar la solicitud GET para descargar el archivo PDF
    this.http.get(url, { responseType: 'blob' }).subscribe((response: Blob) => {
      this.isLoading = false;
      // Crear un objeto Blob con la respuesta y descargarlo
      const blob = new Blob([response], { type: 'application/pdf' });
      const urlBlob = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = urlBlob;
      anchor.download = 'transcribed_' + detailDocument.name;
      anchor.click();
      window.URL.revokeObjectURL(urlBlob);
    }, error => {
      console.error('Error al descargar el archivo PDF', error);
    });
  }

  onSearchPerformed(searchData: { desde: any, hasta: any, textToSearch: any }) {
    this.search = searchData.textToSearch;
    var agno = searchData.desde.getFullYear();
    var mes = ('0' + (searchData.desde.getMonth() + 1)).slice(-2); // Se agrega 1 porque los meses se indexan desde 0
    var dia = ('0' + searchData.desde.getDate()).slice(-2);
    this.from = dia + '-' + mes + '-' + agno;

    var agnoTo = searchData.hasta.getFullYear();
    var mesTo = ('0' + (searchData.hasta.getMonth() + 1)).slice(-2); // Se agrega 1 porque los meses se indexan desde 0
    var diaTo = ('0' + searchData.hasta.getDate()).slice(-2);
    this.to = diaTo + '-' + mesTo + '-' + agnoTo;




    this.isSearchResult = true;
    this.headerTitle = 'Resultados de la búsqueda';

    const filter: any = {
      currentPage: this.currentPage,
      size: this.pageSize,
      keyword: this.search,
      to: this.to,
      from: this.from
    }
    this.router.navigate(
      [''],
      { queryParams: filter }
    );
  }

  descargaTraduccion(detailDocument: any) {
    const url = `${this.basePath}/api/${detailDocument.id}/traduction/pdf`;
    this.isLoading = true;
    // Realizar la solicitud GET para descargar el archivo PDF
    this.http.get(url, { responseType: 'blob' }).subscribe((response: Blob) => {
      this.isLoading = false;
      // Crear un objeto Blob con la respuesta y descargarlo
      const blob = new Blob([response], { type: 'application/pdf' });
      const urlBlob = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = urlBlob;
      anchor.download = 'translate_' + detailDocument.name;
      anchor.click();
      window.URL.revokeObjectURL(urlBlob);
    }, error => {
      console.error('Error al descargar el archivo PDF', error);
    });
  }

  backToHome() {
    // Restablecer el estado del componente
    this.showHeader = true;
    this.isSearchResult = false; // Asegúrate de que esto esté en false
    this.headerTitle = 'Archivos más visitados'; // Restablecer el título

    // Restablecer los parámetros de búsqueda
    this.currentPage = 1; // Volver a la primera página
    this.search = ""; // Limpiar la búsqueda
    this.from = "01-01-1968"; // Restablecer la fecha de inicio
    this.to = "31-12-1991"; // Restablecer la fecha de fin

    // Navegar a la página de inicio
    this.router.navigate([''], { queryParams: { currentPage: this.currentPage, size: this.pageSize } });
  }

  shareOnWhatsApp() {
    if (isPlatformBrowser(this.platformId)) {
      const currentUrl = window.location.origin + window.location.pathname;
      const shareUrl = `${currentUrl}?documentId=${this.documentId}`;
      const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareUrl)}`;
      window.open(whatsappUrl, '_blank');
    }
  }

  copyToClipboardUrl() {
    if (isPlatformBrowser(this.platformId)) {
      const currentUrl = window.location.origin + window.location.pathname;
      const shareUrl = `${currentUrl}?documentId=${this.documentId}`;
      this.clipboard.copy(shareUrl);
      // Opcional: Mostrar un mensaje de éxito
      alert('URL copiada al portapapeles');
    }
  }
}