import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { FormsModule } from '@angular/forms';
import { NbAlertModule, NbButtonModule, NbFormFieldModule, NbInputModule, NbSpinnerModule } from '@nebular/theme';



@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    FormsModule,
    NbAlertModule,
    NbInputModule,
    NbButtonModule,
    NbFormFieldModule,
    NbSpinnerModule
  ],
  exports:[LoginComponent]
})
export class LoginModule { }
