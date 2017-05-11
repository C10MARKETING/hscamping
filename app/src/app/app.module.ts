import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Firebase } from '@ionic-native/firebase';
import { LocalNotifications } from '@ionic-native/local-notifications';

import { HttpModule, Http } from '@angular/http';

import { AngularFireModule, AuthProviders, AuthMethods } from 'angularfire2';

import { NavHeaderPage } from '../pages/nav-header/nav-header';
import { GetStartedPage } from '../pages/get-started/get-started';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { ResetPasswordPage } from '../pages/reset-password/reset-password';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { ActivitiesPage } from '../pages/activities/activities';
import { ActivityDetailPage } from '../pages/activities/activity-detail/activity-detail';
import { ActivitiesFilterPage } from '../pages/activities/activities-filter/activities-filter';
import { SearchPage } from '../pages/search/search';
import { SearchListPage } from '../pages/search/search-list';
import { ProfilePage } from '../pages/profile/profile';
import { SettingsPage } from '../pages/profile/settings';
import { ContactPage } from '../pages/contact/contact';

import { MinutesToTimeOfDayPipe } from '../pipes/minutes-to-time-of-day.pipe';
import { LocalizeDatePipe } from '../pipes/localize-date.pipe';
import { SortByStartTimePipe } from '../pipes/sort-by-start-time.pipe';
import { SortByDatePipe } from '../pipes/sort-by-date.pipe';
import { SortPipe } from '../pipes/sort.pipe';

import { AuthData } from '../providers/auth-data';
import { UserService } from '../providers/user.service';
import { ActivityService } from '../providers/activity.service';
import { NotificationsService } from '../providers/notifications.service'

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { CalendarModule } from 'primeng/components/calendar/calendar';

export const firebaseConfig = {
  apiKey: "AIzaSyAynycu2fcbWAusFICFIN026B-sw32js8o",
  authDomain: "hscamping-9c323.firebaseapp.com",
  databaseURL: "https://hscamping-9c323.firebaseio.com",
  storageBucket: "hscamping-9c323.appspot.com",
  messagingSenderId: "761576838574"
};

const myFirebaseAuthConfig = {
  provider: AuthProviders.Password,
  method: AuthMethods.Password
}

// The translate loader needs to know where to load i18n files
// in Ionic's static asset pipeline.
export function createTranslateLoader(http: Http) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

/**
 * The Pages array lists all of the pages we want to use in our app.
 * We then take these pages and inject them into our NgModule so Angular
 * can find them. As you add and remove pages, make sure to keep this list up to date.
 */
let pages:any[] = [
  MyApp,
  NavHeaderPage,
  GetStartedPage,
  LoginPage,
  SignupPage,
  ResetPasswordPage,
  ActivitiesPage,
  ActivityDetailPage,
  ActivitiesFilterPage,
  SearchPage,
  ProfilePage,
  SettingsPage,
  ContactPage,
  HomePage,
  TabsPage,
  SearchListPage
];

let pipes:any[] = [
  MinutesToTimeOfDayPipe,
  LocalizeDatePipe,
  SortByStartTimePipe,
  SortByDatePipe,
  SortPipe
];

@NgModule({
  declarations: [pages, pipes],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    IonicModule.forRoot(MyApp, {
      backButtonIcon: 'ios-arrow-dropleft',
      backButtonText: '',
      platforms: {
        ios: {
            statusbarPadding: true,
        }
      },
      mode: 'md'
    }),
    AngularFireModule.initializeApp(firebaseConfig, myFirebaseAuthConfig),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [Http]
      }
    }),
    CalendarModule
  ],
  bootstrap: [IonicApp],
  entryComponents: pages,
  providers: [
    StatusBar,
    SplashScreen,
    Firebase,
    LocalNotifications,
    AuthData,
    UserService,
    ActivityService,
    NotificationsService,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule {}
