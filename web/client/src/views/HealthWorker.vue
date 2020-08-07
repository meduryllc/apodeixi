<template>
  <v-container>
    <v-layout row wrap align-center>
        <v-container style="position: relative;top: 13%;" class="text-xs-center" >
            <h1>Employee Registration</h1>
            <p id="colorRed">Could not process the details</p>
            <p id="red">Domain did not match with the listed domain of the organization</p>
            <v-form>
              <v-text-field
                v-model="userName"
                name="UserName"
                label="Employee Name"
              ></v-text-field>
              <form id="employees">
              <select id="workers">
                <option id="default">Choose your organization</option>
              </select>
              <v-btn id="view" color="primary" @click="getList()" primary>View</v-btn>
              <v-btn id="select" color="primary" @click="val()" primary>Select</v-btn>
              </form>
              <v-text-field
                v-model="email"
                type="email"
                name="EmailAddress"
                label="Email Address"
              ></v-text-field>
              <v-btn color="primary"  @click="emailOTP()" primary >Register</v-btn>
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
      userName:'',
      email: '',
      orgName: '',
      defaultDidContract: process.env.VUE_APP_ISSUEDID_CONTRACT_NAME,
      defaultHealthOrgContract: process.env.VUE_APP_HEALTHORG_CONTRACT_NAME,
      eosio: null
    };
  },
  methods: {
    val: async function(){
      let val=document.querySelector("#workers").value;
      this.orgName=val;
    },
    getList: async function(){
      //document.querySelector("#view").style.display="none";
      //document.querySelector("#select").style.display="inline";
      if (this.eosio === null) {
          this.eosio = new EosService(
            process.env.VUE_APP_HEALTHORG_NAME,
            process.env.VUE_APP_HEALTHORG_CONTRACT_NAME
          );
      }
      let orgs=await this.eosio.getOrganizations();
      for(var index in orgs){
        var option=document.createElement('option');
        option.value=orgs[index].key;
        option.text=orgs[index].key;
        document.querySelector("#workers").appendChild(option);
      }
    },
    emailOTP: async function() {
      document.querySelector("#red").style.display="none";
      let val=document.querySelector("#workers").value;
      this.orgName=val;
      try{
        if (this.eosio === null) {
          this.eosio = new EosService(
            process.env.VUE_APP_HEALTHWORKER_NAME,
            process.env.VUE_APP_HEALTHWORKER_CONTRACT_NAME
          );
        }
        if (!(await this.eosio.connect()))
        return console.log('Failed to get Scatter account');
        // TODO: Allow user to select the organization that is already present in the list
        
        var mail=this.email;
        var found=false;
        var domain='';
        for(var letter in mail){
          if(found) domain+=mail[letter];
          if(mail[letter]==='@') found=true;
        }
        let status=await this.eosio.getDomain(this.orgName);
        if(domain===status){
            let url="http://localhost:3000/send?to="+this.email+"&org="+this.orgName+"&account="+this.userName;
            console.log(url);
            await fetch(url);
            console.log("Fetched");
        }
        else{
          document.querySelector("#red").style.display="inline";
        }
      }catch(error){
        //document.querySelector("#colorRed").style.display="inline";
      }
    },
  }
};
</script>

<style>
  .v-text-field{
    margin:auto;
    width:300px;
  }
  #red{
    color:red;
    display:none;
  }
  select{
    width:210px;
    padding:10px;
    border: 2px solid black;
  }
  #select{
    display:none;
  }
  
</style>
