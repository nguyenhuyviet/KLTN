import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListProcessComponent } from './list-process/list-process.component';
import { ProcessSettingComponent } from './process-setting/process-setting.component';
import { StepSettingComponent } from './step-setting/step-setting.component';

const routes: Routes = [
  {
    path: '',
    component: ListProcessComponent
  },
  {
    path: 'create',
    component: ProcessSettingComponent
  },
  {
    path: 'stepSetting/:id', // processId
    component: StepSettingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProcessRoutingModule { }
