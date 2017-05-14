<template>
<div>
<div v-if="!this.authorized && dataLoaded">
Ikke logget ind
</div>
<div v-if="this.authorized">
    <div class="tabs">
        <div :class="{active: activeTab == 'activities'}" @click="setActiveTab('activities')">Aktiviteter</div>
        <div :class="{active: activeTab == 'create-activity'}" @click="setActiveTab('create-activity')">Opret Aktivitet</div>
        <div :class="{active: activeTab == 'series'}" @click="setActiveTab('series')">Serier</div>
        <div :class="{active: activeTab == 'create-series'}" @click="setActiveTab('create-series')">Opret Serie</div>
        <div :class="{active: activeTab == 'contact'}" @click="setActiveTab('contact')">Kontakt</div>
        <div onclick="window.open('https://console.firebase.google.com/project/hscamping-9c323/notification', '_blank')">Push-beskeder</div>
        <div :class="{active: activeTab == 'settings'}" @click="setActiveTab('settings')">Indstillinger</div>
    </div>

    <!-- ACTIVITIES -->
    <!-- first flatpickr element needs to to have it's own conditional rendering node since it gets moved to the bottom of the DOM -->
    <div v-if="activeTab == 'activities'" class="search">
        <input placeholder="søg" type="text" v-model="currentSearch" /><div class="flatpickr-placeholder">vælg dato-interval</div>
        <Flatpickr ref="flatpickr" :options="fpOptionsRange" placeholder="vælg dato-interval" v-model="currentDate" />
        <img v-if="currentDate" @click="resetCurrentDate" src="../assets/calendar.svg" alt="nulstil kalender"/>
    </div>
    <div v-if="activeTab == 'activities'">

        <h2 v-if="currentDateRange && currentDateRange.from && currentDateRange.to">{{currentDateRange.from | localizeDateSimple}} - {{currentDateRange.to | localizeDateSimple}}</h2>
        <h2 v-if="currentDate === ''">{{today | localizeDateSimple}} - {{aMonthFromNow | localizeDateSimple}}</h2>

        <div v-for="date in dates" class="date">
            <div style="font-weight: bold;">{{date | localizeDate }}</div>
            <div v-for="activity in filter(getActivities(date))" class="activity" :class="{past: isPastActivity(activity)}">
                <img :src="activity.pic" alt="aktivitet"/>
                <div class="content">
                    <div class="title">{{activity.title[currentLang]}}</div>
                    <div>{{activity.startTimeInMinutes | minutesToTimeOfDay}} - {{activity.endTimeInMinutes | minutesToTimeOfDay}}</div>
                    <div>{{activity.about[currentLang]}}</div>
                    <div>
                        <span @click="edit(activity)" class="edit">rediger</span>
                        <span v-if="activity.title['da']" class="translated-da">DA</span>
                        <span v-if="activity.title['de']" class="translated-de">DE</span>
                        <span @click="editSeries(getSeries(activity.series))" class="series" v-if="activity.series">serie</span>
                        <span @click="deleteActivityModal(activity)" class="delete">slet</span>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="spinner" v-if="!dataLoaded"></div>

        <div v-if="(dataLoaded && dates && dates.length === 0 && currentDate !== '') || (currentDate === '' && dataLoaded && dates.length === 0)">Ingen aktiviteter</div>

    </div>

    <!-- EDIT ACTIVITY -->
    <div v-if="activeTab == 'edit-activity' || activeTab == 'edit-series'">
        <div v-if="activeActivity || activeSeries" style="display:flex">

            <table class="edit-activity">
                <tr>
                    <td>
                        <select v-model="inputLanguage.title" class="lang-dropdown">
                            <option value="da">Titel (dansk)</option>
                            <option value="de">Titel (tysk)</option>
                        </select>
                    </td>
                    <td>
                        <input type="text" v-model="activeActivity.title[inputLanguage.title]" />
                    </td>
                </tr>
                <tr>
                    <td>
                        <select v-model="inputLanguage.about" class="lang-dropdown">
                            <option value="da">Kort beskrivelse (dansk)</option>
                            <option value="de">Kort beskrivelse (tysk)</option>
                        </select>
                    </td>
                    <td>
                        <input type="text" v-model="activeActivity.about[inputLanguage.about]" />
                    </td>
                </tr>
                <tr v-show="activeTab == 'edit-activity'">
                    <td>Dato</td><td><Flatpickr :options="fpOptions" v-model="activeActivity.date" /></td>
                </tr>
                <tr>
                    <td>Starttidspunkt</td>
                    <td>
                      <vue-timepicker
                        format="HH:mm"
                        :minute-interval="15"
                        hide-clear-button
                        v-model="activeActivityStartTime" @change="onActiveActivityStartTimeChanged">
                      </vue-timepicker>
                    </td>
                </tr>
                <tr>
                    <td>Sluttidspunkt</td>
                    <td>
                      <vue-timepicker
                        format="HH:mm"
                        :minute-interval="15"
                        hide-clear-button
                        v-model="activeActivityEndTime" @change="onActiveActivityEndTimeChanged">
                      </vue-timepicker>
                    </td>
                </tr>
                <tr>
                    <td>
                        <select v-model="inputLanguage.location" class="lang-dropdown">
                            <option value="da">Sted (dansk)</option>
                            <option value="de">Sted (tysk)</option>
                        </select>
                    </td>
                    <td>
                        <input type="text" v-model="activeActivity.location[inputLanguage.location]" />
                    </td>
                </tr>
                <tr>
                    <td>Arrangør</td><td><input type="text" v-model="activeActivity.organiser" /></td>
                </tr>
                <tr>
                    <td>Maks antal pladser</td><td><input type="number" v-model="activeActivity.maxAmountOfParticipants" /></td>
                </tr>
                <tr>
                    <td>
                        <select v-model="inputLanguage.info" class="lang-dropdown">
                            <option value="da">Info (dansk)</option>
                            <option value="de">Info (tysk)</option>
                        </select>
                    </td>
                    <td>
                        <textarea rows="6" cols="40" v-model="activeActivity.info[inputLanguage.info]"></textarea>
                    </td>
                </tr>
            </table>
            <table class="edit-activity">
                <tr>
                    <td>Billede</td>
                    <td>
                        <input type="file" @change="onActiveActivityFileChange"/>
                        <img :src="activeActivity.pic" class="preview" alt="aktivitet" v-if="!activeActivityPreviewImage"/>
                        <img :src="activeActivityPreviewImage" class="preview" alt="aktivitet" v-if="activeActivityPreviewImage"/>
                    </td>
                </tr>
                <tr>
                    <td>Synlig for</td>
                    <td>
                        <select v-model="activeActivity.visibleTo">
                            <option value="everyone">Alle</option>
                            <option value="camping">Kun HS Camping gæster</option>
                            <option value="partner">Kun FP gæster</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td>Hvem</td>
                    <td>
                        <select v-model="activeActivity.who">
                            <option value="">Intet valgt</option>
                            <option value="children">Børn</option>
                            <option value="adults">Voksne</option>
                            <option value="family">Hele familien</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td>Hvor</td>
                    <td>
                        <select v-model="activeActivity.where">
                            <option value="">Intet valgt</option>
                            <option value="indoors">Indendørs</option>
                            <option value="outdoors">Udendørs</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td>Hvad</td>
                    <td>
                        <select v-model="activeActivity.what">
                            <option value="">Intet valgt</option>
                            <option value="sport">Sport</option>
                            <option value="nature">Natur</option>
                            <option value="creative">Kreativ</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td>Pris-kategori</td>
                    <td>
                        <select v-model="activeActivity.priceCategory">
                            <option value="freeForAll">Gratis for alle</option>
                            <option value="freeWithPackage">Gratis med aktivitetspakke</option>
                            <option value="paying">Betalende</option>
                        </select>
                    </td>
                </tr>
                <tr v-if="activeActivity.priceCategory !== 'freeForAll'">
                    <td>Pris (DKK)</td>
                    <td><input type="number" v-model="activeActivity.price" /></td>
                </tr>
                <tr>
                    <td>Kategori</td>
                    <td>
                        <select v-model="activeActivity.category">
                            <option value="free">Ikke bindende tilmelding</option>
                            <option value="binding">Bindende tilmelding</option>
                            <option value="offSite">Udenfor pladsen</option>
                            <option value="hereAndNow">Her&amp;Nu betaling</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td>Push-beskeder</td>
                    <td>
                        <select v-model="activeActivity.pushNotificationMinInAdvance">
                            <option value="0">Ingen</option>
                            <option value="15">15 min før</option>
                            <option value="30">30 min før</option>
                            <option value="45">45 min før</option>
                            <option value="60">1 time før</option>
                            <option value="90">1½ time før</option>
                            <option value="120">2 timer før</option>
                            <option value="150">2½ timer før</option>
                            <option value="180">3 timer før</option>
                        </select>
                    </td>
                </tr>
            </table>
        </div>
        <div>
            <button type="button" v-show="activeTab == 'edit-activity'" style="margin-bottom: 5px" @click="updateActiveActivityModal">Gem ændringer</button>
            <button type="button" v-show="activeTab == 'edit-series'" style="margin-bottom: 5px" @click="updateActiveSeriesModal">Gem ændringer</button>
            <div class="spinner" v-if="updatingActiveActivity"></div>
            <div v-if="activeActivityUpdated && activeTab == 'edit-activity'">ændringer gemt</div>
            <div v-if="activeActivityUpdated && activeTab == 'edit-series'">ændringer gemt</div>
        </div>
        
        <div v-show="activeTab == 'edit-activity'">
            <h2>Deltagerliste ({{getParticipantsAmount(activeActivity)}}<span v-if="getMaxAmountOfParticipants(activeActivity) != null">/{{getMaxAmountOfParticipants(activeActivity)}}</span>)</h2>

                <input class="addParticipant" type="text" placeholder="navn" v-model="participantToAdd" /> <button @click="addParticipantModal()">Tilføj</button>
                <div v-if="showTooManyParticipants">Deltagerbegrænsning overskredet</div>
                <div class="participants">
                  <div class="participant" v-for="participant in getParticipants(activeActivity)" :class="{confirmed: participant.confirmed}" @click="confirmParticipantModal(participant, activeActivity, !participant.confirmed)">
                    <span>{{participant.name}}</span><span v-if="participant.email">({{participant.email}})</span><span v-if="participant.guestOn">- {{displayGuestOn(participant.guestOn)}}</span><span v-if="participant.guestOn">(<img src="../assets/smartphone.svg" height="18" />)</span>
                    <div class="removeButton" @click.stop="removeParticipantModal(participant, activeActivity)"><img src="../assets/close.svg" width="17"></div>
                  </div>
                </div>
                <div v-if="!getParticipants(activeActivity)">Ingen deltagere</div>
        </div>

    </div>

    <!-- ADD ACTIVITY -->
    <div v-if="activeTab == 'create-activity' || activeTab == 'create-series'">
        <div style="display: flex">
            <table class="edit-activity">
                <tr>
                    <td>
                        <select v-model="inputLanguage.title" class="lang-dropdown">
                            <option value="da">Titel (dansk)</option>
                            <option value="de">Titel (tysk)</option>
                        </select>
                    </td>
                    <td>
                        <input type="text" v-model="newActivity.title[inputLanguage.title]" />
                    </td>
                </tr>
                <tr>
                    <td>
                        <select v-model="inputLanguage.about" class="lang-dropdown">
                            <option value="da">Kort beskrivelse (dansk)</option>
                            <option value="de">Kort beskrivelse (tysk)</option>
                        </select>
                    </td>
                    <td>
                        <input type="text" v-model="newActivity.about[inputLanguage.about]" />
                    </td>
                </tr>
                <tr v-show="activeTab == 'create-activity'">
                    <td>Dato</td><td><Flatpickr :options="fpOptions" v-model="newActivity.date" /></td>
                </tr>
                <tr v-show="activeTab == 'create-series'">
                    <td>Startdato</td><td><Flatpickr :options="fpOptions" v-model="newActivity.startDate" /></td>
                </tr>
                <tr v-show="activeTab == 'create-series'">
                    <td>Slutdato</td><td><Flatpickr :options="fpOptions" v-model="newActivity.endDate" /></td>
                </tr>
                <tr v-show="activeTab == 'create-series'">
                    <td>Gentag</td>
                    <td>
                      <select v-model="newActivity.repeat">
                          <option value="daily">Daglig</option>
                          <option value="weekly">Ugentlig</option>
                          <option value="monthly">Månedlig</option>
                      </select>
                      <div v-show="newActivity.repeat === 'weekly' || newActivity.repeat === 'monthly'" class="repeatDays">
                        <div v-show="newActivity.repeat === 'monthly'">Første</div>
                        <div>
                          <label><input type="checkbox" value="0" v-model="newActivity.repeatDays">man</label>
                          <label><input type="checkbox" value="1" v-model="newActivity.repeatDays">tir</label>
                          <label><input type="checkbox" value="2" v-model="newActivity.repeatDays">ons</label>
                          <label><input type="checkbox" value="3" v-model="newActivity.repeatDays">tor</label>
                          <label><input type="checkbox" value="4" v-model="newActivity.repeatDays">fre</label>
                          <label><input type="checkbox" value="5" v-model="newActivity.repeatDays">lør</label>
                          <label><input type="checkbox" value="6" v-model="newActivity.repeatDays">søn</label>
                        </div>
                        <div v-show="newActivity.repeat === 'monthly'">i hver måned</div>
                      </div>
                    </td>
                </tr>
                <tr>
                    <td>Starttidspunkt</td>
                    <td>
                      <vue-timepicker
                        format="HH:mm"
                        :minute-interval="15"
                        hide-clear-button
                        v-model="newActivity.startTime">
                      </vue-timepicker>
                    </td>
                </tr>
                <tr>
                    <td>Sluttidspunkt</td>
                    <td>
                      <vue-timepicker
                        format="HH:mm"
                        :minute-interval="15"
                        hide-clear-button
                        v-model="newActivity.endTime">
                      </vue-timepicker>
                    </td>
                </tr>
                <tr>
                    <td>
                        <select v-model="inputLanguage.location" class="lang-dropdown">
                            <option value="da">Sted (dansk)</option>
                            <option value="de">Sted (tysk)</option>
                        </select>
                    </td>
                    <td>
                        <input type="text" v-model="newActivity.location[inputLanguage.location]" />
                    </td>
                </tr>
                <tr>
                    <td>Arrangør</td><td><input type="text" v-model="newActivity.organiser" /></td>
                </tr>
                <tr>
                    <td>Maks antal pladser</td><td><input type="number" v-model="newActivity.maxAmountOfParticipants" /></td>
                </tr>
                <tr>
                    <td>
                        <select v-model="inputLanguage.info" class="lang-dropdown">
                            <option value="da">Info (dansk)</option>
                            <option value="de">Info (tysk)</option>
                        </select>
                    </td>
                    <td>
                        <textarea rows="6" cols="40" v-model="newActivity.info[inputLanguage.info]"></textarea>
                    </td>
                </tr>
            </table>
            <table class="edit-activity">
                <tr>
                    <td>Billede</td>
                    <td>
                        <input ref="newActivityFile" type="file" @change="onFileChange"/>
                        <img :src="previewImage" class="preview" alt="aktivitet" v-if="previewImage"/>
                    </td>
                </tr>
                <tr>
                    <td>Synlig for</td>
                    <td>
                        <select v-model="newActivity.visibleTo">
                            <option value="everyone">Alle</option>
                            <option value="camping">Kun HS Camping gæster</option>
                            <option value="partner">Kun FP gæster</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td>Hvem</td>
                    <td>
                        <select v-model="newActivity.who">
                            <option value="">Intet valgt</option>
                            <option value="children">Børn</option>
                            <option value="adults">Voksne</option>
                            <option value="family">Hele familien</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td>Hvor</td>
                    <td>
                        <select v-model="newActivity.where">
                            <option value="">Intet valgt</option>
                            <option value="indoors">Indendørs</option>
                            <option value="outdoors">Udendørs</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td>Hvad</td>
                    <td>
                        <select v-model="newActivity.what">
                            <option value="">Intet valgt</option>
                            <option value="sport">Sport</option>
                            <option value="nature">Natur</option>
                            <option value="creative">Kreativ</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td>Pris-kategori</td>
                    <td>
                        <select v-model="newActivity.priceCategory">
                            <option value="freeForAll">Gratis for alle</option>
                            <option value="freeWithPackage">Gratis med aktivitetspakke</option>
                            <option value="paying">Betalende</option>
                        </select>
                    </td>
                </tr>
                <tr v-if="newActivity.priceCategory !== 'freeForAll'">
                    <td>Pris (DKK)</td>
                    <td><input type="number" v-model="newActivity.price" /></td>
                </tr>
                <tr>
                    <td>Kategori</td>
                    <td>
                        <select v-model="newActivity.category">
                            <option value="free">Ikke bindende tilmelding</option>
                            <option value="binding">Bindende tilmelding</option>
                            <option value="offSite">Udenfor pladsen</option>
                            <option value="hereAndNow">Her&amp;Nu betaling</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td>Push-beskeder</td>
                    <td>
                        <select v-model="newActivity.pushNotificationMinInAdvance">
                            <option value="0">Ingen</option>
                            <option value="15">15 min før</option>
                            <option value="30">30 min før</option>
                            <option value="45">45 min før</option>
                            <option value="60">1 time før</option>
                            <option value="90">1½ time før</option>
                            <option value="120">2 timer før</option>
                            <option value="150">2½ timer før</option>
                            <option value="180">3 timer før</option>
                        </select>
                    </td>
                </tr>
            </table>
        </div>
        <div>
            <button v-show="activeTab == 'create-activity'" type="button" style="margin-bottom: 5px" @click="createActivityModal">Opret aktivitet</button>
            <button v-show="activeTab == 'create-series'" type="button" style="margin-bottom: 5px" @click="createSeriesModal">Opret serie</button>
            <div v-if="!submittable && submitAttempt" style="color:red">Vælg et billede!</div>
            <div v-if="noActivitiesInSeries" style="color:red">Serien indeholder ingen aktiviteter!</div>
            <div class="spinner" v-if="creatingActivity"></div>
            <div v-if="activityCreated">Aktivitet oprettet</div>
            <div v-if="seriesCreated">Serie oprettet</div>
        </div>
    </div>

    <!-- SERIES -->
    <div v-if="activeTab === 'series'">
        <div v-for="series in series" v-if="series.activities" class="date" style="margin-bottom: 20px">
            <div style="font-weight: bold;">{{series.startDate | localizeDateSimple}} - {{series.endDate | localizeDateSimple}}, {{mapRepeatToReadableRepeat(series.repeat)}}</div>
            <div v-if="series.repeat === 'weekly' || series.repeat === 'monthly'" style="margin-top: 5px">
              <span>Gentages </span><span v-if="series.repeat === 'monthly'"> første </span>
              <span v-for="(repeatDay, index) in mapRepeatDaysToReadableDays(series.repeatDays)"><span v-if="index != 0">, </span>{{repeatDay}}</span>
              <span v-if="series.repeat === 'monthly'">i hver måned</span>

            </div>
            <div class="activity" style="margin-top: 5px" v-if="getActivity(getFirstActivityKey(series))">
                <img :src="getActivity(getFirstActivityKey(series)).pic" alt="aktivitet"/>
                <div class="content">
                    <div class="title">{{getActivity(getFirstActivityKey(series)).title[currentLang]}}</div>
                    <div>{{getActivity(getFirstActivityKey(series)).startTimeInMinutes | minutesToTimeOfDay}} - {{getActivity(getFirstActivityKey(series)).endTimeInMinutes | minutesToTimeOfDay}}</div>
                    <div>{{getActivity(getFirstActivityKey(series)).about[currentLang]}}</div>
                    <div>
                        <span @click="editSeries(series)" class="edit">rediger</span>
                        <span v-if="getActivity(getFirstActivityKey(series)).title['da']" class="translated-da">DA</span>
                        <span v-if="getActivity(getFirstActivityKey(series)).title['de']" class="translated-de">DE</span>
                        <span @click="deleteSeriesModal(series)" class="delete">slet</span>
                    </div>
                </div>
            </div>
            <div>{{Object.keys(series.activities).length}} aktiviteter i serie</div>
        </div>
        <div v-if="series && series.length === 0">Ingen serier</div>

    </div>

    <!-- CONTACT -->
    <div v-if="activeTab == 'contact'">
        <table v-if="contact">
<!--            <tr>
                <td>
                  <select v-model="contactInputLanguage.about" class="lang-dropdown">
                      <option value="da">Kontakt os (dansk)</option>
                      <option value="de">Kontakt os (tysk)</option>
                  </select>
                </td>
                <td>
                    <textarea rows="10" cols="60" v-model="contact.about[contactInputLanguage.about]"></textarea>
                </td>
            </tr>-->
            <tr>
                <td>
                  <select v-model="contactInputLanguage.about" class="lang-dropdown">
                      <option value="da">Kontakt info (dansk)</option>
                      <option value="de">Kontakt info (tysk)</option>
                  </select>
                </td>
                <td>
                    <textarea rows="10" cols="60" v-model="contact.about[contactInputLanguage.about]"></textarea>
                </td>
            </tr>
            <tr>
                <td colspan="2">
                    <button type="button" @click="updateContact">Gem ændringer</button>
                    <div v-if="contactUpdated">ændringer gemt</div>
                </td>
            </tr>
        </table>

    </div>

    <!-- PUSH NOTIFICATIONS -->
    <div v-if="activeTab == 'push-notifications'">

    </div>

    <!-- SETTINGS -->
    <div v-if="activeTab == 'settings'">
        <button @click="deleteOldActivities">Slet gamle aktiviteter</button>
        <div>(mere end en måned gamle)</div>
        <div class="spinner" v-if="deletingOldActivities"></div>
        <div v-if="oldActivitiesDeleted">Gamle aktiviteter slettet</div>

        <h2>Pop-up beskeder ved aktivitet-tilmelding</h2>

        <table class="edit-activity">
            <tr>
                <td>
                  <select v-model="signupNotesInputLanguage.hereAndNow" class="lang-dropdown">
                    <option value="da">Her&amp;Nu betaling (dansk)</option>
                    <option value="de">Her&amp;Nu betaling (tysk)</option>
                  </select>
                </td>
                <td>
                  <textarea rows="8" cols="40" v-model="signupNotes.hereAndNow[signupNotesInputLanguage.hereAndNow]"></textarea>
                </td>
            </tr>
            <tr>
                <td>
                  <select v-model="signupNotesInputLanguage.binding" class="lang-dropdown">
                    <option value="da">Bindende tilmelding (dansk)</option>
                    <option value="de">Bindende tilmelding (tysk)</option>
                  </select>
                </td>
                <td>
                  <textarea rows="8" cols="40" v-model="signupNotes.binding[signupNotesInputLanguage.binding]"></textarea>
                </td>
            </tr>
            <tr>
                <td>
                  <select v-model="signupNotesInputLanguage.free" class="lang-dropdown">
                    <option value="da">Ikke bindende tilmelding (dansk)</option>
                    <option value="de">Ikke bindende tilmelding (tysk)</option>
                  </select>
                </td>
                <td>
                  <textarea rows="8" cols="40" v-model="signupNotes.free[signupNotesInputLanguage.free]"></textarea>
                </td>
            </tr>
            <tr>
                <td>
                  <select v-model="signupNotesInputLanguage.offSite" class="lang-dropdown">
                    <option value="da">Udenfor pladsen (dansk)</option>
                    <option value="de">Udenfor pladsen (tysk)</option>
                  </select>
                </td>
                <td>
                  <textarea rows="8" cols="40" v-model="signupNotes.offSite[signupNotesInputLanguage.offSite]"></textarea>
                </td>
            </tr>
        </table>

        <div>
            <button type="button" @click="updateSignupNotes">Gem ændringer</button>
            <div v-if="signupNotesUpdated">ændringer gemt</div>
        </div>

    </div>

    <!-- MODAL -->
    <modal v-if="modal.show" :ok="modal.ok" :close="modal.close" @ok="modal.action" @close="modal.show = false">
        <h3 slot="header" v-text="modal.header"></h3>
        <div slot="body" v-html="modal.body"></div>
    </modal>

</div>
</div>
</template>

<script>
import firebase from 'firebase'
import Modal from './Modal'
import VueTimepicker from 'vue2-timepicker'
import { da } from '../assets/flatpickr-da'
import * as moment from 'moment'
moment.locale('da')

// Initialize Firebase
let config = {
  apiKey: 'AIzaSyAynycu2fcbWAusFICFIN026B-sw32js8o',
  authDomain: 'hscamping-9c323.firebaseapp.com',
  databaseURL: 'https://hscamping-9c323.firebaseio.com',
  storageBucket: 'hscamping-9c323.appspot.com',
  messagingSenderId: '761576838574'
}
let firebaseApp = firebase.initializeApp(config)
let db = firebaseApp.database()

let usersRef = db.ref('users')
let activitiesRef = db.ref('activities')
let seriesRef = db.ref('series')
let contactRef = db.ref('contact')
let signupNotesRef = db.ref('settings/signupNotes')

export default {
  components: { Modal, VueTimepicker },
  data () {
    return {
      activeTab: 'activities',
      currentLang: 'da',
      currentSearch: '',
      currentDate: '',
      previewImage: null,
      activeActivity: null,
      activeSeries: null,
      inputLanguage: null,
      signupNotesInputLanguage: null,
      contactInputLanguage: null,
      showTooManyParticipants: false,
      newActivity: null,
      submittable: false,
      submitAttempt: false,
      activityCreated: false,
      seriesCreated: false,
      creatingActivity: false,
      updatingActiveActivity: false,
      deletingOldActivities: false,
      oldActivitiesDeleted: false,
      contactUpdated: false,
      signupNotesUpdated: false,
      activeActivityUpdated: false,
      activeActivityFile: null,
      activeActivityPreviewImage: null,
      noActivitiesInSeries: false,
      today: moment().format('YYYY-MM-DD'),
      aMonthFromNow: moment().add(1, 'months').format('YYYY-MM-DD'),
      yesterday: moment().add(-1, 'days').toDate(),
      aMonthAgo: moment().add(-1, 'months').toDate(),
      participantToAdd: '',
      participantToRemove: {
        key: null,
        activity: null
      },
      participantToConfirm: {
        key: null,
        activity: null,
        confirm: null
      },
      activityToDelete: null,
      seriesToDelete: null,
      modal: {
        show: false,
        header: 'Bekræft handling',
        body: 'Er du sikker?',
        action: null,
        ok: 'OK',
        close: 'FORTRYD'
      },
      fpOptions: {
        locale: da,
        altInput: true,
        altFormat: 'j. F Y'
      },
      fpOptionsRange: {
        locale: da,
        altInput: true,
        altFormat: 'j. F Y',
        mode: 'range'
      },
      dataLoaded: false,
      authorized: true
    }
  },
  firebase: {
    users: usersRef,
    activities: activitiesRef,
    series: seriesRef,
    contact: {
      source: contactRef,
      asObject: true
    },
    signupNotes: {
      source: signupNotesRef,
      asObject: true
    }
  },
  mounted () {
    activitiesRef.once('value', snapshot => {
      this.dataLoaded = true
    })
  },
  created () {
    // hsweb@hsweb.dk/hscamping42
    this.currentUser = firebase.auth().signInWithEmailAndPassword(this.$route.params.login, this.$route.params.key).then(() => {
      this.authorized = true
    }).catch((error) => {
      this.authorized = false
      var errorCode = error.code
      var errorMessage = error.message
      console.log(errorCode + ' ' + errorMessage)
    })
    this.resetInputLang()
    this.resetNewActivity()
  },
  methods: {
    filter (activities) {
      // filter out dates outside of range
      if (this.currentDate !== '') {
        activities = activities.filter(activity => (moment(activity.date).isSameOrAfter(moment(this.currentDateRange.from)) && moment(activity.date).isSameOrBefore(moment(this.currentDateRange.to))))
      } else {
        activities = activities.filter(activity => (moment(activity.date).isSameOrAfter(moment(this.today)) && moment(activity.date).isSameOrBefore(moment(this.today).add(1, 'months'))))
      }
      if (this.currentSearch !== '') {
        activities = activities.filter(activity => activity.title[this.currentLang].toLowerCase().includes(this.currentSearch.toLowerCase()))
      }
      return activities
    },
    isPastActivity (activity) {
      return moment(activity.date).add(activity.endTimeInMinutes, 'minutes').isBefore(moment())
    },
    getActivity (id) {
      return this.activities.find(activity => activity['.key'] === id)
    },
    getSeries (id) {
      return this.series.find(series => series['.key'] === id)
    },
    getFirstActivityKey (series) {
      if (!series.activities) return
      var activitiesList = Object.keys(series.activities).map(key => {
        return {key: key, value: series.activities[key]}
      })
      return activitiesList[0] ? activitiesList[0].value : null
    },
    getActivities (date) {
      // sorting activities by start time
      return this.activities.filter(activity => activity.date === date).sort((a, b) => {
        if (a.startTimeInMinutes > b.startTimeInMinutes) {
          return 1
        }
        if (a.startTimeInMinutes < b.startTimeInMinutes) {
          return -1
        }
        return 0
      })
    },
    confirmParticipantModal (participant, activity, confirm) {
      this.modal.action = this.confirmParticipant
      this.participantToConfirm.key = participant.key
      this.participantToConfirm.activity = activity
      this.participantToConfirm.confirm = confirm
      this.modal.header = 'Bekræft tilmelding'
      this.modal.body = 'Afkræft tilmelding (og betaling) for ' + participant.name + '?'
      if (confirm) {
        this.modal.body = 'Bekræft tilmelding (og betaling) for ' + participant.name + '?'
      }
      this.modal.ok = 'OK'
      this.modal.close = 'FORTRYD'
      this.modal.show = true
    },
    confirmParticipant () {
      activitiesRef.child(this.participantToConfirm.activity['.key'] + '/participants/' + this.participantToConfirm.key).update({'confirmed': this.participantToConfirm.confirm})
    },
    getParticipants (activity) {
      // get all users currently signed up for activity
      // we have to do a lookup on the ref instead of using activity directly
      // since this gives us realtime data
      var participants = this.activities.find(act => act['.key'] === activity['.key']).participants

      if (!participants) {
        return
      }
      // convert object to array
      var participantsList = Object.keys(participants).map(key => {
        return {key: key, value: participants[key]}
      })

      // find the users objects and sort it by name
      return participantsList.map(participant => this.findUser(participant.value, participant.key)).sort((a, b) => {
        if (a.name.toLowerCase() > b.name.toLowerCase()) {
          return 1
        }
        if (a.name.toLowerCase() < b.name.toLowerCase()) {
          return -1
        }
        return 0
      })
    },
    findUser (participant, key) {
      let user = this.users.find(user => user['.key'] === participant.uid)
      if (user === undefined) return {name: participant.uid, confirmed: participant.confirmed, key: key}
      return {...user, confirmed: participant.confirmed, key: key}
    },
    getParticipantsAmount (activity) {
      let participants = this.activities.find(act => act['.key'] === activity['.key']).participants
      if (!participants) return 0
      return Object.keys(participants).length
    },
    getMaxAmountOfParticipants (activity) {
      return this.activities.find(act => act['.key'] === activity['.key']).maxAmountOfParticipants
    },
    removeParticipantModal (participant, activity) {
      this.modal.action = this.removeParticipant
      this.participantToRemove.key = participant.key
      this.participantToRemove.activity = activity
      this.modal.header = 'Fjern deltager'
      this.modal.body = 'Fjern ' + participant.name + ' fra deltagerlisten?'
      if (participant.confirmed) {
        this.modal.body += '<br/><span style="color:red">Deltager står som bekræftet til aktiviteten</span>'
      }
      this.modal.ok = 'OK'
      this.modal.close = 'FORTRYD'
      this.modal.show = true
    },
    removeParticipant () {
      activitiesRef.child(this.participantToRemove.activity['.key'] + '/participants/' + this.participantToRemove.key).remove()
    },
    addParticipantModal () {
      if (!this.participantToAdd) return

      let participants = this.activities.find(act => act['.key'] === this.activeActivity['.key']).participants

      // check if activity has room for more participants
      if ((participants && this.activeActivity.maxAmountOfParticipants != null && Object.keys(participants).length >= this.activeActivity.maxAmountOfParticipants) || (!participants && this.activeActivity.maxAmountOfParticipants != null && this.activeActivity.maxAmountOfParticipants === 0)) {
        this.showTooManyParticipants = true
        setTimeout(() => { this.showTooManyParticipants = false }, 5000)
        return
      }

      this.modal.action = this.addParticipant
      this.modal.header = 'Tilmeld ' + this.participantToAdd + '?'
      this.modal.body = '<span style="display:flex;"><label><input type="checkbox" id="confirmParticipant"> Bekræft tilmelding (og betaling)</label></span>'
      this.modal.ok = 'TILMELD'
      this.modal.close = 'FORTRYD'
      this.modal.show = true
    },
    addParticipant () {
      // checking if activity still exists
      activitiesRef.child(this.activeActivity['.key']).once('value', (snapshot) => {
        if (snapshot.exists()) {
          activitiesRef.child(this.activeActivity['.key'] + '/participants/').push({uid: this.participantToAdd, confirmed: document.getElementById('confirmParticipant').checked})
          this.participantToAdd = ''
        }
      })
    },
    deleteOldActivities () {
      // get a snapshot of activities so they dont update while we delete
      var snapshot = this.activities.map((activity) => activity)

      this.deletingOldActivities = true

      // delete activities more than a month old
      snapshot.forEach((activity) => {
        if (new Date(activity.date).getTime() < this.aMonthAgo.getTime()) {
          this.deleteActivity(activity)
        }
      })

      // right now we are actually telling the user that the activities have been deleted before they have been and without validation
      this.deletingOldActivities = false
      this.oldActivitiesDeleted = true
      setTimeout(() => { this.oldActivitiesDeleted = false }, 5000)
    },
    setActiveTab (tab) {
      this.activeTab = tab
    },
    edit (activity) {
      // create a deep copy of the activity
      this.activeActivity = JSON.parse(JSON.stringify(activity))
      this.activeTab = 'edit-activity'
    },
    editSeries (series) {
      // we use the first activity in the series as a reference
      let activity = this.getActivity(this.getFirstActivityKey(series))
      // create a deep copy of the activity
      this.activeActivity = JSON.parse(JSON.stringify(activity))
      this.activeSeries = series
      this.activeTab = 'edit-series'
    },
    onFileChange (e) {
      var files = e.target.files || e.dataTransfer.files
      if (!files.length) {
        return
      }

      this.newActivity.file = files[0]
      this.submittable = true

      this.createPreviewImage(this.newActivity.file, 'new')
    },
    onActiveActivityFileChange (e) {
      var files = e.target.files || e.dataTransfer.files
      if (!files.length) {
        return
      }

      this.activeActivityFile = files[0]

      this.createPreviewImage(this.activeActivityFile, 'active')
    },
    createPreviewImage (file, target) {
      var reader = new FileReader()

      var vm = this

      if (target === 'active') {
        reader.onload = (e) => {
          vm.activeActivityPreviewImage = e.target.result
        }
      } else if (target === 'new') {
        reader.onload = (e) => {
          vm.previewImage = e.target.result
        }
      }
      reader.readAsDataURL(file)
    },
    deleteSeriesModal (series) {
      this.modal.action = this.deleteSeries
      this.seriesToDelete = series
      this.modal.header = 'Slet serie'
      this.modal.body = 'Fjern serie "' + this.getActivity(this.getFirstActivityKey(series)).title[this.currentLang] + '" fra kalenderen?'
      this.modal.ok = 'OK'
      this.modal.close = 'FORTRYD'
      this.modal.show = true
    },
    deleteSeries (series) {
      if (!series) {
        series = this.seriesToDelete
      }
      // convert object to array
      let ids = Object.keys(series.activities).map(key => {
        return {key: key, value: series.activities[key]}
      })

      // get the references to the activities so that we can delete them
      let activitiesList = []

      ids.forEach(id => {
        let activity = this.activities.find(activity => activity['.key'] === id.value)
        if (activity) activitiesList.push(activity)
      })

      activitiesList.forEach(activity => {
        this.deleteActivity(activity)
      })
    },
    deleteActivityModal (activity) {
      this.modal.action = this.deleteActivity
      this.activityToDelete = activity
      this.modal.header = 'Slet aktivitet'
      this.modal.body = 'Fjern aktivitet "' + activity.title[this.currentLang] + '" fra kalenderen?'
      this.modal.ok = 'OK'
      this.modal.close = 'FORTRYD'
      this.modal.show = true
    },
    removeActivityFromSeries (activityId, seriesId) {
      let activities = this.series.find(series => series['.key'] === seriesId).activities

      if (!activities) {
        return
      }
      // convert object to array
      var activitiesList = Object.keys(activities).map(key => {
        return {key: key, value: activities[key]}
      })

      activitiesList.forEach(activity => {
        if (activity.value === activityId) {
          seriesRef.child(seriesId + '/activities/' + activity.key).remove()
        }
      })

      this.checkDeleteEmptySeries(seriesId)
    },
    checkDeleteEmptySeries (seriesId) {
      // check if activities list of series is empty
      seriesRef.child(seriesId + '/activities').once('value', (snapshot) => {
        if (!snapshot.exists()) {
          // delete series image in firebase storage
          let imageRef = this.series.find(series => series['.key'] === seriesId)['.key']

          firebase.storage().ref('series/' + imageRef).delete().then(() => {
            seriesRef.child(seriesId).remove()
          })
        }
      })
    },
    deleteActivity (activity) {
      if (!activity) {
        activity = this.activityToDelete
      }

      activitiesRef.child(activity['.key']).remove()

      if (activity.series) {
        // remove the reference to the activity in the series
        this.removeActivityFromSeries(activity['.key'], activity.series)
        return
      }

      // delete image in firebase storage
      var imageRef = firebase.storage().ref('activities/' + activity['.key'])

      imageRef.delete()
    },
    createSeriesModal () {
      this.submitAttempt = true
      setTimeout(() => { this.submitAttempt = false }, 5000)

      if (!this.submittable) {
        return
      }
      let dates = this.getSelectedDates(this.getDates(this.newActivity.startDate, this.newActivity.endDate), this.newActivity.repeat, this.newActivity.repeatDays)

      if (!dates) return

      if (dates.length === 0) {
        this.noActivitiesInSeries = true
        setTimeout(() => { this.noActivitiesInSeries = false }, 5000)
        return
      }

      this.modal.action = this.createSeries
      this.modal.header = 'Opret serie'
      this.modal.body = 'Dette vil oprette ' + dates.length + ' aktiviteter. Er du sikker?'
      this.modal.ok = 'OK'
      this.modal.close = 'FORTRYD'
      this.modal.show = true
    },
    createActivityModal () {
      this.submitAttempt = true
      setTimeout(() => { this.submitAttempt = false }, 5000)

      if (!this.submittable) {
        return
      }
      this.modal.action = this.createNewActivity
      this.modal.header = 'Opret aktivitet'
      this.modal.body = 'Er du sikker?'
      this.modal.ok = 'OK'
      this.modal.close = 'FORTRYD'
      this.modal.show = true
    },
    createNewActivity () {
      this.creatingActivity = true

      // Create GUID key
      var postKey = activitiesRef.push().key
      var storageRef = firebase.storage().ref('activities/' + postKey)

      // Upload file
      var task = storageRef.put(this.newActivity.file)

      var vm = this

      task.then(() => {
        var downloadURL = task.snapshot.downloadURL

        var activity = vm.newActivity

        var updates = {}
        var postData = {
          title: activity.title,
          about: activity.about,
          date: activity.date,
          startTimeInMinutes: vm.timeToTimeInMinutes(activity.startTime),
          endTimeInMinutes: vm.timeToTimeInMinutes(activity.endTime),
          location: activity.location,
          organiser: activity.organiser,
          info: activity.info,
          pic: downloadURL,
          visibleTo: activity.visibleTo,
          participants: null,
          interestedIn: null,
          who: activity.who,
          where: activity.where,
          what: activity.what,
          priceCategory: activity.priceCategory,
          price: activity.price ? Math.max(parseInt(activity.price, 10), 0) : 0,
          category: activity.category,
          maxAmountOfParticipants: activity.maxAmountOfParticipants ? Math.max(parseInt(activity.maxAmountOfParticipants, 10), 0) : null,
          pushNotificationMinInAdvance: parseInt(activity.pushNotificationMinInAdvance)
        }
        updates['activities/' + postKey] = postData
        firebase.database().ref().update(updates).then(() => {
          vm.resetInputLang()
          vm.resetNewActivity()
          vm.activityCreated = true
          vm.creatingActivity = false
          setTimeout(() => { vm.activityCreated = false }, 5000)
        })
      })
    },
    createSeries () {
      this.creatingActivity = true

      // Create series key
      var seriesKey = seriesRef.push().key
      seriesRef.child(seriesKey).set({
        startDate: this.newActivity.startDate,
        endDate: this.newActivity.endDate,
        repeat: this.newActivity.repeat,
        repeatDays: this.newActivity.repeatDays
      })

      var storageRef = firebase.storage().ref('series/' + seriesKey)

      // Upload file
      var task = storageRef.put(this.newActivity.file)

      var vm = this

      task.then(() => {
        var downloadURL = task.snapshot.downloadURL
        var activity = vm.newActivity

        let promises = []

        let dates = vm.getSelectedDates(vm.getDates(activity.startDate, activity.endDate), activity.repeat, activity.repeatDays)

        // iterate over amount of activities to create
        dates.forEach(date => {
          var postData = {
            title: activity.title,
            about: activity.about,
            date: date,
            series: seriesKey,
            startTimeInMinutes: vm.timeToTimeInMinutes(activity.startTime),
            endTimeInMinutes: vm.timeToTimeInMinutes(activity.endTime),
            location: activity.location,
            organiser: activity.organiser,
            info: activity.info,
            pic: downloadURL,
            visibleTo: activity.visibleTo,
            participants: null,
            interestedIn: null,
            who: activity.who,
            where: activity.where,
            what: activity.what,
            priceCategory: activity.priceCategory,
            price: activity.price ? Math.max(parseInt(activity.price, 10), 0) : 0,
            category: activity.category,
            maxAmountOfParticipants: activity.maxAmountOfParticipants ? Math.max(parseInt(activity.maxAmountOfParticipants, 10), 0) : null,
            pushNotificationMinInAdvance: parseInt(activity.pushNotificationMinInAdvance)
          }
          promises.concat(vm.createActivity(postData, seriesKey))
        })
        Promise.all(promises).then(values => {
          vm.resetInputLang()
          vm.resetNewActivity()
          vm.seriesCreated = true
          vm.creatingActivity = false
          setTimeout(() => { vm.seriesCreated = false }, 5000)
        })
      })
    },
    createActivity (postData, seriesKey) {
      let promises = []
      // generate key
      var postKey = activitiesRef.push().key
      var updates = {}
      updates['activities/' + postKey] = postData
      promises.push(firebase.database().ref().update(updates))
      promises.push(seriesRef.child(seriesKey + '/activities/').push(postKey))
      return promises
    },
    updateContact () {
      var updates = {
        about: this.contact.about
        /* info: this.contact.info */
      }

      contactRef.update(updates).then(() => {
        this.contactUpdated = true
        var vm = this
        setTimeout(() => { vm.contactUpdated = false }, 5000)
      })
    },
    updateSignupNotes () {
      var updates = {
        hereAndNow: this.signupNotes.hereAndNow,
        binding: this.signupNotes.binding,
        free: this.signupNotes.free,
        offSite: this.signupNotes.offSite
      }

      signupNotesRef.update(updates).then(() => {
        this.signupNotesUpdated = true
        var vm = this
        setTimeout(() => { vm.signupNotesUpdated = false }, 5000)
      })
    },
    updateActiveSeriesModal () {
      this.modal.action = this.updateActiveSeries
      this.modal.header = 'Opdater serie'
      this.modal.body = 'Opdater serien og alle tilknyttede aktiviteter?'
      this.modal.ok = 'OK'
      this.modal.close = 'FORTRYD'
      this.modal.show = true
    },
    updateActiveSeries () {
      this.updatingActiveActivity = true

      // get the ids of all activities of the series
      var ids = Object.keys(this.activeSeries.activities).map(key => {
        return {key: key, value: this.activeSeries.activities[key]}
      })

      // get the references to the activities so that we can update them
      let activitiesList = []

      ids.forEach(id => {
        let activity = this.activities.find(activity => activity['.key'] === id.value)
        if (activity) activitiesList.push(activity)
      })

      // update all activities, one at a time
      activitiesList.forEach(activity => {
        var key = activity['.key']

        var imageKey = this.activeSeries['.key']

        var storageRef = firebase.storage().ref('series/' + imageKey)
        var currentActivityRef = activitiesRef.child(key)

        var vm = this

        var act = this.activeActivity

        if (this.activeActivityFile) {
          // Upload file
          var task = storageRef.put(this.activeActivityFile)

          task.then(() => {
            var downloadURL = task.snapshot.downloadURL

            currentActivityRef.update({ pic: downloadURL }).then(() => {
              vm.activeActivityUpdated = true
              vm.updatingActiveActivity = false
              vm.activeActivity = JSON.parse(JSON.stringify(vm.activities.find(a => a['.key'] === act['.key'])))
              setTimeout(() => { vm.activeActivityUpdated = false }, 5000)
            })
          })
        }

        currentActivityRef.update({
          title: act.title,
          about: act.about,
          startTimeInMinutes: this.timeToTimeInMinutes(this.activeActivityStartTime),
          endTimeInMinutes: this.timeToTimeInMinutes(this.activeActivityEndTime),
          location: act.location,
          organiser: act.organiser,
          info: act.info,
          visibleTo: act.visibleTo,
          who: act.who,
          where: act.where,
          what: act.what,
          priceCategory: act.priceCategory,
          price: act.price ? Math.max(parseInt(act.price, 10), 0) : 0,
          category: act.category,
          maxAmountOfParticipants: act.maxAmountOfParticipants ? Math.max(parseInt(act.maxAmountOfParticipants, 10), 0) : null,
          pushNotificationMinInAdvance: parseInt(act.pushNotificationMinInAdvance)
        }).then(() => {
          // file not updated so we are done uploading
          if (!this.activeActivityFile) {
            this.activeActivityUpdated = true
            this.updatingActiveActivity = false
            this.activeActivity = JSON.parse(JSON.stringify(this.activities.find(a => a['.key'] === act['.key'])))
            setTimeout(() => { this.activeActivityUpdated = false }, 5000)
          }
        })
      })
    },
    updateActiveActivityModal () {
      if (this.activeActivity.series) {
        this.modal.action = this.updateActiveActivity
        this.modal.header = 'Opdater aktivitet'
        this.modal.body = 'Aktiviteten vil ikke længere være en del af sin serie. Er du sikker?'
        this.modal.ok = 'OK'
        this.modal.close = 'FORTRYD'
        this.modal.show = true
      } else {
        this.modal.action = this.updateActiveActivity
        this.modal.header = 'Opdater aktivitet'
        this.modal.body = 'Er du sikker?'
        this.modal.ok = 'OK'
        this.modal.close = 'FORTRYD'
        this.modal.show = true
      }
    },
    updateActiveActivity () {
      this.updatingActiveActivity = true
      var key = this.activeActivity['.key']

      var storageRef = firebase.storage().ref('activities/' + key)
      var activeActivityRef = activitiesRef.child(key)

      // if activity is part of a series, download the series image and upload it to the storageRef of the activity
      if (this.activeActivity.series && !this.activeActivityFile) {
        var seriesImageRef = firebase.storage().ref('series/' + this.activeActivity.series)
        seriesImageRef.getDownloadURL().then(url => {
          // download file
          var xhr = new XMLHttpRequest()
          xhr.responseType = 'blob'
          xhr.onload = event => {
            var blob = xhr.response

            storageRef.put(blob).then(snapshot => {
              activeActivityRef.update({
                pic: snapshot.downloadURL
              })
              this.removeActivityFromSeries(key, this.activeActivity.series)
              activeActivityRef.child('series').remove()
            })
          }
          xhr.open('GET', url)
          xhr.send()
        })
      }

      // if activity is part of a series, remove the reference to the activity
      // in the series and remove the series property of the activity
      // if thisActivityFile is false we remove the activity in the imagedownload callbak instead (earlier in this method)
      if (this.activeActivity.series && this.activeActivityFile) {
        this.removeActivityFromSeries(key, this.activeActivity.series)
        activeActivityRef.child('series').remove()
      }

      var vm = this

      var activity = this.activeActivity

      if (this.activeActivityFile) {
        // Upload file
        var task = storageRef.put(this.activeActivityFile)

        task.then(() => {
          var downloadURL = task.snapshot.downloadURL

          activeActivityRef.update({
            pic: downloadURL
          })
          .then(() => {
            vm.activeActivityUpdated = true
            vm.updatingActiveActivity = false
            vm.activeActivity = JSON.parse(JSON.stringify(vm.activities.find(act => act['.key'] === activity['.key'])))
            setTimeout(() => { vm.activeActivityUpdated = false }, 5000)
          })
        })
      }

      activeActivityRef.update({
        title: activity.title,
        about: activity.about,
        date: activity.date,
        startTimeInMinutes: this.timeToTimeInMinutes(this.activeActivityStartTime),
        endTimeInMinutes: this.timeToTimeInMinutes(this.activeActivityEndTime),
        location: activity.location,
        organiser: activity.organiser,
        info: activity.info,
        visibleTo: activity.visibleTo,
        who: activity.who,
        where: activity.where,
        what: activity.what,
        priceCategory: activity.priceCategory,
        price: activity.price ? Math.max(parseInt(activity.price, 10), 0) : 0,
        category: activity.category,
        maxAmountOfParticipants: activity.maxAmountOfParticipants ? Math.max(parseInt(activity.maxAmountOfParticipants, 10), 0) : null,
        pushNotificationMinInAdvance: parseInt(activity.pushNotificationMinInAdvance)
      }).then(() => {
        // file not updated so we are done uploading
        if (!this.activeActivityFile) {
          this.activeActivityUpdated = true
          this.updatingActiveActivity = false
          this.activeActivity = JSON.parse(JSON.stringify(this.activities.find(act => act['.key'] === activity['.key'])))
          setTimeout(() => { this.activeActivityUpdated = false }, 5000)
        }
      })
    },
    displayGuestOn (guestOn) {
      if (guestOn === 'camping') {
        return 'HSC'
      } else if (guestOn === 'partner') {
        return 'FP'
      }
      return ''
    },
    timeToTimeInMinutes (time) {
      var hours = parseInt(time.HH, 10)
      var minutes = parseInt(time.mm, 10)

      return hours * 60 + minutes
    },
    timeInMinutesToTime (timeInMinutes) {
      var hours = Math.floor(timeInMinutes / 60).toString()
      var minutes = (timeInMinutes % 60).toString()

      // add leading zero if single digit
      hours = hours.length === 1 ? '0' + hours : hours
      minutes = minutes.length === 1 ? '0' + minutes : minutes

      return {
        HH: hours,
        mm: minutes
      }
    },
    onActiveActivityStartTimeChanged (eventData) {
      this.activeActivity.startTimeInMinutes = this.timeToTimeInMinutes(eventData.data)
    },
    onActiveActivityEndTimeChanged (eventData) {
      this.activeActivity.endTimeInMinutes = this.timeToTimeInMinutes(eventData.data)
    },
    getDates (startDate, endDate) {
      let dates = []
      let now = moment(startDate)
      endDate = moment(endDate)

      while (now.isBefore(endDate) || now.isSame(endDate)) {
        dates.push(now.format('YYYY-MM-DD'))
        now.add(1, 'days')
      }

      return dates
    },
    mapRepeatToReadableRepeat (repeat) {
      switch (repeat) {
        case 'daily': return 'daglig'
        case 'weekly': return 'ugentlig'
        case 'monthly': return 'månedlig'
      }
    },
    mapRepeatDaysToReadableDays (repeatDays) {
      return repeatDays.map(day => {
        switch (parseInt(day, 10)) {
          case 0: return 'mandag'
          case 1: return 'tirsdag'
          case 2: return 'onsdag'
          case 3: return 'torsdag'
          case 4: return 'fredag'
          case 5: return 'lørdag'
          case 6: return 'søndag'
        }
      })
    },
    getSelectedDates (dates, repeat, repeatDays) {
      if (repeat === 'daily') {
        return dates
      }

      let selectedDays = []
      repeatDays = repeatDays.map(day => parseInt(day, 10))

      if (repeat === 'weekly') {
        dates.forEach(date => {
          if (repeatDays.indexOf(moment(date).weekday()) >= 0) {
            selectedDays.push(date)
          }
        })
      } else if (repeat === 'monthly') {
        dates.forEach(date => {
          // we are only interested in the first 7 days of each month
          if (repeatDays.indexOf(moment(date).weekday()) >= 0 && moment(date).date() <= 7) {
            selectedDays.push(date)
          }
        })
      }
      return selectedDays
    },
    resetInputLang () {
      this.inputLanguage = {title: 'da', about: 'da', location: 'da', info: 'da'}
      this.signupNotesInputLanguage = {hereAndNow: 'da', binding: 'da', free: 'da', offSite: 'da'}
      this.contactInputLanguage = {about: 'da'}
    },
    resetCurrentDate () {
      this.$refs.flatpickr.$el._flatpickr.setDate('')
    },
    resetNewActivity () {
      this.submittable = false
      this.submitAttempt = false
      this.previewImage = null

      const newFile = this.$refs.newActivityFile
      if (newFile) {
        newFile.value = ''
        newFile.type = ''
        newFile.type = 'file'
      }

      this.newActivity = {
        title: {
          da: '',
          de: ''
        },
        about: {
          da: '',
          de: ''
        },
        date: moment().format('YYYY-MM-DD'),
        startDate: moment().format('YYYY-MM-DD'),
        endDate: moment().format('YYYY-MM-DD'),
        repeat: 'daily',
        repeatDays: [],
        startTime: {
          HH: '12',
          mm: '00'
        },
        endTime: {
          HH: '12',
          mm: '00'
        },
        location: {
          da: '',
          de: ''
        },
        organiser: '',
        info: {
          da: '',
          de: ''
        },
        file: null,
        visibleTo: 'everyone',
        who: '',
        where: '',
        what: '',
        priceCategory: 'freeForAll',
        price: 0,
        category: 'free',
        maxAmountOfParticipants: null,
        pushNotificationMinInAdvance: 0
      }
    }
  },
  computed: {
    activeActivityStartTime () {
      return this.timeInMinutesToTime(this.activeActivity.startTimeInMinutes)
    },
    activeActivityEndTime () {
      return this.timeInMinutesToTime(this.activeActivity.endTimeInMinutes)
    },
    dates () {
      var res = []

      this.filter(this.activities).forEach(activity => {
        if (res.indexOf(activity.date) < 0) {
          res.push(activity.date)
        }
      })

      res.sort((a, b) => {
        if (a > b) {
          return 1
        }
        if (a < b) {
          return -1
        }
        return 0
      })

      return res
    },
    currentDateRange () {
      let dates = this.currentDate.split(' ')

      if (dates.length === 1) {
        return {from: this.currentDate, to: this.currentDate}
      } else if (dates.length === 3) {
        return {from: dates[0], to: dates[2]}
      } else {
        return {from: moment().format('YYYY-MM-DD'), to: moment().format('YYYY-MM-DD')}
      }
    }
  },
  watch: {
    activeTab (newVal) {
      if (newVal !== 'edit-activity') {
        this.activeActivityUpdated = false
        this.activeActivityFile = null
        this.activeActivityPreviewImage = null
        this.participantToAdd = ''
      }
      this.resetInputLang()
      this.resetNewActivity()
    }
  }
}
</script>

<style scoped>

</style>
