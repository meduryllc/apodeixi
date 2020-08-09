<template>
  <v-container>
    <v-layout row class="text-xs-center">
        <v-container style="position: relative;top: 13%;" class="text-xs-center">
            <h1>Request Verifiable Credential</h1>
            <hr>
            <p id="colorRed">Could not process the details</p>
            <p id="colorGreen">Your request is saved. Please allow some time to process your request</p>
            <v-form>
              <v-text-field
                v-model="healthWorkerName"
                name="HealthWorker"
                label="Org representative account name"
              ></v-text-field>
              <v-text-field
                v-model="identifier"
                name="HealthWorker"
                label="Student Identifier"
              ></v-text-field>
              
              <v-btn color="primary"  id="click" @click="handleLogin()" primary>Request</v-btn>
            </v-form>
        </v-container>
    </v-layout>
  </v-container>
</template>

<script>
import EosService from '@/eosio/EosService';

export default {
  data() {
    return {
      identifier: '',
      healthWorkerName: '',
      didContract: process.env.VUE_APP_ISSUEDID_CONTRACT_NAME,
      healthWorkerContract: process.env.VUE_APP_HEALTHWORKER_CONTRACT_NAME,
      eosio: null
    };
  },
  methods: {
    
    handleLogin: async function() {
      document.querySelector("#colorRed").style.display="none";
      document.querySelector("#colorGreen").style.display="none";
      if (this.eosio === null) {
        this.eosio = new EosService(
          process.env.VUE_APP_IMMPASS_NAME,
          process.env.VUE_APP_IMMPASS_CONTRACT_NAME
        );
      }

      if (!(await this.eosio.connect()))
        return console.log('Failed to get Scatter account');

      try{
        console.log(this.healthWorkerName);
        console.log(this.healthWorkerContract);
        console.log(this.didContract);
        if (
          await this.eosio.transaction('initiate', { _requester_name: this.eosio.account.name, _healthworker_name: this.healthWorkerName,
          _identifier: this.identifier, didContractAccount: this.didContract,healthWorkersContractAccount: this.healthWorkerContract })
        ) {
          this.$store.commit('loginStatus', true);
          document.querySelector("#colorGreen").style.display="inline";
          document.querySelector("#click").style.display="none";
        }
      }catch(error){
        document.querySelector('#colorRed').style.display="inline";
        console.log(error);
      }

    }
  }
};
</script>

<style scoped>
  #colorGreen{
    color:green;
    display:none;
  }
  #click{
    display:inline;
  }
</style>
