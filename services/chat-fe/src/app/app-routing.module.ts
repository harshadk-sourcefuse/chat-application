import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginSignupComponent } from './auth/login-signup/login-signup.component';
import { VerifyComponent } from './auth/verify/verify.component';
import { TokenGaurdGuard } from './shared/route-guard/token-gaurd.guard';

const routes: Routes = [
  { path: "login", component: LoginSignupComponent },
  { path: "", component: VerifyComponent },
  { path: "chat", loadChildren: () => import('./chat/chat.module').then(m => m.ChatModule), canActivate: [TokenGaurdGuard] },
  { path: "**", redirectTo: "/", pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
