import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListProcessGroupComponent } from './list-process-group/list-process-group.component';
import { ProcessGroupDetailComponent } from './process-group-detail/process-group-detail.component';

const routes: Routes = [
  {
    path: '',
    component: ListProcessGroupComponent
  },
  {
    path: ':id',
    component: ProcessGroupDetailComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProcessGroupRoutingModule { }
