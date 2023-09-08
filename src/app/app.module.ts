import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { TimelineComponent } from './timeline/timeline.component';
import { TimelineDraggableDirective } from './timeline-draggable.directive';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    TimelineComponent,
    TimelineDraggableDirective
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
