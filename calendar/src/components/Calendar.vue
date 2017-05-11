<template>
    <div>
        <div class="search" style="margin-bottom:25px">
          <input :placeholder="currentText.search" type="text" v-model="currentSearch" style="display: block;margin-bottom: 5px" />
        </div>

        <div class="date-picker">
          <div style="margin-top:-20px;width:100px;">{{ currentText.from }}</div><Flatpickr ref="flatpickrfrom" :options="fpOptions" v-model="currentFromDate" /> 
          <div style="margin-top:-20px;width:100px;">{{ currentText.to }}</div><Flatpickr ref="flatpickrto" :options="fpOptions" v-model="currentToDate" />
          <img v-if="currentFromDate != today || currentToDate != aWeekFromNow" @click="resetCurrentDate" src="../assets/calendar.svg"/>
        </div>

        <div v-for="date in dates" class="date">
            <div style="font-weight: bold;">{{ localizeDate(date) }}</div>
            <div v-for="activity in filter(getActivities(date))" @click="toggleActive(activity)" class="activity" :class="{past: isPastActivity(activity), activeActivity: isActiveActivity(activity)}">
              <img :src="activity.pic" alt="aktivitet"/>
              <div class="content">
                <div class="title">{{activity.title[currentLang]}}</div>
                <div style="font-size: 1.2em">{{activity.startTimeInMinutes | minutesToTimeOfDay}} - {{activity.endTimeInMinutes | minutesToTimeOfDay}}</div>
                <div>{{activity.about[currentLang]}}</div>
                <template v-if="isActiveActivity(activity)">
                  <div class="info"><span class="heading">{{currentText.time}}</span><span class="text">{{ localizeDate(date) }}, {{activity.startTimeInMinutes | minutesToTimeOfDay}} - {{activity.endTimeInMinutes | minutesToTimeOfDay}}</span></div>
                  <div class="info"><span class="heading">{{currentText.info}}</span><span class="text" style="white-space:pre-wrap;">{{activity.info[currentLang]}}</span></div>
                  <div class="info"><span class="heading">{{currentText.location}}</span><span class="text">{{activity.location[currentLang]}}</span></div>
                  <div class="info"><span class="heading">{{currentText.organiser}}</span><span class="text">{{activity.organiser}}</span></div>
                  <div class="info" v-if="activity.maxAmountOfParticipants"><span class="heading">{{currentText.maxParticipants}}</span><span class="text">{{activity.maxAmountOfParticipants}} ({{currentText.maxParticipantsSignUp}})</span></div>
                  <div class="info" v-if="activity.price !== 0 || activity.priceCategory === 'freeForAll'"><span class="heading">{{currentText.price}}</span>
                    <span class="text">
                      <span v-if="activity.priceCategory !== 'freeForAll'">{{activity.price}} DKK
                        <span v-if="activity.priceCategory === 'freeWithPackage'">({{currentText.freeWithPackage}})</span>
                      </span>
                      <span v-if="activity.priceCategory === 'freeForAll'">{{currentText.free}}</span>
                    </span>
                  </div>
                </template>
              </div>
              <img class="arrow" src="../assets/arrowdown.svg" style="position:absolute;bottom:0;right:0;width:22px;height:22px;user-select:none" />
            </div>
        </div>
          
        <div class="spinner" v-if="!dataLoaded"></div>

        <div v-if="(dataLoaded && dates && dates.length === 0 && currentFromDate !== '' && currentToDate !== '') || (currentFromDate === '' && currentToDate === '' && dataLoaded && dates.length === 0)">{{currentText.noActivities}}</div>
    </div>
</template>

<script>
import firebase from 'firebase'
import { da } from '../assets/flatpickr-da'
import { de } from '../assets/flatpickr-de'
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

export default {
  data () {
    return {
      currentLang: 'da',
      currentSearch: '',
      currentFromDate: '',
      currentToDate: '',
      today: moment().format('YYYY-MM-DD'),
      aWeekFromNow: moment().add(1, 'weeks').format('YYYY-MM-DD'),
      dataLoaded: false,
      fpOptions: {
        locale: da,
        altInput: true,
        altFormat: 'j. F Y'
      },
      activeActivities: [],
      danishText: {
        search: 'søg',
        from: 'fra dato',
        to: 'til dato',
        time: 'Tidspunkt',
        location: 'Sted',
        price: 'Pris',
        info: 'Info',
        organiser: 'Arrangør',
        maxParticipants: 'Maks deltagere',
        maxParticipantsSignUp: 'Tilmeld dig via appen eller i receptionen',
        freeWithPackage: 'gratis med aktivitetspakke',
        free: 'Gratis',
        noActivities: 'ingen aktiviteter'
      },
      germanText: {
        search: 'suche',
        from: 'von Datum',
        to: 'zu Datum',
        time: 'Zeit',
        location: 'Ort',
        price: 'Preis',
        info: 'Info',
        organiser: 'Veranstalter',
        maxParticipants: 'Teilnehmergrenze',
        maxParticipantsSignUp: 'Anmeldung über den App oder an der Rezeption',
        freeWithPackage: 'kostenlos mit Aktivitätspaket',
        free: 'kostenlos',
        noActivities: 'keine aktivitäten'
      },
      currentText: {
        search: '',
        from: '',
        to: '',
        time: '',
        location: '',
        price: '',
        info: '',
        organiser: '',
        freeWithPackage: '',
        free: '',
        noActivities: ''
      }
    }
  },
  firebase: {
    activities: activitiesRef,
    users: usersRef
  },
  beforeMount () {
    this.currentLang = this.$route.params.lang ? this.$route.params.lang : 'da'
    this.currentText = this.currentLang === 'de' ? this.germanText : this.danishText
    this.fpOptions.locale = this.currentLang === 'de' ? de : da
  },
  mounted () {
    activitiesRef.once('value', snapshot => {
      this.dataLoaded = true
    })
  },
  created () {
    this.currentFromDate = this.today
    this.currentToDate = this.aWeekFromNow
  },
  methods: {
    getActivity (id) {
      return this.activities.find(activity => activity['.key'] === id)
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
    toggleActive (activity) {
      if (!this.isActiveActivity(activity)) {
        this.activeActivities.push(activity)
      } else {
        this.activeActivities.splice(this.activeActivities.indexOf(activity), 1)
      }
    },
    isActiveActivity (activity) {
      return this.activeActivities.indexOf(activity) >= 0
    },
    filter (activities) {
      // filter out dates outside of range
      if (this.currentFromDate !== '' && this.currentToDate !== '') {
        activities = activities.filter(activity => (moment(activity.date).isSameOrAfter(moment(this.currentFromDate)) && moment(activity.date).isSameOrBefore(moment(this.currentToDate))))
      } else {
        activities = activities.filter(activity => (moment(activity.date).isSameOrAfter(moment(this.today)) && moment(activity.date).isSameOrBefore(moment(this.today).add(1, 'months'))))
      }

      // filter out activities that aren't translated
      activities = activities.filter(activity => activity.title[this.currentLang] !== '')

      // filter search
      if (this.currentSearch !== '') {
        activities = activities.filter(activity => activity.title[this.currentLang].toLowerCase().includes(this.currentSearch.toLowerCase()))
      }

      return activities
    },
    isPastActivity (activity) {
      return moment(activity.date).add(activity.endTimeInMinutes, 'minutes').isBefore(moment())
    },
    findUser (participant, key) {
      let user = this.users.find(user => user['.key'] === participant.uid)
      if (user === undefined) return {name: participant.uid, confirmed: participant.confirmed, key: key}
      return {...user, confirmed: participant.confirmed, key: key}
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
    getParticipantsAmount (activity) {
      let participants = this.activities.find(act => act['.key'] === activity['.key']).participants
      if (!participants) return 0
      return Object.keys(participants).length
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
    resetCurrentDate () {
      this.$refs.flatpickrfrom.$el._flatpickr.setDate(this.today)
      this.$refs.flatpickrto.$el._flatpickr.setDate(this.aWeekFromNow)
    },
    localizeDate (date) {
      let d = moment(date)
      d.locale(this.currentLang)

      let dayOfWeek = d.format('dddd')
      let stringDate = d.format('LL')

      return dayOfWeek + ', ' + stringDate
    }
  },
  computed: {
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
    }
  }
}
</script>

<style scoped>

</style>
