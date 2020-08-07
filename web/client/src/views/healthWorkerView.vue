<template>
  <v-container>
    <v-layout row class="text-xs-center">      
        <v-container style="position: relative;top: 13%;" class="text-xs-center">
            <h1>What would you like to do?</h1>
            <hr>
            <v-btn color="primary" @click="initiated()">View Initiated Requests</v-btn>
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
    initiated: async function(){
      this.$router.push('pending');
    },
    validated: async function(){
      this.$router.push('requests');
    }
  }
};
</script>