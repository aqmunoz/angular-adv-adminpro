import { Component, OnDestroy } from '@angular/core';
import { ActivationEnd, Router, Event } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styles: [
  ]
})
export class BreadcrumbsComponent implements OnDestroy{

  public title: string = '';
  public titleSubs$!: Subscription;

  constructor(private router: Router) {
    this.titleSubs$ = this.getArgumentosRuta()
      .subscribe(({ titulo }) => {
        this.title = titulo;
        document.title = `Adminpro - ${this.title}`
      });;
  }

  ngOnDestroy(): void {
    this.titleSubs$.unsubscribe();
  }

  getArgumentosRuta() {
    return this.router.events
      .pipe(
        filter((event: Event): event is ActivationEnd => event instanceof ActivationEnd),
        filter((event: ActivationEnd) => event.snapshot.firstChild === null),
        map((event: ActivationEnd) => event.snapshot.data)
      )
  }

}
