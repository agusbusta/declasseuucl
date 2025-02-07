import {Component, ViewEncapsulation, Renderer2} from '@angular/core';
import {
  NzModalComponent,
  NzModalContentDirective,
  NzModalFooterDirective,
  NzModalService,
  NzModalTitleDirective
} from "ng-zorro-antd/modal";

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    NzModalComponent,
    NzModalContentDirective,
    NzModalFooterDirective,
    NzModalTitleDirective
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  providers: [NzModalService],
  encapsulation: ViewEncapsulation.None
})
export class FooterComponent {
  isVisibleFOIA = false;
  isVisibleGuia = false;

  constructor(private renderer: Renderer2) {}

  handleOk() {
    this.isVisibleFOIA = false;
    this.isVisibleGuia = false;
  }

  openLink(url: string) {
    const a = this.renderer.createElement('a');
    a.href = url;
    a.target = '_blank'; // Abre en una nueva pestaña
    this.renderer.appendChild(document.body, a);
    a.click();
    this.renderer.removeChild(document.body, a);
  }

  reportarFallas() {
    window.open('https://docs.google.com/forms/d/e/1FAIpQLSf_Wh_APyVImj-XNEyyd_xJh1etnpMgc5lo0eD-GKQgjVLhXw/viewform', '_blank');
  }
}
