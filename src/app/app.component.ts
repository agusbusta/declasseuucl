import { Component } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { AnalyticsService } from './services/analytics.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Declass2024';

  constructor(
    private router: Router,
    private analyticsService: AnalyticsService
  ) {
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event) => {
      this.analyticsService.pageView(
        event.urlAfterRedirects,
        document.title,
        window.location.href
      );
    });
  }
}
