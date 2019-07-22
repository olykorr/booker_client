<template>
  <div class="calendar">
<!-- Modal Window for Events -->
     <modalwindow v-if="showEventWindow"  
     :sentUser="user" :sentEvent="sentEvent" :timeFormat="selTimeFormat"
     v-on:refresh="getEventsForMonth()"
     v-on:close="showEventWindow = false">
     </modalwindow>

<div>
<div class="menu">
          <div class="right-top-menu">
            <div class="ru-en-btn">
              <button v-if="nameMonth == 'en'" v-on:click="setRu()" class="btn btn-en">Ru</button>
              <button v-else-if="nameMonth == 'ru'" v-on:click="setEn()" class="btn btn-ru">En</button>
            </div>
            <div class="am-pm-btn">
              <button v-if="selTimeFormat == '12-24'" v-on:click="setTimeFormat('am-pm')" class="btn am-pm">AM/PM</button>
              <button v-else-if="selTimeFormat == 'am-pm'" v-on:click="setTimeFormat('12-24')" class="btn time12-24">12/24</button>
            </div>
            <div class="mon-sun-btn">
              <button v-if="weekDays == 'sun'" v-on:click="WeekFromMonday()" class="btn monday">Week from Monday</button>
              <button v-else-if="weekDays == 'mon'" v-on:click="WeekFromSunday()" class="btn sunday">Week from Sunday</button>
            </div>
          </div>
          <div class="btn-Book-Emp">
            <router-link :to="{ name: 'BookIt', params: { id: selRoom.id, time: selTimeFormat, day:selectedDay, month:selectedMonth, year:selectedYear }}"><button class="btn btn-success">Book It!</button></router-link>
            <router-link v-if="user.role == 'admin'" to="/emplist">
              <button class="btn List">User List</button>
            </router-link>
          </div>
        </div>

</div>



<!-- Calendar -->
    <p class="alert-danger" style="text-align: center;">{{errorMessage}}</p>
    <div class="row">
      <div class="shadow col-md-12">
          <p class="rooms">
            <button v-for="(room,index) in rooms" v-on:click="selectRoom(index)" 
            class="btnRoom btn btn-lg":class="{selBtn: room.id == selRoom.id}">
              {{room.name}}
            </button>
          </p>
          <div class="title">
          <button v-on:click="previousMonth()" class="btn">&#9668;</button>
          <p>{{getMonth[currentMonth]}} {{currentYear}}</p>
          <button v-on:click="nextMonth()" class="btn">&#9658;</button>
        </div>
        <table class="table table-bordered">
          <thead>
          <tr class="info">
            <th v-for="wday in getDays">{{wday}}</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="week in weeks">
            <td class="day" v-on:click="bookDay(day, currentMonth,currentYear)" v-for="day in week" :class="{date: day[0] == currentDay, choosenday:day[0] == chooseDay[0]}">{{day[0]}}
                <p  class="events" v-if="day.length > 1" v-for="event in day[1]" >
                  <button class="btn btn-link" v-on:click="showEvent(event)" >{{event.timeString}}</button>
                </p>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

     
  </div>
  </div>
</template>

