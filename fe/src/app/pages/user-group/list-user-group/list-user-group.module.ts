import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListUserGroupComponent } from './list-user-group.component';
import { NbCardModule, NbIconModule, NbInputModule, NbButtonModule, NbFormFieldModule, NbAccordionModule, NbSelectModule, NbSpinnerModule } from '@nebular/theme';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ThemeModule } from '../../../@theme/theme.module';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [ListUserGroupComponent],
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
    NbAccordionModule
  ]
})
export class ListUserGroupModule { }
