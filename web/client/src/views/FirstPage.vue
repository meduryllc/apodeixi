<template>
  <div id="container">
  <v-container>
    
    <v-layout row class="text-xs-center">
        <v-container style="position: relative;top: 13%;" class="text-xs-center">
              <h1>Welcome to Apodeixi</h1>
              <b-alert  v-model="showAlert" dismissible variant="info">
              Please run scatter before interacting with the application
              </b-alert>
              <b-alert  v-model="showDismissibleAlert" dismissible variant="danger">
              Could not find your credentials
              </b-alert>
              <hr>
              <b-row>
                <b-col sm>
                  <img src="../assets/individual.png" @click="handleLogin()">
                </b-col>
                <b-col sm>
                  <img src="../assets/employee.jpg" @click="handleWorkerLogin()">
                </b-col>
                
              </b-row>
              <div class="d-none d-md-block">
                <b-row>
                  <b-col>
                    <h3>Student Login</h3>
                  </b-col>
                  <b-col>
                    <h3>Employee Login</h3>
                  </b-col>
                </b-row>
              </div>
                <hr>
                <pre><span>Don't already have an account? <router-link to="/login">Get a DID here</router-link> </span></pre>
                <pre><span>To verify a university credential, click <router-link to="/verify">here</router-link> </span></pre>
                
    </v-container>
    </v-layout>
  </v-container>
  </div>
</template>

<script>
import EosService from '@/eosio/EosService';
import jwt from 'jsonwebtoken'

export default {
  data() {
    return {
      showAlert: '',
      showDismissibleAlert:false,
      email: '',
      orgName: '',
      license: '',
      defaultDidContract: process.env.VUE_APP_ISSUEDID_CONTRACT_NAME,
      defaultHealthWorkerContract: process.env.VUE_APP_HEALTHWORKER_CONTRACT_NAME,
      eosio: null
    };
  },
  methods: {
    
    handleLogin: async function() {
      if (this.eosio === null) {
        this.eosio = new EosService(
          process.env.VUE_APP_ISSUEDID_NAME,
          process.env.VUE_APP_ISSUEDID_CONTRACT_NAME
        );
      }

      if (!(await this.eosio.connect()))
        return console.log('Failed to get Scatter account');

      try{
        let status=await this.eosio.getLogin(this.eosio.account.name,this.defaultDidContract);
        if(status){
          this.$store.commit('loginStatus', true);
          this.$store.commit('Identity','individual');
          
          this.$router.push('individual');
        }
        else {
          this.showDismissibleAlert=true;
        }
      }catch(error){
        console.log(error);
      }
    },
    handleWorkerLogin: async function() {
      if (this.eosio === null) {
        this.eosio = new EosService(
          process.env.VUE_APP_ISSUEDID_NAME,
          process.env.VUE_APP_ISSUEDID_CONTRACT_NAME
        );
      }

      if (!(await this.eosio.connect()))
        return console.log('Failed to get Scatter account');

      try{
        let status=await this.eosio.getLogin(this.eosio.account.name,this.defaultHealthWorkerContract);
        if(status) {
          this.$store.commit('loginStatus', true);
          this.$store.commit('Identity','worker');
          
          this.$router.push('workerview');
        }
        else {
          document.querySelector('#colorRed').style.display="inline";
        }
      }catch(error){
        console.log(error);
      }
    }
  }
};
</script>

<style scoped>
  .v-btn{
    color:primary;
  }
  img{
    width:25%;
    height:80%;
  }
</style>