import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListProcessRelatedComponent } from './list-process-related/list-process-related.component';
import { StepHandleComponent } from './step-handle/step-handle.component';


const routes: Routes = [
    {
        path: '',
        component: ListProcessRelatedComponent
    },
    {
        path: 'handle/:processExecutionId',
        component: StepHandleComponent
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProcessRoutingModule { }
