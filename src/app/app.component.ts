import {Component, OnDestroy, OnInit} from '@angular/core';
import {SocketService} from "./services/notificationsservice";
import {UserInformationService} from "./services/userinformationservice";
import {AppConstants} from "./utils/constants";
import {UserResponse, UserResponseBuilder} from "./models/userresponse";
import {AuthenticationService} from "./services/backendcalls/authenticationservice";
import {CustomerService} from "./services/backendcalls/customerservice";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = '2MuchWaste';

  constructor(
    private userInfoService: UserInformationService,
    private customerService:CustomerService
  ) {
  }

  ngOnInit(): void {
    // Restore information if user is logged
    // let userStored = localStorage.getItem(AppConstants.userObject)
    // if (userStored) this.restoreUser(userStored)
  }

  private restoreUser(userStored: string) {
    // console.log("Restoring user");
    // let user_ = JSON.parse(userStored) as UserResponse
    // let user = new UserResponseBuilder().build()
    // Object.assign(user, user_)
    // this.customerService.getCustomerByID(user._id).subscribe({
    //   next:(res)=>{
    //     console.log("Risposta da app component inizializzazione user");
    //     console.log(res)
    //     localStorage.setItem(AppConstants.userObject,JSON.stringify(res))
    //     localStorage.setItem(AppConstants.lSUserID,res._id)
    //     this.userInfoService.user = res
    //     this.userInfoService.logged = true
    //     this.userInfoService.user.notifications.map(noti => {
    //       noti.date = new Date(noti.date);
    //       return noti
    //     })
    //   },
    //   error: (err)=> {
    //     console.log(err);
    //   }
    // })
    // this.userInfoService.user = user
    // this.userInfoService.logged = true
    // console.log(this.userInfoService.user.notifications);
    // console.log(this.userInfoService.user.birthday);
    // console.log(this.userInfoService.user.notifications[0].date);
    // console.log(this.userInfoService.user.notifications[0].date.getMonth());
    // console.log(this.userInfoService.user.notifications[0].text);
  }


}
