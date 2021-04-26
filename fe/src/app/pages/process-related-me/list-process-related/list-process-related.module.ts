import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListProcessRelatedComponent } from './list-process-related.component';
import { NbButtonModule, NbCardModule, NbFormFieldModule, NbIconModule, NbInputModule } from '@nebular/theme';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ThemeModule } from '../../../@theme/theme.module';



@NgModule({
  declarations: [ListProcessRelatedComponent],
  imports: [
    CommonModule,
    NbCardModule,
    NbIconModule,
    NbInputModule,
    ThemeModule,
    NbButtonModule,
    NgxDatatableModule,
    NbFormFieldModule
  ],
  exports:[ListProcessRelatedComponent]
})
export class ListProcessRelatedModule { }
