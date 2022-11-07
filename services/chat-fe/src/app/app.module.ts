import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { LoginSignupComponent } from './auth/login-signup/login-signup.component';
import { ChatService } from './shared/services/chat-service/chat.service';
import {PubNubAngular} from 'pubnub-angular2';
import { VerifyComponent } from './auth/verify/verify.component';
import { NbButtonModule, NbCardModule, NbFormFieldModule, NbIconModule, NbInputModule, NbLayoutModule, NbThemeModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';


@NgModule({
  declarations: [
    AppComponent,
    LoginSignupComponent,
    VerifyComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NbThemeModule.forRoot({name: 'dark'}),
    NbInputModule,
    NbIconModule,
    NbButtonModule,
    NbEvaIconsModule,
    NbFormFieldModule,
    NbCardModule,
    NbLayoutModule,
    ToastrModule.forRoot(),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [ChatService, PubNubAngular],
  bootstrap: [AppComponent]
})
export class AppModule { }
