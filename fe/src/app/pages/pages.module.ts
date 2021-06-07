import { NgModule } from '@angular/core';
import { NbMenuModule } from '@nebular/theme';

import { ThemeModule } from '../@theme/theme.module';
import { PagesComponent } from './pages.component';
import { ECommerceModule } from './e-commerce/e-commerce.module';
import { PagesRoutingModule } from './pages-routing.module';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';
import { ProcessExecutionModule } from './process-execution/process-execution.module';
import { UserSettingModule } from './user-setting/user-setting.module';
import { ChangePasswordModule } from '../shared/components/change-password/change-password.module';

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    ECommerceModule,
    MiscellaneousModule,
    ProcessExecutionModule,
    UserSettingModule,
    ChangePasswordModule
  ],
  declarations: [
    PagesComponent,
  ],
})
export class PagesModule {
}
