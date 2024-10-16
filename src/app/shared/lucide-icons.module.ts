import { NgModule } from '@angular/core';
import { LucideAngularModule, Copy, Share } from 'lucide-angular';

@NgModule({
  imports: [LucideAngularModule.pick({ Copy, Share })],
  exports: [LucideAngularModule]
})
export class LucideIconsModule { }
