import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StepSettingComponent } from './step-setting.component';
import { NbCardModule, NbIconModule, NbInputModule, NbButtonModule, NbFormFieldModule, NbButtonGroupModule, NbCheckboxModule, NbSpinnerModule } from '@nebular/theme';
import { ThemeModule } from '../../../@theme/theme.module';
import { FormsModule } from '@angular/forms';
import { StepSettingDetailModule } from './step-setting-detail/step-setting-detail.module';



@NgModule({
  declarations: [StepSettingComponent],
  imports: [
    CommonModule,
    NbCardModule,
    NbIconModule,
    NbInputModule,
    ThemeModule,
    NbButtonModule,
    NbFormFieldModule,
    FormsModule,
    NbButtonGroupModule,
    StepSettingDetailModule,
    NbCheckboxModule,
    NbSpinnerModule
  ]
})
export class StepSettingModule { }
