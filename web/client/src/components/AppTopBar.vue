<template>

  <span>
      <v-toolbar app variant="info" color="blue" dark>
      <h1 class="text-center" color="black" @click="home()">{{appTitle}}</h1>
      <v-spacer class="hidden-md-and-up"></v-spacer>
      <v-spacer></v-spacer>
      <v-btn @click="initiated()" v-if="$store.state.identity==='worker'">Initiated</v-btn>

      <v-btn @click="request()" v-if="$store.state.identity==='individual'">Request</v-btn>
      <v-btn @click="view()" v-if="$store.state.identity==='individual'">Present</v-btn>
      <v-btn @click="handleLogout()" v-if="$store.state.loggedIn">Logout</v-btn>
    </v-toolbar>
  </span>
</template>

<script>
export default {
  name: 'AppTopBar',
  data() {
    return {
      appTitle: 'Apodeixi'
    };
  },
  methods: {
    handleLogout: async function() {
      this.$store.commit('loginStatus', false);
      this.$store.commit('Identity','');
      this.$router.push('/');
      //this.scatter.forgetIdentity();
    },
    home: async function(){
      this.$router.push('/');
    },
    initiated: async function(){
      this.$router.push('pending');
    },
    pending: async function(){
      this.$router.push('requests');
    },
    request: async function(){
      this.$router.push('request');
    },
    view: async function(){
      this.$router.push('present');
    }
  }
};
</script>
  
<style scoped>
  router-link{
    color:white;
  }
</style>
