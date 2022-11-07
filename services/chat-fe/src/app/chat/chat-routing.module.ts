import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChannelsComponent } from './channels/channels.component';
import { ChatComponent } from './chat/chat.component';

const routes: Routes = [
  { path: 'channels', component: ChannelsComponent },
  { path: 'channel/:channelId', component: ChatComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChatRoutingModule { }
