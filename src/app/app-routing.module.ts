import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './home.component';
import {PropertyComponent} from './property.component';
import {AdminComponent} from './admin/admin.component';
import {LoginComponent} from './login/login.component';
import {PropertyDetailsComponent} from './property-details/property-details.component';
import {NewdevelopmentComponent} from './newdevelopment/newdevelopment.component';
import {AddpropertyComponent} from './addproperty/addproperty.component';
import {UpdatepropertyComponent} from './updateproperty/updateproperty.component';

const routes: Routes = [
    {path: '', redirectTo: 'home', pathMatch: 'full'},
    {path: 'home', component: HomeComponent},
    {path: 'for-sale/:propTypeName/:cityName', component: PropertyComponent},
    {path: 'admin', component: AdminComponent},
    {path: 'property/:propTypeId', component: PropertyDetailsComponent},
    {path: 'for-sale/:type/:location/:propName/:propTypeId', component: PropertyDetailsComponent},
    {path: 'pre-sale/:type/:location/:propName/:propertyId', component: NewdevelopmentComponent},
    {path: 'development/:propertyId', component: NewdevelopmentComponent},
    {path: 'admin/addProperty', component: AddpropertyComponent},
    {path: 'admin/updateProperty/:propertyId', component: UpdatepropertyComponent},
    {path: 'login', component: LoginComponent}
];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
})
export class AppRoutingModule {

}
