<template>
  <div class="empList">
    <div v-if="addUser == '' && editUser.length == 0" class="usersList">
      <div class="titleForm">Users</div>
      <p class="alert-danger">{{errorMsg}}</p>
      <p class="alert-success">{{msg}}</p>
       <table class="table table-hover">
         <thead>
           <tr class="info">
             <th class="thTable">ID</th>
             <th class="thTable">User Name</th>
             <th class="thTable">login</th>
             <th class="thTable">email</th>
             <th class="thTable">role</th>
             <th class="thTable">Edit</th>
             <th class="thTable">Remove</th>
           </tr>
         </thead>
         <tbody>
           <tr v-for="(u, index) in users" class="userString">
             <td>{{u.id}}</td>
             <td><a :href="'mailto:'+u.email">{{u.username}}</a></td>
             <td>{{u.login}}</td>
             <td><a :href="'mailto:'+u.email">{{u.email}}</a></td>
             <td>{{u.role}}</td>
             <td>
                  <button class="btn editUsers" v-on:click="editUserFun(index)">Edit</button>
             </td>
             <td v-if="u.id != user.id"><button class="btn alert-danger" v-on:click="removeUser(index)">Remove</button></td>
             <td v-else>It is you</td>
           </tr>
         </tbody>
       </table>
       <button v-on:click="addUser=1" class="btn addUser" >Add a new User</button>
       <router-link to="/"><button class="btn toMain">To main</button></router-link>
    </div>
    <div v-else-if="editUser.length !=0">
      <edit-user :editUser="editUser"></edit-user>
    </div>
    <div v-else-if="addUser == 1">
      <add-user></add-user>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import AddUser from './AddUser'
import EditUser from './EditUser'
export default {
  name: 'EmployeeList',
  data () {
    return {
      msg: '',
      errorMsg: '',
      addUser: '',
      editUser: {},
      user: {},
      users: [],
    }
  },
  methods: {
    editUserFun: function(index){
      var self = this
      self.editUser = self.users[index]
      if (self.editUser)
      {
        return true
      }
      return false
    },
    removeUser: function(index){
      var self = this
      self.msg = ''
      self.errorMsg = ''
      var result = confirm('Do you want to remove user "'+ self.users[index].username + '"?')
      if (!result)
      {
        return false
      }
      axios
      .delete(getUrl() + 'users/hash/' + self.user.hash + '/id_user/' + self.user.id +'/id/' + self.users[index].id)
          .then(function (response) {
          if (response.data === 1)
          {
            self.getUsersList()
            self.msg = 'User "' + self.users[index].username + '" Delete - Success!'
          }
          else{
            self.errorMsg = response.data
            return false;
          }
      })
      .catch(function (error) 
      {
        console.log(error);
      })
    },
    getUsersList:function()
    {
      var self = this
      self.addUser = ''
      self.editUser = ''
      self.msg = ''
      self.errorMsg = ''
      axios
      .get(getUrl() + 'users/hash/' + self.user.hash + '/id_user/' + self.user.id)
          .then(function (response) {
          if (Array.isArray(response.data))
          {
            self.users = response.data
          }
          else{
            self.errorMsg = response.data
          }
      })
      .catch(function (error) {
        console.log(error)
      })
    },
    checkUserFun: function(){
      var self = this
      if (localStorage['user'])
      {
        self.user = JSON.parse(localStorage['user'])
        axios.get(getUrl() + 'users/hash/' + self.user.hash + '/id_user/' + self.user.id +'/id/' + self.user.id)
            .then(function (response) 
            {
              if (Array.isArray(response.data))
              {
                if (self.user.hash === response.data[0].hash)
                {
                  if (response.data[0].role == 'admin')
                  {
                    self.user.role = response.data[0].role
                  }
                  else
                  {
                    self.$router.push('/')
                  }
                }
                else
                {
                  self.$router.push('/')
                }
              }
              else 
              {
                self.$router.push('/')
              }
            })
            .catch(function (error) 
            {
              console.log(error)
            });
      }
      else
      {
        self.$router.push('/')
      }
    }
  },
  components: 
  {
    'EditUser' : EditUser,
    'AddUser' : AddUser
  },
  created()
  {
    this.checkUserFun()
    this.getUsersList()
  }
}
</script>

<style scoped>
.usersList{
  text-align: center;
  background-color: rgba(255, 255, 255, 1);
  padding: 20px;
  margin-top: 100px;
  border-radius: 15px;
}
.addUser
{
  background-color: purple;
  color:white;
}
.editUsers
{
  background-color: purple;
  color:white;
}

.toMain{
  background-color: white;
  color:purple;
  border-color: purple;
}

.userString
{
font-size: 18px;
color: black;
}
.thTable{
  text-align: center;
}
.titleForm{
  font-size: 24px;
  color: purple;
  font-weight: bold;
}
a{
  font-weight: bold;
}
.btn{
  
  font-size: 16px;
}



</style>
