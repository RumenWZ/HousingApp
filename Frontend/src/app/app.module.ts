import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule, } from '@angular/platform-browser/animations';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { environment } from 'src/app/environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { PropertyCardComponent } from './property/property-card/property-card.component';
import { PropertyListComponent } from './property/property-list/property-list.component';
import { HousingService } from './services/housing.service';
import { AddPropertyComponent } from './property/add-property/add-property.component';
import { PropertyDetailComponent } from './property/property-detail/property-detail.component';
import { UserLoginComponent } from './user/user-login/user-login.component';
import { UserRegisterComponent } from './user/user-register/user-register.component';
import { UserService } from './services/user.service';
import { AlertifyService } from './services/alertify.service';
import { AuthService } from './services/auth.service';
import { NgxGalleryModule } from '@kolkov/ngx-gallery';
import { FilterPipe,  } from './Pipes/filter.pipe';
import { SortPipe } from './Pipes/sort.pipe';
import { HttpErrorInterceptorService } from './services/httperror-interceptor.service';
import { TokenInterceptorService } from './services/token-interceptor.service';
import { MyProfileComponent } from './user/my-profile/my-profile.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ConfirmActionComponent } from './confirm-action/confirm-action.component';
import { MaterialModule } from './material/material.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ChangePasswordComponent } from './user/change-password/change-password.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { DocumentationComponent } from './documentation/documentation.component';
import { EditPropertyComponent } from './property/edit-property/edit-property.component';
import { PropertyOwnerGuard } from './guards/property-owner.guard';
import { UserPropertiesCountGuard } from './guards/user-properties-count.guard';
import { ScrollToMenuComponent } from './scroll-to-menu/scroll-to-menu.component';
import { NotLoggedInGuard } from './guards/not-logged-in.guard';
import { LoggedInGuard } from './guards/logged-in.guard';
import { PropertyCardPreviewComponent } from './property/property-card-preview/property-card-preview.component';
import { PropertyCardSmallComponent } from './property/property-card-small/property-card-small.component';

const appRoutes: Routes = [
  {path: 'add-property', component: AddPropertyComponent, canActivate: [LoggedInGuard, UserPropertiesCountGuard]},
  {path: '', component: PropertyListComponent},
  {path: 'rent-property', component: PropertyListComponent},
  {path: 'property-detail/:id', component: PropertyDetailComponent},
  {path: 'edit-property/:id', component: EditPropertyComponent, canActivate: [LoggedInGuard, PropertyOwnerGuard]},
  {path: 'user/login', component: UserLoginComponent, canActivate: [NotLoggedInGuard]},
  {path: 'user/register', component: UserRegisterComponent, canActivate: [NotLoggedInGuard]},
  {path: 'user/my-profile', component: MyProfileComponent, canActivate: [LoggedInGuard]},
  {path: 'user/change-password', component: ChangePasswordComponent, canActivate: [LoggedInGuard]},
  {path: 'documentation', component: DocumentationComponent},
  {path: '**', component: PropertyListComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    PropertyCardComponent,
    PropertyListComponent,
    AddPropertyComponent,
    PropertyDetailComponent,
    UserLoginComponent,
    UserRegisterComponent,
    FilterPipe,
    SortPipe,
    MyProfileComponent,
    ConfirmActionComponent,
    ChangePasswordComponent,
    SidenavComponent,
    DocumentationComponent,
    EditPropertyComponent,
    ScrollToMenuComponent,
    PropertyCardPreviewComponent,
    PropertyCardSmallComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes),
    BrowserAnimationsModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    ButtonsModule.forRoot(),
    BsDatepickerModule.forRoot(),
    NgxGalleryModule,
    NgxPaginationModule,
    MaterialModule,
    DragDropModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptorService,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    },
    HousingService,
    UserService,
    AlertifyService,
    AuthService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
