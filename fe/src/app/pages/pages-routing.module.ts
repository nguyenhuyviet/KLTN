import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { ECommerceComponent } from './e-commerce/e-commerce.component';
import { NotFoundComponent } from './miscellaneous/not-found/not-found.component';
import { ProcessExecutionComponent } from './process-execution/process-execution.component';
import { AuthGuard } from '../_helpers';
import { Role } from '../enums/role.enum';
import { UserSettingComponent } from './user-setting/user-setting.component';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  canActivate: [AuthGuard],

  children: [
    {
      path: 'dashboard',
      component: ECommerceComponent,
    },
    {
      path: 'process',
      loadChildren: () => import('./process-setting/process.module')
        .then(m => m.ProcessModule),
      data: { roles: [Role.CBQL] }

    },
    {
      path: 'process-execution',
      component: ProcessExecutionComponent
    },
    {
      path: 'process-related',
      loadChildren: () => import('./process-related-me/process-related-me.module')
        .then(m => m.ProcessRelatedMeModule),
    },
    {
      path: 'process-done',
      loadChildren: () => import('./process-done/process-done.module')
        .then(m => m.ProcessDoneModule),
    }, 
    {
      path: 'process-group',
      loadChildren: () => import('./process-group/process-group.module')
        .then(m => m.ProcessGroupModule),
      canActivate: [AuthGuard],
      data: { roles: [Role.CBQL] }
    },
    {
      path: 'process-statistic',
      loadChildren: () => import('./report-statistic/report-statistic.module')
        .then(m => m.ReportStatisticModule),
      canActivate: [AuthGuard],
      data: { roles: [Role.CBQL] }
    },
    {
      path: 'user-group',
      loadChildren: () => import('./user-group/user-group.module')
        .then(m => m.UserGroupModule),
    },
    {
      path: 'user-setting',
      component: UserSettingComponent
    },
    {
      path: 'process-done',
      loadChildren: () => import('./process-done/process-done.module')
        .then(m => m.ProcessDoneModule),
    },
    {
      path: 'layout',
      loadChildren: () => import('./layout/layout.module')
        .then(m => m.LayoutModule),
    },
    {
      path: 'forms',
      loadChildren: () => import('./forms/forms.module')
        .then(m => m.FormsModule),
    },
    {
      path: 'ui-features',
      loadChildren: () => import('./ui-features/ui-features.module')
        .then(m => m.UiFeaturesModule),
    },
    {
      path: 'modal-overlays',
      loadChildren: () => import('./modal-overlays/modal-overlays.module')
        .then(m => m.ModalOverlaysModule),
    },
    {
      path: 'extra-components',
      loadChildren: () => import('./extra-components/extra-components.module')
        .then(m => m.ExtraComponentsModule),
    },
    {
      path: 'maps',
      loadChildren: () => import('./maps/maps.module')
        .then(m => m.MapsModule),
    },
    {
      path: 'charts',
      loadChildren: () => import('./charts/charts.module')
        .then(m => m.ChartsModule),
    },
    {
      path: 'editors',
      loadChildren: () => import('./editors/editors.module')
        .then(m => m.EditorsModule),
    },
    {
      path: 'tables',
      loadChildren: () => import('./tables/tables.module')
        .then(m => m.TablesModule),
    },
    {
      path: 'miscellaneous',
      loadChildren: () => import('./miscellaneous/miscellaneous.module')
        .then(m => m.MiscellaneousModule),
    },
    {
      path: '',
      redirectTo: 'process-execution',
      pathMatch: 'full',
    },
    {
      path: '**',
      component: NotFoundComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
