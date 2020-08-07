<template>
  <div id="container">
  <v-container>
    <v-layout row class="text-xs-center">
        <v-container style="position: relative;top: 13%;" class="text-xs-center">
            <div id="reg">
            <h1>I am?</h1>
            <hr>
            
              <b-row>
                <b-col>
                  <img src="../assets/individual.png" @click="individual()">
                </b-col>
                <b-col>
                  <img src="../assets/employee.jpg" @click="employee()">
                </b-col>
                
              </b-row>
              <b-row>
                <b-col>
                  <h3>Student</h3>
                </b-col>
                <b-col>
                  <h3>Employee</h3>
                </b-col>
              </b-row>
            </div>
            <div id="emp" style="display:none;">
              <h1>Do you have a DID?</h1>
              <hr>
              <v-btn color="primary" @click="worker()">Yes</v-btn>
              <v-btn color="primary" @click="individual()">No</v-btn>
            </div>
        </v-container>
    </v-layout>
  </v-container>
  </div>
</template>

<script>
import EosService from '@/eosio/EosService';

export default {
  data() {
    return {
      pKey: '',
      eosio: null
    };
  },
  methods: {
    employee: async function(){
      document.getElementById("emp").style.display="inline";
      document.getElementById("reg").style.display="none";
    },
    individual: async function(){
      this.$router.push('login');
    },
    worker: async function(){
      this.$router.push('worker');
    }
  }
};
</script>
<style scoped>
  img{
    width:25%;
    height: 80%;
  }
</style>