import { Injectable, NgZone } from '@angular/core';
import { leaveNgZone } from 'ngx-rxjs-zone-scheduler';
import { defer, observeOn, scheduled, subscribeOn, take, tap } from 'rxjs';

@Injectable()
export class CdService {
  constructor(private readonly _ngZone: NgZone) {}

  cRegularImport() {
    const im = import('./hello.component');
    console.log(im);
    im.then((cmp) => {
      console.log('DEBUG:: =', NgZone.isInAngularZone());
      console.log('DEBUG:: cmp =', cmp);
    });
  }

  // 4 CD (simulate regular lazy import)
  mPlain1(
    wrapInTimeout = true,
    timeOutSymbol = window['__zone_symbol__setTimeout']
  ) {
    const fn = () => {
      const im = import('./hello.component');
      console.log(im);
      console.log(
        'DEBUG:: is in zone (sto zone symbol) =',
        NgZone.isInAngularZone()
      );
      this._ngZone.run(() => {
        console.log(
          'DEBUG:: is in zone (sto zone symbol run zone) =',
          NgZone.isInAngularZone()
        );
        im.then((cmp) => {
          console.log('DEBUG:: is in zone (then) =', NgZone.isInAngularZone());
        });
      });
    };

    if (wrapInTimeout) {
      timeOutSymbol(fn, 100);
      return;
    }

    fn();
  }

  // 3 CD (no wrapping)
  mDefer1() {
    defer(() =>
      this._ngZone.runOutsideAngular(() =>
        import('./hello.component').then((im) => {
          console.log('DEBUG:: is in zone (then) =', NgZone.isInAngularZone());
          return im;
        })
      )
    )
      .pipe(take(1))
      .subscribe((im) => {
        console.log('DEBUG:: is in zone (sub) =', NgZone.isInAngularZone());
      });
  }

  // 3 CD (leave)
  mDeferLeaveObs1() {
    defer(() =>
      this._ngZone.runOutsideAngular(() =>
        import('./hello.component').then((im) => {
          console.log('DEBUG:: is in zone (then) =', NgZone.isInAngularZone());
          return im;
        })
      )
    )
      .pipe(observeOn(leaveNgZone(this._ngZone)), take(1))
      .subscribe((im) => {
        console.log('DEBUG:: is in zone (sub) =', NgZone.isInAngularZone());
      });
  }

  // 4 CD. buggy
  mDefer2(
    wrapInTimeout = true,
    timeOutSymbol = window['__zone_symbol__setTimeout']
  ) {
    const fn = () => {
      this._ngZone.run(() => {
        defer(() =>
          this._ngZone.runOutsideAngular(() =>
            import('./hello.component').then((im) => {
              console.log(
                'DEBUG:: is in zone (then) =',
                NgZone.isInAngularZone()
              );
              return im;
            })
          )
        )
          .pipe(take(1))
          .subscribe((im) => {
            console.log('DEBUG:: is in zone (sub) =', NgZone.isInAngularZone());
          });
      });
    };

    if (wrapInTimeout) {
      timeOutSymbol(fn, 100);
      return;
    }

    fn();
  }

  // 4 CD. buggy
  mDeferLeaveObs2(
    wrapInTimeout = true,
    timeOutSymbol = window['__zone_symbol__setTimeout']
  ) {
    const fn = () => {
      this._ngZone.run(() => {
        defer(() =>
          this._ngZone.runOutsideAngular(() =>
            import('./hello.component').then((im) => {
              console.log(
                'DEBUG:: is in zone (then) =',
                NgZone.isInAngularZone()
              );
              return im;
            })
          )
        )
          .pipe(observeOn(leaveNgZone(this._ngZone)), take(1))
          .subscribe((im) => {
            console.log('DEBUG:: is in zone (sub) =', NgZone.isInAngularZone());
          });
      });
    };

    if (wrapInTimeout) {
      timeOutSymbol(fn, 100);
      return;
    }

    fn();
  }

  // 3 CD (leave - subscribeOn)
  mDeferLeaveSub1(
    wrapInTimeout = true,
    timeOutSymbol = window['__zone_symbol__setTimeout']
  ) {
    const fn = () => {
      this._ngZone.run(() => {
        defer(() =>
          this._ngZone.runOutsideAngular(() =>
            import('./hello.component').then((im) => {
              console.log(
                'DEBUG:: is in zone (then) =',
                NgZone.isInAngularZone()
              );
              return im;
            })
          )
        )
          .pipe(subscribeOn(leaveNgZone(this._ngZone)), take(1))
          .subscribe((im) => {
            console.log('DEBUG:: is in zone (sub) =', NgZone.isInAngularZone());
          });
      });
    };

    if (wrapInTimeout) {
      timeOutSymbol(fn, 100);
      return;
    }

    fn();
  }

