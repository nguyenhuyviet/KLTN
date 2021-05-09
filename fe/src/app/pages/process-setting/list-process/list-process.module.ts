import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListProcessComponent } from './list-process.component';
import { NbButtonModule, NbCardModule, NbFormFieldModule, NbIconModule, NbInputModule } from '@nebular/theme';
import { ThemeModule } from '../../../@theme/theme.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ProcessSetupModule } from '../../../shared/components/process-setup/process-setup.module';



@NgModule({ 
  declarations: [ListProcessComponent],
  imports: [
    CommonModule,
    NbCardModule,
    NbIconModule,
    NbInputModule,
    ThemeModule,
    NbButtonModule,
    NgxDatatableModule,
    NbFormFieldModule,
    ProcessSetupModule
  ],
})
export class ListProcessModule { }
