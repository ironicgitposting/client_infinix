import { LOCALE_ID, NgModule } from '@angular/core';
import localeFr from '@angular/common/locales/fr';
import { registerLocaleData } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthenticationModule } from './authentication/authentication.module';
import { UsersListModule } from './users-list/usersList.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { DashboardModule } from './dashboard/dashboard.module';
import { HeaderModule } from './header/header.module';
import { SidebarModule } from './sidebar/sidebar.module';
import { VehiclesListModule } from './vehicles-list/vehicles-list.module';
import { LayoutModule } from './layout/layout.module';
import { LoanModule } from './loan/loan.module';
import { SiteModule } from './site/site.module';
import { SnackBarModule } from './snackbar/snackbar.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AdminPanelModule } from './admin-panel/adminPanel.module';
import { LoanModalModule } from './loan/loan-modal/loan-modal.module';
import { SiteModalModule } from './site/site-modal/site-modal.module';
import { HistoricalVehicleModule } from './vehicles-list/historical-vehicle-modal/historical-vehicle-modal.module';
import { VehicleModule } from './vehicles-list/vehicle-modal/vehicle-modal.module';
import { AuthInterceptor } from './authentication/auth.interceptor';


registerLocaleData(localeFr);

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AuthenticationModule,
    UsersListModule,
    BrowserAnimationsModule,
    HttpClientModule,
    DashboardModule,
    HeaderModule,
    SidebarModule,
    VehiclesListModule,
    LayoutModule,
    LoanModule,
    SiteModule,
    SnackBarModule,
    MatSnackBarModule,
    AdminPanelModule,
    LoanModalModule,
    SiteModalModule,
    HistoricalVehicleModule,
    VehicleModule
  ],
  providers: [{provide: LOCALE_ID, useValue: 'fr-FR' },
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}],
  bootstrap: [AppComponent],
})
export class AppModule {}
