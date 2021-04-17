import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProcessSettingComponent } from './process-setting.component';
import { ProcessSetupModule } from '../../../shared/components/process-setup/process-setup.module';



@NgModule({
  declarations: [ProcessSettingComponent],
  imports: [
    CommonModule,
    ProcessSetupModule
  ]
})
export class ProcessSettingModule { }
