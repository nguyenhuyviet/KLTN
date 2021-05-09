import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserSettingComponent } from './user-setting.component';
import { FormsModule } from '@angular/forms';
import { NbCardModule, NbIconModule, NbInputModule, NbButtonModule, NbFormFieldModule, NbSelectModule, NbSpinnerModule, NbAccordionModule, NbDatepicker, NbDatepickerModule } from '@nebular/theme';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ThemeModule } from '../../@theme/theme.module';



@NgModule({
  declarations: [UserSettingComponent],
  imports: [
    CommonModule,
    NbCardModule,
    NbIconModule,
    NbInputModule,
    ThemeModule,
    NbButtonModule,
    NgxDatatableModule,
    NbFormFieldModule,
    NbSelectModule,
    NbSpinnerModule,
    FormsModule,
    NbAccordionModule,
    NbDatepickerModule
  ]
})
export class UserSettingModule { }
