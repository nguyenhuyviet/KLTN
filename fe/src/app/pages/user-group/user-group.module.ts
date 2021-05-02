import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserGroupComponent } from './user-group.component';
import { UserGroupRoutingModule } from './user-group-routing.module';
import { ListUserGroupModule } from './list-user-group/list-user-group.module';
import { FormsModule } from '@angular/forms';
import { NbCardModule, NbIconModule, NbInputModule, NbButtonModule, NbFormFieldModule, NbSelectModule, NbSpinnerModule, NbAccordionModule } from '@nebular/theme';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ThemeModule } from '../../@theme/theme.module';
import { UserGroupDetailComponent } from './user-group-detail/user-group-detail.component';



@NgModule({
  declarations: [UserGroupComponent,UserGroupDetailComponent],
  imports: [
    CommonModule,
    UserGroupRoutingModule,
    ListUserGroupModule,
    NbCardModule,
    NbIconModule,
    NbInputModule,
    ThemeModule,
    NbButtonModule,
    NgxDatatableModule,
    NbFormFieldModule,
    NbSelectModule,
    NbSpinnerModule,
    FormsModule,
    NbAccordionModule
  ]
})
export class UserGroupModule { }
