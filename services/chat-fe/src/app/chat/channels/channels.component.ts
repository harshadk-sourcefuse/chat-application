import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiConstants } from 'src/app/shared/constants';
import { ChatService } from 'src/app/shared/services/chat-service/chat.service';

@Component({
  selector: 'app-channels',
  templateUrl: './channels.component.html',
  styleUrls: ['./channels.component.css']
})
export class ChannelsComponent implements OnInit {

  users: any;
  constructor(public chatService: ChatService, private router: Router) { }

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers() {
    this.chatService.get(ApiConstants.USERS).subscribe((res: any) => {
      this.users = res;
    });
  }
  redirectToChat(user: any) {
    this.chatService.setMessagingUser(user.id, user);
    this.router.navigate(['/chat/channel', user.id]);
  }
}
