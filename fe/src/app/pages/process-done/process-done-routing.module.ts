import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListProcessDoneComponent } from './list-step-done/list-process-done.component';



const routes: Routes = [
    {
        path: '',
        component: ListProcessDoneComponent
    }
    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProcessDoneRoutingModule { }
