<template>
  <v-container>
    <v-layout row class="text-xs-center">
        <v-container style="position: relative;top: 13%;" class="text-xs-center">
              <h1>View University Credential</h1>
              <pre><p id="colorRed">Could not find Immunity Passport</p></pre>
              <div id="circle">
              <p id="colorGreen">Yes, you are Immune! Your immunity passport is valid.</p>
              <pre><p id="ifExists">Expires at: {{expiry}}</p></pre>
              <pre><p id="ifExist">Signature: {{signature}}</p></pre>
              </div>
              <v-btn color="primary"  @click="view()" primary >View</v-btn>
        </v-container>
    </v-layout>
  </v-container>
</template>

<script>
import EosService from '@/eosio/EosService';

export default {
  data() {
    return {
      expiry: '',
      signature: '',
      eosio: null,
      sendItems:''
    };
  },
  methods: {
    view: async function() {
      if (this.eosio === null) {
        this.eosio = new EosService(
          process.env.VUE_APP_IMMPASS_NAME,
          process.env.VUE_APP_IMMPASS_CONTRACT_NAME
        );
      }

      if (!(await this.eosio.connect()))
        return console.log('Failed to get Scatter account');

      try{
        document.querySelector('#colorRed').style.display="none";
        document.querySelector('#colorGreen').style.display="none";
        document.querySelector('#ifExists').style.display="none";
        document.querySelector('#ifExist').style.display="none";
        document.querySelector('#circle').style.display="none";
        if (
          await this.eosio.transaction('verify', { _individual: this.eosio.account.name })
        ) {
          document.querySelector('#colorGreen').style.display="inline";
          let values
          values=await this.eosio.getDid(this.eosio.account.name);
          this.expiry=values[0];
          this.signature=values[1];
          document.querySelector('#ifExists').style.display="inline";
          document.querySelector('#ifExist').style.display="inline";
          document.querySelector('#circle').style.display="block";
          
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
   
    color: green;
    display: none;
  }
  #ifExists{
    
    display: none;
  }
  #ifExist{
    display: none;
  }
  
  #circle{
    padding:50px;
    margin: 50px;
    display: none;
    border: 2px solid black;
    border-radius: 20px;
  }
</style>