  // 2 CD (leave - subscribeOn)
  mDeferLeaveSubPerfect(
    wrapInTimeout = true,
    timeOutSymbol = window['__zone_symbol__setTimeout']
  ) {
    const fn = () => {
      console.log('DEBUG:: is in zone =', NgZone.isInAngularZone());

      defer(() => {
        console.log('DEBUG:: is in zone (defer) =', NgZone.isInAngularZone());
        return import('./hello.component');
      })
        .pipe(
          tap(() =>
            console.log(
              'DEBUG:: is in zone (before leave) =',
              NgZone.isInAngularZone()
            )
          ),
          subscribeOn(leaveNgZone(this._ngZone)),
          tap(() =>
            console.log(
              'DEBUG:: is in zone (after leave) =',
              NgZone.isInAngularZone()
            )
          ),
          take(1)
        )
        .subscribe((im) => {
          console.log('DEBUG:: is in zone (sub) =', NgZone.isInAngularZone());
        });
    };

    if (wrapInTimeout) {
      timeOutSymbol(fn, 100);
      return;
    }

    fn();
  }

  mDeferLeaveSubTest(
    wrapInTimeout = true,
    timeOutSymbol = window['__zone_symbol__setTimeout']
  ) {
    const fn = () => {
      console.log('DEBUG:: is in zone =', NgZone.isInAngularZone());

      defer(() => {
        console.log('DEBUG:: is in zone (defer) =', NgZone.isInAngularZone());
        return scheduled(
          import('./hello.component'),
          leaveNgZone(this._ngZone)
        );
      })
        .pipe(
          tap(() =>
            console.log(
              'DEBUG:: is in zone (pipeline) =',
              NgZone.isInAngularZone()
            )
          ),
          take(1)
        )
        .subscribe((im) => {
          console.log('DEBUG:: is in zone (sub) =', NgZone.isInAngularZone());
        });
    };

    if (wrapInTimeout) {
      timeOutSymbol(fn, 100);
      return;
    }

    fn();
  }

  mDeferOutside(
    wrapInTimeout = true,
    timeOutSymbol = window['__zone_symbol__setTimeout']
  ) {
    const fn = () => {
      console.log('DEBUG:: is in zone =', NgZone.isInAngularZone());

      defer(() => {
        console.log('DEBUG:: is in zone (defer) =', NgZone.isInAngularZone());
        return this._ngZone.runOutsideAngular(() =>
          import('./hello.component')
        );
      })
        .pipe(
          tap(() =>
            console.log(
              'DEBUG:: is in zone (pipeline) =',
              NgZone.isInAngularZone()
            )
          ),
          take(1)
        )
        .subscribe((im) => {
          console.log('DEBUG:: is in zone (sub) =', NgZone.isInAngularZone());
        });
    };

    if (wrapInTimeout) {
      timeOutSymbol(fn, 100);
      return;
    }

    fn();
  }
}

// // 4 CD. buggy (Promise from RxA)
// window['__zone_symbol__setTimeout'](() => {
//   this._ngZone.run(() => {
//     defer(() =>
//       this._ngZone.runOutsideAngular(() =>
//         import('./hello.component').then((im) => {
//           console.log(
//             'DEBUG:: is in zone (then) =',
//             NgZone.isInAngularZone()
//           );
//           return Promise.resolve(im);
//         })
//       )
//     ).subscribe((im) => {
//       console.log('DEBUG:: is in zone (sub) =', NgZone.isInAngularZone());
//     });
//   });
// }, 100);

// // 3 CD (wrapped subscribe)
// window['__zone_symbol__setTimeout'](() => {
//   this._ngZone.run(() => {
//     this._ngZone
//       .runOutsideAngular(() =>
//         defer(() =>
//           import('./hello.component').then((im) => {
//             console.log(
//               'DEBUG:: is in zone (then) =',
//               NgZone.isInAngularZone()
//             );
//             return im;
//           })
//         )
//       )
//       .subscribe((im) => {
//         console.log(im);
//         console.log('DEBUG:: is in zone (sub) =', NgZone.isInAngularZone());
//       });
//   });
// }, 100);

// // 2 CD (similar to RxA setTimeout + subscribe)
// window['__zone_symbol__setTimeout'](() => {
//   defer(() =>
//     import('./hello.component').then((im) => {
//       console.log('DEBUG:: is in zone (then) =', NgZone.isInAngularZone());
//       return im;
//     })
//   ).subscribe((im) => {
//     console.log(im);
//     console.log('DEBUG:: is in zone (sub) =', NgZone.isInAngularZone());
//   });
// }, 100);

// // 2 CD (similar to RxA setTimeout + subscribe)
// setTimeout(() => {
//   defer(() =>
//     import('./hello.component').then((im) => {
//       console.log('DEBUG:: is in zone (then) =', NgZone.isInAngularZone());
//       return im;
//     })
//   ).subscribe((im) => {
//     console.log(im);
//     console.log('DEBUG:: is in zone (sub) =', NgZone.isInAngularZone());
//   });
// }, 100);

// 3 CD (leave - subscribeOn)
// setTimeout(() => {
//   this._ngZone.run(() => {
//     defer(() =>
//       this._ngZone.runOutsideAngular(() =>
//         import('./hello.component').then((im) => {
//           console.log(
//             'DEBUG:: is in zone (then) =',
//             NgZone.isInAngularZone()
//           );
//           return im;
//         })
//       )
//     )
//       .pipe(subscribeOn(leaveNgZone(this._ngZone)))
//       .subscribe((im) => {
//         console.log('DEBUG:: is in zone (sub) =', NgZone.isInAngularZone());
//       });
//   });
// }, 100);
