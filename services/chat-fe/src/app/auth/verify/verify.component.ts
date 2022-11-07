import { Component, OnInit } from '@angular/core';
import { ChatService } from 'src/app/shared/services/chat-service/chat.service';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { PubNubAngular } from 'pubnub-angular2';
import { ApiConstants } from 'src/app/shared/constants';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.css']
})
export class VerifyComponent implements OnInit {

  constructor(private chatService: ChatService,
    private actRoute: ActivatedRoute, private router: Router) {
    this.actRoute.queryParams.subscribe((queryParams: any) => {
      var tokenInfo = this.chatService.getTokenInfo();
      console.log(this.router.url, queryParams, tokenInfo);
      if (!tokenInfo?.expires || tokenInfo?.expires < new Date().getTime()) {
        if (queryParams.code) {
          this.getToken(queryParams.code);
        } else {
          sessionStorage.clear();
          this.router.navigate(["/login"]);
        }
      } else {
        this.router.navigate(['/chat/channels'])
      }
    })
  }
  ngOnInit(): void {
  }

  getToken(code: string) {
    this.chatService.get(ApiConstants.AUTH_TOKEN, { code: code }).subscribe((res: any) => {
      this.chatService.setTokenInfo(res);
      this.getloggedInUser();
    });
  }

  getloggedInUser() {
    this.chatService.get(ApiConstants.GET_LOGGEDIN_USER).subscribe((data: any) => {
      this.chatService.setLoggedInUser(data);
      this.router.navigate(['/chat/channels']);
    });
  }
}