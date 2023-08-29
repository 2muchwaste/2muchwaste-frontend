import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, interval } from 'rxjs';
import Notification from "@/app/notification.component.ts";
import {type Note} from "../models/note.ts";
import { ApiService } from '@/app/api';


@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})

export class NotificationsComponent implements OnInit, OnDestroy {
  notifications: Note[] = [];
  isDataLoaded = false;
  notRead = 0;
  currentIndex = 0;
  itemsPerPage = 5;
  intervalSubscription: Subscription | undefined;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.fetchData();
    this.intervalSubscription = interval(6000).subscribe(() => {
      this.fetchData();
    });
  }

  ngOnDestroy(): void {
    if (this.intervalSubscription) {
      this.intervalSubscription.unsubscribe();
    }
  }

  fetchData(): void {
      this.apiService.getNotifications('notificationss').subscribe(
      (response: any) => {
        this.notifications = response.map((item: any): Note => ({
          id: item._id,
          date: item.date,
          email: item.email,
          isRead: item.isRead,
          text: item.text,
          type: item.type
        }));
        this.isDataLoaded = true;
      },
      (error) => {
        console.error(error);
        this.isDataLoaded = false;
      }
    );

    this.apiService.getNotReadNotification('not read').subscribe(
      (res: number) => {
        this.notRead = res;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  get visibleItems(): Note[] {
    const start = this.currentIndex * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.notifications.slice(start, end);
  }

  get isFirstPage(): boolean {
    return this.currentIndex === 0;
  }

  get isLastPage(): boolean {
    const maxIndex = Math.ceil(this.notifications.length / this.itemsPerPage) - 1;
    return this.currentIndex === maxIndex;
  }

  previous(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  next(): void {
    const maxIndex = Math.ceil(this.notifications.length / this.itemsPerPage) - 1;
    if (this.currentIndex < maxIndex) {
      this.currentIndex++;
    }
  }
}
