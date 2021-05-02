import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListUserGroupComponent } from './list-user-group/list-user-group.component';
import { UserGroupDetailComponent } from './user-group-detail/user-group-detail.component';


const routes: Routes = [
  {
    path: '',
    component: ListUserGroupComponent
  },
  {
    path: ':id',
    component: UserGroupDetailComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserGroupRoutingModule { }
