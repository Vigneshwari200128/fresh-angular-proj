import 'zone.js';
import { bootstrapApplication } from '@angular/platform-browser';
import { environment } from './environments/environment.prod';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));


  if (environment.production) {
  // Enable prod mode stuff here if needed
  console.log("Running in PRODUCTION mode");
} else {
  console.log("Running in DEVELOPMENT mode");
}