<script>
import axios from 'axios'
import Modalwindow from './Modalwindow'
import BookIt from './BookIt'
export default {
  name: 'calendar',
  props: ['user'],
  data () {
    return {
      msg: '',
      errorMessage: '',
      date: new Date(),
      weeks: [],
      currentMonth: '',
      chooseDay: false,
      selectedDay: '',
      selectedMonth: '',
      selectedYear: '',
      currentYear: '',
      weekDays: 'mon',
      nameMonth: 'en',
      rooms: [],
      selRoom: {
        id: '1',
        name: ''
      },
      eventsMonth: [],
      showEventWindow: false,
      sentEvent: {},
      selTimeFormat: '12-24'
    }
  },
  
  methods:{

    //on click start
    setRu: function()
    {
      var self = this
      self.nameMonth = 'ru'
      self.weekDays = 'ru'
      self.getArrayCalendar()
    },

    setEn: function()
    {
      var self = this
      self.nameMonth = 'en'
      self.weekDays = 'sun'
      self.getArrayCalendar()
    },

    setTimeFormat: function(format)
    {
      var self = this
      self.selTimeFormat = format
      self.getEventsForMonth()
    },

     WeekFromMonday: function()
     {
      var self = this
      self.weekDays = 'mon'
      self.getArrayCalendar()
    },

    WeekFromSunday: function()
    {
      var self = this
      self.weekDays = 'sun'
      self.getArrayCalendar()
    },

    selectRoom: function(index)
    {
      var self = this
      self.selRoom = self.rooms[index] //save id of selected room
      self.getEventsForMonth()
    },

    nextMonth: function()
    {
      var self = this
      self.currentMonth += 1
      if (self.currentMonth > 11)
      {
        self.currentMonth = 0
        self.currentYear += 1
      }
      self.getEventsForMonth()
      self.getArrayCalendar()
    },

    previousMonth: function()
    {
      var self = this
      self.currentMonth -= 1
      if (self.currentMonth < 0){
        self.currentMonth = 11
        self.currentYear -= 1
      }
      self.getEventsForMonth()
      self.getArrayCalendar()
    },

    bookDay: function(day,month,year)
    {
      var self = this
      self.selectedDay = day[0]
      self.selectedMonth = month
      self.selectedYear = year
      self.chooseDay=day
      self.getEventsForMonth()
    },

    showEvent: function(event)
    {
      var self = this
      self.showEventWindow = true
      self.sentEvent = event
    },

//on click end

    getDayMonthYear: function()
    {
      var self = this
      self.selectedDay=self.date.getDate()
      self.selectedMonth =self.date.getMonth()
      self.selectedYear = self.date.getFullYear()
    },

//v-on:refresh call getArrayCalendar
    getEventsForMonth: function()
    {
      var self = this
      self.eventsMonth = []
      self.errorMessage = ''
      var year = self.currentYear
      var month = self.currentMonth+1
      var dateString = year + '-' + month
      axios
      .get(getUrl() + 'events/hash/' + self.user.hash + '/id_user/' + self.user.id +'/flag/like/time_start/' + dateString)
      .then(function (response) 
      {
          if (Array.isArray(response.data))
          {
            self.eventsMonth = response.data
            self.getArrayCalendar()
          }
          else
          {
            self.getArrayCalendar()
          }
      })
      .catch(function (error) {
        console.log(error)
      })
    },
 
 //build array call getDayNumber(), addEventsToCalendar()
 //getDate(),  where
    getArrayCalendar: function()
    {
      var self = this
      self.weeks = []
      var date = new Date(self.currentYear, self.currentMonth)
      self.weeks[0] = []
      for (var i=0; i < self.getDayNumber(date); i++)
      {
        self.weeks[0].push([])
      }
      var count = 0
      while (date.getMonth() == self.currentMonth)
      {
        self.weeks[count].push([date.getDate()])
        if (self.getDayNumber(date) % 7 == 6)
        {
          count++
          self.weeks[count] = []
        }
        date.setDate(date.getDate()+1)
      }
      self.addEventsToCalendar()
    },

    getDayNumber: function(date)
    {
      var self = this
      var numDay = date.getDay()
      if (self.weekDays == 'mon'|| self.weekDays == 'ru')
      {
        if (numDay == 0)
        {
          numDay = 7
        }
        return numDay - 1
      }
      else
      {
        return numDay
      }
    },

    //Add event to calendar
    addEventsToCalendar: function()
    {
      var self = this
      var calendar = self.weeks
      calendar.forEach(function(week) 
      {
        week.forEach(function(day)
        {
          if (day[0]){
            self.eventsMonth.forEach(function(event)
            {
              if (event.id_room == self.selRoom.id)
              {
              var dateEvStart = new Date(event.time_start)
              var dateEvEnd = new Date(event.time_end)
              var date = new Date(self.currentYear, self.currentMonth+1, day[0])
              if (dateEvStart.getDate() === day[0])
              {
                  var str = ''
                  var stringTime = self.changeTimeFormat(dateEvStart.getHours(), dateEvStart.getMinutes(),
                  dateEvEnd.getHours(), dateEvEnd.getMinutes())
                  str = stringTime
                  event.timeString = str
                  if (day.length == 1)
                  {
                    day.push([event])
                  }
                  else{
                    day[1].push(event)
                  }
              }
              }
            })
          }
        })
      });
    },




    getRooms: function()
    {
      var self = this
      axios
      .get(getUrl() + 'rooms/hash/' + self.user.hash + '/id_user/' + self.user.id)
      .then(function (response) 
      {
          if (Array.isArray(response.data))
          {
            self.rooms = response.data
            
           if (!localStorage['room'])
            {
              self.selRoom = self.rooms[0]
            }
            else
            {
              self.selRoom = JSON.parse(localStorage['room'])
            }
          }
          else
          {
            self.errorMessage = response.data
          }
      })
      .catch(function (error) 
      {
        console.log(error)
      })
    },

  getMonthYear: function()
    {
      var self = this
      self.currentMonth =self.date.getMonth()
      self.currentYear = self.date.getFullYear()
    },
    
   
changeTimeFormatTo12_24: function(EventStartHours, EventStartMinutes, EventEndHours, EventEndMinutes)
  {
    var self = this
    var str = ''
    str = EventStartHours
    str += (EventStartMinutes == 0) ? ':00-' : ':'+ EventStartMinutes +'-'
    str += EventEndHours
    str += (EventEndMinutes == 0) ? ':00' : ':'+ EventEndMinutes
    return str
  },

changeTimeFormatToAM_PM: function(EventStartHours, EventStartMinutes, EventEndHours, EventEndMinutes)
  {
    var self = this
    var str = ''
    var time1 =''
        var time2 = ''
        if (EventStartHours < 12){
          time1 = EventStartHours
          time1 += (EventStartMinutes == 0) ? ':00 am-' : ':'+ EventStartMinutes + ' am-'
        }
        else if (EventStartHours == 12)
        {
          time1 = EventStartHours
          time1 += (EventStartMinutes == 0) ? ':00 pm-' : ':'+ EventStartMinutes + ' pm-'
        }
        else if (EventStartHours > 12)
        {
          time1 = +EventStartHours-12
          time1 += (EventStartMinutes == 0) ? ':00 pm-' : ':'+ EventStartMinutes + ' pm-'
        }
        if (EventEndHours < 12)
        {
          time2 = EventEndHours
          time2 += (EventEndMinutes == 0) ? ':00 am' : ':'+ EventEndMinutes + ' am'
        }
        else if (EventEndHours == 12)
        {
          time2 = EventEndHours
          time2 += (EventEndMinutes == 0) ? ':00 pm' : ':'+ EventEndMinutes + ' pm'
        }
        else if (EventEndHours > 12)
        {
          time2 = +EventEndHours-12
          time2 += (EventEndMinutes == 0) ? ':00 pm' : ':'+ EventEndMinutes + ' pm'
        }
        str = time1 + time2
        return str
  },

  
    changeTimeFormat: function(EventStartHours, EventStartMinutes, EventEndHours, EventEndMinutes)
    {
      var self = this
      var string = ''
      if (self.selTimeFormat == '12-24')
      {
        return self.changeTimeFormatTo12_24(EventStartHours, EventStartMinutes, EventEndHours, EventEndMinutes)
      }
      else
      {
        return self.changeTimeFormatToAM_PM(EventStartHours, EventStartMinutes, EventEndHours, EventEndMinutes)
      }
    }
  },

  


  computed: {
    getDays()
    {
      var self = this
      return getWeekDays(self.weekDays)
    },

    getMonth()
    {
      var self = this
      return getNameMonth(self.nameMonth)
    },

    currentDay()
    {
      var self = this
      if (self.date.getMonth() == self.currentMonth && self.date.getFullYear() == self.currentYear)
      {
        return self.date.getDate()
      }
      else
      {
        return false
      }
    },
  },

  created()
  {
    this.getMonthYear()
    this.getRooms()
    this.getEventsForMonth()
    this.getDayMonthYear()
  },

  components: 
  {
    'Modalwindow': Modalwindow
  }
}

