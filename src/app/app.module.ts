import {BrowserModule, DomSanitizer} from '@angular/platform-browser';
import {NgModule, NO_ERRORS_SCHEMA, Pipe, PipeTransform} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {MDBBootstrapModule} from 'angular-bootstrap-md';
import {BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';
import {NguiAutoCompleteModule} from '@ngui/auto-complete';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';

import {EmbedVideo} from 'ngx-embed-video';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatStepperModule} from '@angular/material/stepper';
import {MatTabsModule} from '@angular/material/tabs';
import {MatTableModule} from '@angular/material/table';
import {MatChipsModule} from '@angular/material/chips';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatListModule} from '@angular/material/list';
import {MatCardModule} from '@angular/material/card';
import {MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule, MatSelectModule} from '@angular/material';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {ImageUploadModule} from 'angular2-image-upload';
import {MatRadioModule} from '@angular/material/radio';
import {ConfirmationPopoverModule} from 'angular-confirmation-popover';
import {MatIconModule} from '@angular/material/icon';
import {NgxCarouselModule} from 'ngx-carousel';
import {NgxGalleryModule} from 'ngx-gallery';
import {MatSidenavModule} from '@angular/material/sidenav';
import {AgmCoreModule} from '@agm/core';
import {ToastModule} from 'ng2-toastr/ng2-toastr';
import {NgxTwitterTimelineModule} from 'ngx-twitter-timeline';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {NgxEditorModule} from 'ngx-editor';
import {ImageCropperModule} from 'ngx-image-cropper';
import {StorageServiceModule} from 'angular-webstorage-service';
import {SlugifyPipe} from './slugify.pipe';

import {AppComponent} from './app.component';
import {HomeComponent} from './home.component';
import {PropertyComponent} from './property.component';
import {PropertyService} from './property.service';
import {LoginService} from './login.service';
import {AppRoutingModule} from './/app-routing.module';
import {MessagesComponent} from './messages/messages.component';
import {MessageService} from './message.service';
import {InquiryService} from './inquiry.service';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {AdminComponent, UpdateDialog} from './admin/admin.component';
import {TruncatePipe} from './truncatePipe';
import {PropertyDetailsComponent} from './property-details/property-details.component';
import {InquiryComponent} from './inquiry/inquiry.component';
import {NewdevelopmentComponent} from './newdevelopment/newdevelopment.component';
import {UploadFileService} from './upload-file.service';
import {AddpropertyComponent} from './addproperty/addproperty.component';
import {UpdatepropertyComponent} from './updateproperty/updateproperty.component';
import {LoginComponent} from './login/login.component';
import {AuthInterceptor} from './auth-interceptor';

@Pipe({name: 'safe'})
export class SafePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {
  }

  transform(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}

@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    AppRoutingModule,
    MDBBootstrapModule.forRoot(),
    BrowserAnimationsModule,
    NoopAnimationsModule,
    NguiAutoCompleteModule,
    HttpClientModule,
//    SidebarModule.forRoot(),
    MatCheckboxModule,
    MatTabsModule,
    MatTableModule,
    MatPaginatorModule,
     MatMenuModule,
    MatButtonModule,
    MatExpansionModule,
    MatButtonToggleModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatListModule,
    MatToolbarModule,
    MatTooltipModule,
    MatStepperModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    ImageUploadModule.forRoot(),
    EmbedVideo.forRoot(),
    NgxGalleryModule,
    MatRadioModule,
    MatSidenavModule,
    NgxCarouselModule,
    ImageCropperModule,
    NgxEditorModule,
    StorageServiceModule,
     NgxTwitterTimelineModule.forRoot(),
     NgbModule.forRoot(),
	ToastModule.forRoot(),
     ConfirmationPopoverModule.forRoot({
      confirmButtonType: 'danger' // set defaults here
    }),
    AgmCoreModule.forRoot({
        apiKey: ''
    }) ],
  providers: [
      MessageService,
      PropertyService,
      UploadFileService,
      InquiryService,
    LoginService,
    //Title,
    {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
}
],
  declarations: [
    AppComponent,
    HomeComponent,
    PropertyComponent,
    MessagesComponent,
    AdminComponent,
    UpdateDialog,
    TruncatePipe,
    PropertyDetailsComponent,
    InquiryComponent,
    NewdevelopmentComponent,
    SafePipe,
    AddpropertyComponent,
    UpdatepropertyComponent,
    LoginComponent,
    SlugifyPipe
  ],
  entryComponents: [UpdateDialog],
  bootstrap: [AppComponent],
  schemas: [ NO_ERRORS_SCHEMA ]
})
export class AppModule { }
