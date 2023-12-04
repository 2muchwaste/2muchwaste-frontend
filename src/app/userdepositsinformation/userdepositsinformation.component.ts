import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AuthenticationService} from "../services/backendcalls/authenticationservice";
import {UserResponse} from "../models/userresponse";
import {Authorizationservice} from "../services/backendcalls/authorizationservice";
import {UserInformationService} from "../services/userinformationservice";
import {AppConstants} from "../utils/constants";
import {CustomerService} from "../services/backendcalls/customerservice";
import {DepositService} from "../services/backendcalls/depositservice";
import {Deposit} from "../models/deposit";
import {PageEvent} from "@angular/material/paginator";
import {formatDate} from "@angular/common";
import {TrashTypeManager, TrashTypes} from "../models/trashtype";

@Component({
    selector: 'app-userdepositsinformation',
    templateUrl: './userdepositsinformation.component.html',
    styleUrls: ['./userdepositsinformation.component.scss']
})
export class UserdepositsinformationComponent implements OnInit {

    public user!: UserResponse
    public userID!: string
    userDeposits!: Deposit[];
    lowValue: number = 0;
    highValue: number = 10;
    trashTypesManager: TrashTypeManager = new TrashTypeManager()

    constructor(
        private authorizationService: Authorizationservice,
        private userInfoService: UserInformationService,
        private customerService: CustomerService,
        private depositService: DepositService,
    ) {
    }

    ngOnInit(): void {
        console.log('UserDepositInformation enter OnInit');
        this.authorizationService.checkAuthDataORRedirect()
        // @ts-ignore
        this.userID = localStorage.getItem(AppConstants.lSUserID)
        // this.user = this.userInfoService.user
        // if (this.user == null) {
            this.setUser()
            this.setDeposits()
        // }
    }

    private setUser() {
        this.customerService.getCustomerByID(this.userID).subscribe({
            next: (res) => this.user = this.userInfoService.user = res,
            error: err => console.log(err)
        })
    }

    private setDeposits() {
        this.depositService.getDepositsFromUser(this.userID).subscribe({
            next: res => {
                let x = res.map(deposit => {
                    deposit.date = new Date(deposit.date)
                    return deposit
                })
                this.userDeposits = this.userInfoService.userDeposits = x.reverse()
            },
            error: err => console.log(err)
        })
    }

    public getPaginatorData(event: PageEvent): PageEvent {
        this.lowValue = event.pageIndex * event.pageSize;
        this.highValue = this.lowValue + event.pageSize;
        return event;
    }

    getMonthTag(date: Date) {
        return date.toLocaleString('default', {month: 'long'}) + (date.getFullYear() === new Date().getFullYear() ? '' : ' - ' + date.getFullYear())
    }

    protected readonly formatDate = formatDate;
    protected readonly TrashTypes = TrashTypes;
}