</script>

<style scoped>
.shadow 
{
  padding: 0;
  box-shadow: 0 0 10px rgba(0,0,0,0.5);
}
.btn-en{
 background-color:white;
 color: purple;
 border-color: purple;
 }

.btn-ru{
 background-color: purple;
 color: white;
 }
.date
{
  background-color: #b1b1da;
  color:white;
  font-weight: bold;
}
tbody
{
  background-color: white;
}
.monday{
 background-color: purple;
  color: white;
}
.sunday{
  background-color:white;
  color: purple;
  border-color: purple;
}
.List{
  background-color:white;
  color: purple;
  border-color: purple;
}
.title
{
  text-align: center;
  color:purple;
  font-size: 17px;
  font-weight: bold;
  background-color:white;
  padding-top: 10px;
}
.title p
{
  width: 150px;
  display: inline-table;
}
.title button
{
  background-color: #d9edf7;
  border-color: #d9edf7;
}
.day
{
  cursor: pointer;
  width: 122.61px;
  height: 118.33px;
}
td:hover
{
  background: #c7e3f1;
}
.ru-en-btn
{
  display: inline-block;
  margin-bottom: 15px;
}
.am-pm-btn
{
  display: inline-block;
  margin-bottom: 15px;
}
.am-pm
{
  background-color: purple;
  color: white;
}

.time12-24
{
  background-color: white;
  color: purple;
}
.mon-sun-btn
{
  display: inline-block;
  margin-bottom: 15px;
  width: 115px;
}
.right-top-menu
{
  height: 50px;
}
.btn-Book-Emp
{
  height: 50px;
}
.btn-Book-Emp button
{
  display: inline-block;
  margin-top: 10px;
  width: 115px;
}
.btnRoom
{
  border-radius: 5px;
  background-color: white;
}
.selBtn
{
    color:whitesmoke;
    font-weight: bold;
    border-color:purple;
    background-color:purple;
    border-width: 2px;
    border-radius: 5px;
}
.rooms
{
  margin: 0;
  background-color: #d9edf7;
  text-align: center;
}
.roomSel
{
  margin: 0;
  background-color:whitesmoke;
  text-align: center;
  color:black;
  font-size: 18px;
}
.events
{
  text-align: center;
  color: black;
  font-weight: normal;
  margin: 0;
}

.choosenday
{
margin: 0;
  background-color:purple;
  color:white;
  font-size: 18px;

}

.events button
{
  padding: 0;
  background-color: whitesmoke;
  margin: 5px;
  border-radius: 5px;
  color:purple;
}

.rooms{
background-color:snow;
border-top-left-radius: 10px;
border-top-right-radius: 10px;

}

.menu{
  display:inline-block;
}
.btn{
  
  font-size: 16px;
}

</style>
