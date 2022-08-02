import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { UnpatchModule } from '@rx-angular/template/unpatch';

import { AppComponent } from './app.component';

@NgModule({
  imports: [BrowserModule, UnpatchModule],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
