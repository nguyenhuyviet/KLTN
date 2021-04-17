import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StepSettingDetailComponent } from './step-setting-detail.component';
import { FormsModule } from '@angular/forms';
import { AssigneeSettingComponent } from './assignee-setting/assignee-setting.component';
import { FieldSettingComponent } from './field-setting/field-setting.component';
import { TaskSettingComponent } from './task-setting/task-setting.component';
import { NbButtonModule, NbCardModule, NbCheckboxModule, NbFormFieldModule, NbIconModule, NbInputModule, NbSelectModule, NbToggleModule } from '@nebular/theme';
import { ThemeModule } from '../../../../@theme/theme.module';
import { FormAddFieldComponent } from './field-setting/form-add-field/form-add-field.component';
import { FieldViewModule } from '../../../../shared/components/field-view/field-view.module';



@NgModule({
  declarations: [StepSettingDetailComponent,AssigneeSettingComponent, TaskSettingComponent, FieldSettingComponent, FormAddFieldComponent],
  imports: [
    CommonModule,
    FormsModule,
    NbButtonModule, 
    NbSelectModule,
    NbInputModule,
    NbToggleModule,
    NbCardModule,
    NbIconModule,
    NbFormFieldModule,
    ThemeModule,
    FieldViewModule,
    NbCheckboxModule
  ],
  exports: [StepSettingDetailComponent]
})
export class StepSettingDetailModule { }
