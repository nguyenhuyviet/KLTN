import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProcessComponent } from './process.component';
import { ProcessRoutingModule } from './process-routing.module';
import { ListProcessModule } from './list-process/list-process.module';
import { ProcessSettingModule } from './process-setting/process-setting.module';
import { UpdateProcessDialogComponent } from './update-process-dialog/update-process-dialog.component';
import { UpdateProcessDialogModule } from './update-process-dialog/update-process-dialog.module';
import { StepSettingModule } from './step-setting/step-setting.module';



@NgModule({
  declarations: [ProcessComponent],
  imports: [
    CommonModule,
    ProcessRoutingModule,
    UpdateProcessDialogModule,
    
  ]
})
export class ProcessModule { }
