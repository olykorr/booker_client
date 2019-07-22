<template>
  <div class="login">
    <div class="loginForm text-center center-block">
      <p class="alert-danger">{{errorMsg}}</p>
      <div>

        <div id="legend">
            <legend class="title">Log in to the Booker</legend>
        </div>

        <div class="control-group form-group">
          <!-- Login -->
          <label class="control-label"  for="login">Login</label>
          <div class="controls">
              <input v-model="login" type="text" class="form-control">
              <p class="help-block"></p>
          </div>
        </div>

        <div class="control-group form-group">
          <!-- Pass -->
          <label class="control-label"  for="pass">Password</label>
          <div class="controls">
              <input v-model="pass" type="password" class="form-control">
              <p class="help-block"></p>
          </div>
        </div>

        <div class="control-group form-group">
          <!-- Button -->
          <div class="controls">
              <button v-on:click="getLogin()" class="btn btn-default btn-block">Submit</button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'loginForm',
  data () {
    return {
      msg: '',
      errorMsg: '',
      login: '',
      pass: ''
    }
  },
  methods: {
    getLogin: function()
    {
      var self = this
      self.errorMsg = ''
      if (self.login && self.pass)
        {
          axios
          .put(getUrl() + 'users/', 
          {
            login: self.login,
            pass: self.pass
          }, axConf)
          .then(function (response) 
          {
            if (response.data.id && response.data.hash)
            {
              self.$parent.user.id = response.data.id
              self.$parent.user.hash = response.data.hash 
              localStorage['user'] = JSON.stringify(self.$parent.user)
              self.$parent.user.login = response.data.login
              self.$parent.user.role = response.data.role
              self.$parent.user.userName = response.data.username
              self.$parent.checkUser=1
            }
            else 
            {
              self.errorMsg = response.data
              if (self.errorMsg == 'Nothing found')
              {
                self.errorMsg = 'Error, check password and login'
              }
            }
          })
          .catch(function (error) 
          {
            console.log(error)
          })
        }
        else
        {
          self.errorMsg = 'Enter data in all fields!'
        }
    }
  }
}
</script>

<style scoped>

.login{
  
    }

.loginForm{
  font-size: 14px;
  top: 90px;
  color: rgb(0, 0, 0);
  width: 550px;
  border-radius: 10px;
  margin: auto;
  margin-bottom:10%;
  max-width:525px;
  min-height:350px;
  position:relative;
  background: white;
  padding:30px 70px 50px 70px;
  -webkit-box-shadow:0 12px 15px 0 rgba(0,0,0,.24),0 17px 50px 0 rgba(0,0,0,.19);
          box-shadow:0 12px 15px 0 rgba(0,0,0,.24),0 17px 50px 0 rgba(0,0,0,.19);
}

.title{
  font-size: 18px;
  font-weight: bold;
  color:rgb(4, 7, 7);
}
.alert-danger{
    text-align: center
}
.input{
  border-radius: 5px;
  width: 250px;
}
 .input{
  border:none;
  padding:15px 20px;
  border-radius:25px;
  margin-left: 100px;
  margin-right: 150px;
}
.input[data-type="password"]{
  text-security:circle;
  -webkit-text-security:circle;
}

fieldset
{
   padding-left: 50px;
   padding-right: 50px;
   padding-top: 10px;
   padding-bottom: 10px;

}

/*цвет выделенного пунта*/
 .btn
 {
  font-size: 16px;
  width:100%;
  border-radius:5px;
  display:block;
  height: 40px;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: bold;
 }
 

</style>
