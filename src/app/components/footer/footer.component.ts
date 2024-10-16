import {Component, ViewEncapsulation} from '@angular/core';
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
  isVisible = false;

  handleOk() {
    this.isVisible = false;
  }
}
