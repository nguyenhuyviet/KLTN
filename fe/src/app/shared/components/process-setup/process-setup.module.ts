import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProcessSetupComponent } from './process-setup.component';
import { NbCardModule, NbButtonModule, NbSelectModule, NbInputModule, NbSpinnerModule } from '@nebular/theme';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [ProcessSetupComponent],
  imports: [
    CommonModule,
    NbCardModule, 
    NbButtonModule, 
    NbSelectModule,
    NbInputModule,
    NbSpinnerModule,
    FormsModule
  ],
  exports: [ProcessSetupComponent]
})
export class ProcessSetupModule { }
