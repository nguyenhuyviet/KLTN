import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangePasswordComponent } from './change-password.component';
import { FormsModule } from '@angular/forms';
import { NbCardModule, NbButtonModule, NbSelectModule, NbInputModule, NbSpinnerModule } from '@nebular/theme';



@NgModule({
  declarations: [ChangePasswordComponent],
  imports: [
    CommonModule,
    NbCardModule, 
    NbButtonModule, 
    NbSelectModule,
    NbInputModule,
    NbSpinnerModule,
    FormsModule
  ],
  exports:[ChangePasswordComponent]
})
export class ChangePasswordModule { }
