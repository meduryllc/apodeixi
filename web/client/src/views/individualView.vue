<template>
  <v-container>
    <v-layout row class="text-xs-center">           
        <v-container style="position: relative;top: 13%;" class="text-xs-center">                      
            <h1>What would you like to do?</h1>
            <hr>
            <v-btn color="primary" @click="request()">Request VC</v-btn>
            <v-btn color="primary" @click="present()">Present VC</v-btn>
        </v-container>  
    </v-layout>
  </v-container>
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
    request: async function(){
      this.$router.push('request');
    },
    view: async function(){
      this.$router.push('view');
    },
    present: async function(){
      this.$router.push('present');
    }
  }
};
</script>