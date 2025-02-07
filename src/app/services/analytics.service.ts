import { Injectable } from '@angular/core';

declare let gtag: Function;

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  
  constructor() { }

  public eventEmitter(
    eventName: string,
    eventCategory: string,
    eventAction: string,
    eventLabel: string = '',
    eventValue: number = 0) {
      gtag('event', eventName, {
        eventCategory: eventCategory,
        eventLabel: eventLabel,
        eventAction: eventAction,
        eventValue: eventValue
      });
  }

  public pageView(
    pagePath: string,
    pageTitle: string,
    pageLocation: string
  ) {
    gtag('config', 'G-H04LJ3D2XN', {
      page_path: pagePath,
      page_title: pageTitle,
      page_location: pageLocation
    });
  }
} 