import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DoCheck,
  NgZone,
  VERSION,
} from '@angular/core';
import { enterNgZone, leaveNgZone } from 'ngx-rxjs-zone-scheduler';
import { defer, observeOn, subscribeOn, tap } from 'rxjs';

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

    defer(() => {
      console.log('DEBUG:: is in zone (defer) =', NgZone.isInAngularZone());
      return Promise.resolve(10).then((v) => {
        console.log('DEBUG:: is in zone (then) =', NgZone.isInAngularZone());
        return v;
      });
    })
      .pipe(
        tap(() =>
          console.log('DEBUG:: is in zone (tap 1) =', NgZone.isInAngularZone())
        ),
        subscribeOn(leaveNgZone(this._ngZone)),
        tap(() =>
          console.log('DEBUG:: is in zone (tap 2) =', NgZone.isInAngularZone())
        ),
        observeOn(enterNgZone(this._ngZone)),
        tap(() =>
          console.log('DEBUG:: is in zone (tap 3) =', NgZone.isInAngularZone())
        )
      )
      .subscribe(() => {
        console.log('DEBUG:: is in zone =', NgZone.isInAngularZone());
      });
  }

  ngAfterViewInit() {}

  loadLazyChunk() {
    console.log('-------------------');
    // this._cd.mDeferLeaveSubPerfect(false);
    this._cd.mDeferLeaveSubPerfect(false);
  }

  loadLazyChunkScheduled() {
    console.log('-------------------');
    // this._cd.mDeferLeaveSubPerfect(false);
    this._cd.mDeferLeaveSubTest(false);
  }

  loadLazyChunkManual() {
    console.log('-------------------');
    // this._cd.mDeferLeaveSubPerfect(false);
    this._cd.mDeferOutside(false);
  }

  ngDoCheck() {
    console.log('DEBUG:: cd fired');
  }
}
