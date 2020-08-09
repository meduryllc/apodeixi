<template>
  <v-container>
    <v-layout row class="text-xs-center">
        <v-container style="position: relative;top: 13%;" class="text-xs-center">
            <h1>Issue Immunity Passport</h1>
            <p id="colorRed">Could not process the details</p>
            <v-form>
              <v-text-field
                v-model="requesterName"
                name="Requester"
                label="Requester Name"
              ></v-text-field>  
              <v-text-field
                v-model="testReportId"
                name="ID"
                label="Test Report ID"
              ></v-text-field>
              <v-btn color="primary"  @click="handleLogin()" primary >Issue</v-btn>
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
      requesterName: '',
      healthWorkerName: '',
      testReportId:'',
      eosio: null
    };
  },
  methods: {
    handleLogin: async function() {
      if (this.eosio === null) {
        this.eosio = new EosService(
          process.env.VUE_APP_IMMPASS_NAME,
          process.env.VUE_APP_IMMPASS_CONTRACT_NAME
        );
      }

      if (!(await this.eosio.connect()))
        return console.log('Failed to get Scatter account');
      try{
      if (
        await this.eosio.transaction('issue', { _requester: this.requesterName, _healthworker: this.eosio.account.name, _testreport_id: this.testReportId })
      ) {
        this.$store.commit('loginStatus', true);
        this.$router.push('requests');
      }
      }catch(error){
        document.querySelector('#colorRed').style.display="inline";
        console.log(error);
      }

    }
  }
};
</script>