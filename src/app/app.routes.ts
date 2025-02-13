import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './features/layout/layout.component';
import { ContactDetailsComponent } from './features/components/contact-details/contact-details.component';
import { NgModule } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';

import { AddContactComponentComponent } from './features/components/add-contact-component/add-contact-component.component';

export const routes: Routes = [
    { path: '', component: LayoutComponent },
    { path: 'contacts-details', component: ContactDetailsComponent },
    { path: 'add-contact', component: AddContactComponentComponent },
];


@NgModule({
    imports: [RouterModule.forRoot(routes), NgSelectModule],
    exports: [RouterModule]
  })
  export class AppRoutingModule {}