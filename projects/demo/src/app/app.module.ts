import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxSuspenseOfModule } from 'projects/ngx-suspense-of/src/public-api';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, NgxSuspenseOfModule],
  bootstrap: [AppComponent]
})
export class AppModule {}
