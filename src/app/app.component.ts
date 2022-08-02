import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DoCheck,
  NgZone,
  VERSION,
} from '@angular/core';
import { defer, fromEvent, observeOn, subscribeOn, tap } from 'rxjs';
import { leaveNgZone } from 'ngx-rxjs-zone-scheduler';
import { Promise, setTimeout } from '@rx-angular/cdk/zone-less/browser';
// import { fromEvent } from '@rx-angular/cdk/zone-less/rxjs';

import { CdService } from './cd.service';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CdService],
})
export class AppComponent implements AfterViewInit, DoCheck {
  name = 'Angular ' + VERSION.major;

  constructor(
    private readonly _ngZone: NgZone,
    private readonly _cd: CdService
  ) {
    console.log('DEBUG:: create appcomponent');
    // console.log('DEBUG:: =', this._ngZone['_outer']);
    // console.log('DEBUG:: =', window['Zone'].current);
    // this._ngZone.onMicrotaskEmpty
    //   .asObservable()
    //   .subscribe(() => console.log('DEBUG:: microtask empty'));

    // this._cd.mDeferLeaveSub1();
  }

  ngAfterViewInit() {
    // fromEvent(document.querySelector('#test'), 'keyup').subscribe();
    // this._ngZone.runOutsideAngular(() => {
    //   fromEvent(document.querySelector('#test'), 'keyup').subscribe();
    // });
    // fromEvent(document.querySelector('#test'), 'keyup')
    //   .pipe(
    //     tap(() => {
    //       console.log('DEBUG:: tap before =', NgZone.isInAngularZone());
    //     }),
    //     observeOn(leaveNgZone(this._ngZone)),
    //     tap(() => {
    //       console.log('DEBUG:: tap after =', NgZone.isInAngularZone());
    //     })
    //   )
    //   .subscribe(() => {
    //     console.log('DEBUG:: subscribe =', NgZone.isInAngularZone());
    //   });
  }

  loadLazyChunk() {
    console.log('-------------------');
    this._cd.mDeferLeaveSubPerfect(false);
  }

  ngDoCheck() {
    console.log('DEBUG:: cd fired');
  }
}
