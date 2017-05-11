import { GetStartedPage } from './get-started/get-started';
import { TabsPage } from './tabs/tabs';

import { HomePage } from './home/home';
import { ActivitiesPage } from './activities/activities';
import { SearchPage } from './search/search';
import { ProfilePage } from './profile/profile';
import { ContactPage } from './contact/contact';

// The page the user lands on after opening the app and without a session
export const FirstRunPage = GetStartedPage;

// The main page the user will see as they use the app over a long period of time.
// Change this if not using tabs
export const MainPage = TabsPage;

// The initial root pages for our tabs (remove if not using tabs)
export const Tab1Root = HomePage;
export const Tab2Root = ActivitiesPage;
export const Tab3Root = SearchPage;
export const Tab4Root = ProfilePage;
export const Tab5Root = ContactPage;