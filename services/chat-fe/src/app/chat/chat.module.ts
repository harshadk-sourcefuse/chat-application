import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NbEvaIconsModule } from '@nebular/eva-icons';
import { NbCardModule, NbChatModule, NbLayoutModule, NbListModule, NbThemeModule, NbUserModule } from '@nebular/theme';
import { PubNubAngular } from 'pubnub-angular2';
import { ChannelsComponent } from './channels/channels.component';
import { ChatRoutingModule } from './chat-routing.module';
import { ChatComponent } from './chat/chat.component';


@NgModule({
  declarations: [
    ChannelsComponent, 
    ChatComponent
  ],
  imports: [
    CommonModule,
    ChatRoutingModule,
    NbLayoutModule,
    NbEvaIconsModule,
    NbChatModule,
    NbListModule,
    NbUserModule,
    NbCardModule
  ],
  providers: [PubNubAngular]

})
export class ChatModule { }
