import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListProcessStatisticComponent } from './list-process-statistic/list-process-statistic.component';
import { ProcessStatisticDetailComponent } from './process-statistic-detail/process-statistic-detail.component';


const routes: Routes = [
  {
    path: '',
    component: ListProcessStatisticComponent
  },
  {
    path: ':id',
    component: ProcessStatisticDetailComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportStatisticRoutingModule { }
