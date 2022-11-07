import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiConstants } from 'src/app/shared/constants';
import { ChatService } from 'src/app/shared/services/chat-service/chat.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login-signup',
  templateUrl: './login-signup.component.html',
  styleUrls: ['./login-signup.component.css']
})
export class LoginSignupComponent implements OnInit {

  showPassword: Boolean = false;
  loginForm: FormGroup = new FormGroup({});

  constructor(private chatService: ChatService, private toastr: ToastrService, private router: Router) { }

  ngOnInit(): void {
    this.initFormGroup();
  }

  initFormGroup() {
    this.loginForm = new FormGroup({
      username: new FormControl("", [Validators.required]),
      password: new FormControl("", [Validators.required]),
      client_id: new FormControl(environment.CLIENT_ID, [Validators.required]),
      client_secret: new FormControl(environment.CLIENT_SECRET, [Validators.required]),
    });
  }

  loginOrSignup() {
    // this.chatService.get(ApiConstants.LOGIN_SIGNUP, { client_id: environment.CLIENT_ID, client_secret: environment.CLIENT_SECRET })
    window.location.href = `${ApiConstants.LOGIN_SIGNUP}?client_id=${environment.CLIENT_ID}&client_secret=${environment.CLIENT_SECRET}`;
  }

  login() {
    this.loginForm.markAllAsTouched();
    this.loginForm.markAsDirty();
    if (this.loginForm.valid) {
      this.chatService.post(ApiConstants.LOGIN, this.loginForm.value).subscribe({
        complete: () => { },
        next: (res: any) => { this.router.navigate([''], { queryParams: res }) },
        error: (error: any) => {
          this.toastr.error(error.status == 401 ? "Invalid Credentials" : "Something went wrong");
        }
      })
    }
  }
}
