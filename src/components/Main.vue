<template>
  <div class="main">
    <div v-if="checkUser == ''">
      <login></login>
    </div>
    <div v-else>
      <div class="header">
        <div class="row">
          
          <div class="title col-md-12 titleApp">
           <div> Booker</div>
           </div>
           <div class="title col-md-12 ">
           <div> You enter as <strong> {{user.userName}} </strong><button v-on:click="logout()" class="btn btn-info">logout</button></div>
          </div>

          
        </div>
      </div>
      <calendar :role="user.role" :user="user"></calendar>
      <div class="footer">
          &nbsp;
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import Login from './Login'
import Calendar from './Calendar'
export default {
  name: 'Main',
  data () {
    return {
      checkUser: '1',
      role: '',
      user: {},
    }
  },
  methods: {
    logout: function(){
      var self = this
      if (localStorage['user'])
      {
        delete localStorage['user']
        delete localStorage['room']
        self.user = {},
        self.checkUser = '1'
        return true
      }
      else
      {
        return false
      }
    },
    checkUserFun: function()
    {
      var self = this
      if (localStorage['user'])
      {
        self.user = JSON.parse(localStorage['user'])
        axios
        .get(getUrl() + 'users/hash/' + self.user.hash + '/id_user/' + self.user.id +'/id/' + self.user.id)
            .then(function (response) {
              if (Array.isArray(response.data)){
                if (self.user.hash === response.data[0].hash)
                {
                  self.user.login = response.data[0].login
                  self.user.role = response.data[0].role
                  self.user.userName = response.data[0].username
                  self.checkUser = 1;
                  return true
                }
                else
                {
                  delete localStorage['user']
                  self.checkUser = ''
                  return false
                }
              }
              else {
                delete localStorage['user']
                self.errorMsg = response.data
                return false
              }
            })
            .catch(function (error) 
            {
              console.log(error)
            });
      }
      else
      {
        self.checkUser = ''
        return false
      }
    }
  },
  created()
  {
    this.checkUserFun()
  },
  components: {
    'Login': Login,
    'Calendar': Calendar
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.header{
  margin-top: 15px;
  margin-bottom: 15px;
}
.footer{
  margin-top: 30px;
  margin-bottom: 30px;
}
.title{
  font-size: 18px;
  text-align: center;
  color: purple;
}
.welcome{
font-size: 24px;

}
.col-md-2{
  font-size: 17px;
  color: darkblue;
}

.btn{
  background-color: purple;
  font-size: 16px;
}
.titleApp{
  font-size: 28px;
  font-weight: bold;
}
</style>
