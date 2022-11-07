
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PubNubAngular } from 'pubnub-angular2';
import { ApiConstants } from 'src/app/shared/constants';
import { Chat, ChatMessage } from 'src/app/shared/models/chat.model';
import { ChatService } from 'src/app/shared/services/chat-service/chat.service';
import { environment } from 'src/environments/environment';
import * as uuid from "uuid";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  public messages: ChatMessage[] = [];
  public sender: any;
  public channelId = '';
  public token = '';
  public inRoom = true;
  messagingUser: any;
  memberIds: string[] = [];

  constructor(
    private actRoute: ActivatedRoute,
    private router: Router,
    public readonly chatService: ChatService,
    private pubnub: PubNubAngular,
    private readonly toastr: ToastrService,
  ) {
    this.actRoute.params.subscribe((param: any) => {
      this.messagingUser = this.chatService.getMessagingUser(param.channelId);
      this.memberIds.push(param.channelId);
    });
  }

  ngOnInit(): void {
    console.log("__________ CHAT COMPONENT ____________", this.messagingUser)
    this.sender = this.chatService.getLoggedInUser();
    this.memberIds.push(this.sender.id);
    this.getChannel();
  }

  getChannel() {
    this.chatService.post(ApiConstants.GET_OR_CREATE_CHANNEL, { memberIds: this.memberIds }).subscribe({
      complete: () => {
      },
      next: (res: any) => {
        this.channelId = res.id;
        if (!this.channelId) {
          this.router.navigate(['/chat/channels']);
        }
        this.initPubnub();
        this.getMessages();
      },
      error: (error) => { this.toastr.error("Something went wrong while featching the channel", "FAILED"); },
    });
  }


  initPubnub() {
    this.pubnub.init({
      publishKey: environment.PUBNUB_PUBLISH_KEY,
      subscribeKey: environment.PUBNUB_SUBSCRIBE_KEY,
      uuid: environment.PUBNUB_UUID,
      secretKey: environment.PUBNUB_SECRET_KEY,
    });
  }


  leaveRoom() {
    this.messages = [];
    try {
      this.pubnub.unsubscribe(this.channelId);
    } catch (error) {
      console.log(error);
    }
    this.inRoom = false;
  }

  getMessages() {
    this.inRoom = true;
    this.chatService.get(ApiConstants.MESSAGES, {
      ChannelID: this.channelId,
    }).subscribe((data: any) => {
      this.messages = [];
      for (const d of data) {
        const temp: ChatMessage = {
          body: d.body,
          subject: d.subject,
          channelType: '0',
          reply: false,
          sender: this.messagingUser.firstName + " " + this.messagingUser.lastName,
        };
        if (d.createdBy === this.sender.userTenantId) {
          temp.sender = "Me";
          temp.reply = true;
        }
        this.messages.push(temp);
      }
    });

    this.subcribeToNotifications();
  }

  subcribeToNotifications() {
    this.pubnub.subscribe({
      channels: [this.channelId],
      triggerEvents: ['message'],
    });

    this.pubnub.getMessage(this.channelId, msg => {
      const receivedMessage: ChatMessage = {
        body: msg.message.description,
        subject: msg.message.title,
        reply: false,
        sender: this.messagingUser.firstName + " " + this.messagingUser.lastName,
      };
      console.log(msg);
      if (msg.message.title !== this.sender.id) {
        this.messages.push(receivedMessage);
        this.toastr.info(
          `New message from sender: ${msg.message.description}`,
        );
      }
    });
  }

  sendMessage(event: { message: string }) {
    if (!this.inRoom) {
      return;
    }
    const chatMessage: ChatMessage = {
      body: event.message,
      subject: 'new message',
      toUserId: this.channelId,
      channelId: this.channelId,
      channelType: '0',
      reply: true,
      sender: "Me",
    };

    const dbMessage: Chat = {
      body: event.message,
      subject: this.sender.id,
      toUserId: this.channelId,
      channelId: this.channelId,
      channelType: '0',
    };

    this.chatService.post(ApiConstants.MESSAGES, dbMessage).subscribe({
      complete: () => { this.messages.push(chatMessage) },
      next: (res: any) => { },
      error: (error: any) => {
        console.log(error)
        this.toastr.error("Failed to send message", "Error");
      }

    });
  }

  ngOnDestroy() {
    console.log("Distroyed");
    this.leaveRoom();
  }
}
