<template>
  <v-container>
    <v-layout row class="text-xs-center">
      <v-flex xs3 style="background-image: url('http://cdn.wallpapersafari.com/7/86/gqiGH7.jpg')">
        <v-card height="500px"></v-card>
      </v-flex>
      <v-flex xs4 class="grey lighten-4">
        <v-container style="position: relative;top: 13%;" class="text-xs-center">
          <v-card flat>
            <v-card-title primary-title>
              <h4>Health Org Registration</h4>
            </v-card-title>
            <p id="colorRed">Could not process the details</p>
            <v-form>
            <v-text-field
                v-model="accountName"
                name="AccountName"
                label="Account Name"
              ></v-text-field>
              <v-text-field
                v-model="email"
                name="EmailAddress"
                label="Domain Name"
              ></v-text-field>
              <v-text-field
                v-model="orgId"
                name="OrganizationId"
                label="Organization ID"
              ></v-text-field>
              <v-text-field
                v-model="license"
                name="License"
                label="Government Issued License"
              ></v-text-field>
              <v-card-actions>
                <v-btn color="primary"  @click="handleLogin()" primary large block>Register</v-btn>
              </v-card-actions>
            </v-form>
          </v-card>
        </v-container>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import EosService from '@/eosio/EosService';

export default {
  data() {
    return {
      accountName: '',
      email: '',
      orgId: '',
      license: '',
      defaultDidContract: process.env.VUE_APP_ISSUEDID_CONTRACT_NAME,
      defaultContract: process.env.VUE_APP_HEALTHORG_CONTRACT_NAME,
      eosio: null
    };
  },
  methods: {
    handleLogin: async function() {
      if (this.eosio === null) {
        this.eosio = new EosService(
          process.env.VUE_APP_HEALTHORG_NAME,
          process.env.VUE_APP_HEALTHORG_CONTRACT_NAME
        );
        console.log(process.env.VUE_APP_HEALTHORG_NAME);
        console.log(process.env.VUE_APP_HEALTHORG_CONTRACT_NAME);
      }

      if (!(await this.eosio.connect()))
        return console.log('Failed to get Scatter account');

      try{
        if (
          await this.eosio.transaction('upsert', { user: this.accountName, email: this.email, organizationId: this.orgId, licenseId: this.license, 
          didContractAccount: this.defaultDidContract, contractAccount: this.defaultContract })
        ) {
          this.$store.commit('loginStatus', true);
          this.$router.push('home');
        }
      }catch(error){
        document.querySelector('#colorRed').style.display="inline";
      }
    }
  }
};
</script>