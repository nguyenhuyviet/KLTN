import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../_helpers';
import { ListProcessComponent } from './list-process/list-process.component';
import { ProcessSettingComponent } from './process-setting/process-setting.component';
import { StepSettingComponent } from './step-setting/step-setting.component';

const routes: Routes = [
  {
    path: '',
    component: ListProcessComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'create',
    canActivate: [AuthGuard],
    component: ProcessSettingComponent
  },
  {
    canActivate: [AuthGuard],
    path: 'stepSetting/:id', // processId
    component: StepSettingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProcessRoutingModule { }
