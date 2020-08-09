<template>
  <v-container>
    <v-layout row class="text-xs-center">
        <v-container style="position: relative;top: 13%;" class="text-xs-center">
            <p id="colorGreen">Request is validated</p>
            <p id="colorRed">Could not process the details</p>
            <v-form>
              <v-text-field
                v-model="requesterName"
                name="Requester"
                label="Requester Name"
              ></v-text-field>
              <v-text-field
                v-model="govtId"
                name="ID"
                label="Government ID"
              ></v-text-field>
              <v-btn color="primary"  id="click" @click="handleLogin()" primary >Validate</v-btn>
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
      requesterName:'',
      healthWorkerName: '',
      govtId:'',
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
          await this.eosio.transaction('validate', { _requester_name: this.requesterName, _health_worker_name: this.eosio.account.name, _govt_id_number: this.govtId })
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