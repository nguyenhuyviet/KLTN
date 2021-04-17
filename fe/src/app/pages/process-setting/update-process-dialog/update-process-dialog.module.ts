import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UpdateProcessDialogComponent } from './update-process-dialog.component';
import { ProcessSetupModule } from '../../../shared/components/process-setup/process-setup.module';
import { NbCardModule } from '@nebular/theme';



@NgModule({
  declarations: [UpdateProcessDialogComponent],
  imports: [
    CommonModule,
    ProcessSetupModule,
    NbCardModule, 
  ],
  exports: [UpdateProcessDialogComponent]
})
export class UpdateProcessDialogModule { }
