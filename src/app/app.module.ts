import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { MenuitemComponent } from './_shared/layout/menuitem/menuitem.component';
import { ProfilemenuComponent } from './_shared/layout/profilemenu/profilemenu.component';
import { BreadcrumbComponent } from './_shared/layout/breadcrumb/breadcrumb.component';
import { MenuComponent } from './_shared/layout/menu/menu.component';
import { SidebarComponent } from './_shared/layout/sidebar/sidebar.component';
import { LayoutComponent } from './_shared/layout/layout/layout.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TopbarComponent } from './_shared/layout/topbar/topbar.component';
import { SharedModule } from './_shared/modules/shared/shared.module';
import { NotfoundComponent } from './_shared/layout/notfound/notfound.component';
import { LoginModule } from './components/login/login.module';
import { RegistrarUsuarioModule } from './components/registrar-usuario/registrar-usuario.module';
import { ActivaCuentaModule } from './components/activa-cuenta/activa-cuenta.module';
import { SidenavModule } from './components/sidenav/sidenav.module';
import { DashboardModule } from './components/dashboard/dashboard.module';
import { PrimengModule } from './primeng.module';
import { CargarModule } from './components/cargar/cargar.module';
import { AnalizarModule } from './components/analizar/analizar.module';
import { ResultadosModule } from './components/resultados/resultados.module';
import { ReporteModule } from './components/reporte/reporte.module';
import { ProgramarModule } from './components/programar/programar.module';
import { ParametrosModule } from './components/parametros/parametro.module';
import { AsignacionesModule } from './components/asignacion/asignacion.module';
import { CargarPlantillasModule } from './components/cargar-plantillas/cargar-plantillas.module';
import { PagprincipalModule } from './pages/inicio/pagprincipal/pagprincipal.module';
import { NotpermisosComponent } from './_shared/layout/notpermisos/notpermisos.component';
import { HttpErrorInterceptor } from '../app/services/cors/inteerseptor.servise';
import { CorsService } from '../app/services/cors/cors.service';
import { SpeechAnalyticsModule } from './components/speech-analytics/speech-analytics.module';
import { DashUsuariosComponent } from './components/usuarios/dash-usuarios/dash-usuarios.component';
import { VerifyComponent } from './components/verify/verify.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ZingchartAngularModule } from 'zingchart-angular';

@NgModule({
  declarations: [
    AppComponent,
    TopbarComponent,
    LayoutComponent,
    SidebarComponent,
    MenuComponent,
    BreadcrumbComponent,
    ProfilemenuComponent,
    MenuitemComponent,
    NotfoundComponent,
    NotpermisosComponent,
    DashUsuariosComponent,
    VerifyComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    PrimengModule,
    AppRoutingModule,
    SharedModule,
    RouterModule,
    HttpClientModule,
    LoginModule,
    RegistrarUsuarioModule,
    ActivaCuentaModule,
    SidenavModule,
    DashboardModule,
    CargarModule,
    AnalizarModule,
    ResultadosModule,
    ReporteModule,
    ProgramarModule,
    ParametrosModule,
    AsignacionesModule,
    CargarPlantillasModule,
    PagprincipalModule,
    SpeechAnalyticsModule,
    ReactiveFormsModule,
    ZingchartAngularModule
  ],
  providers: [
    CorsService,
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
