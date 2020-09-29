<template>
    <v-container>
    <v-layout row wrap align-center>
        <v-container style="position: relative;top: 13%;" class="text-xs-center" >
            <h1>Verify a Credential</h1>
            <hr>
            <p id="colorRed">Could not process the details</p>
            <p id="red">Domain did not match with the listed domain of the organization</p>
          <b-alert  v-model="showDismissibleAlert" @dismissed="showDismissibleAlert=false" variant="danger" dismissible>
              Sorry, You are not the intended audience. JWT is invalid
              </b-alert>
               <b-alert  v-model="expired" @dismissed="expired=false" variant="danger" dismissible>
              JWT has expired
              </b-alert>
              <b-alert  v-model="showFailed" @dismissed="expired=false" variant="danger" dismissible>
              Sorry, Signature Verification failed. JWT is invalid
              </b-alert>
              <b-alert  v-model="showSuccess" variant="success">
              JWT is Verified
              </b-alert>
              <b-alert  v-model="showAlert" variant="info">
              JWT is Valid. Click Verify to verify the credential
              </b-alert>
              <b-alert  v-model="showUpload" variant="info">
              File Upload. Click on resolve to verify status of JWT
              </b-alert>
        <b-row align-h="center">
            <b-col cols="10">
                <b-form v-if="show">
                
                <b-form-file
                  v-model="file"
                  id="fileID"
                  :state="Boolean(file)"
                  placeholder="File containing your JWT Presentation"
                  drop-placeholder="Drop file here..."
                ></b-form-file>
                <div id="mar">
                <b-button id="ver" style="display: none;" @click="resolve()" variant="primary">Verify</b-button>&nbsp;&nbsp;&nbsp;
                
                <b-button id="res" @click="check()" variant="primary">Resolve</b-button>
                </div>
                </b-form>
            </b-col>
      </b-row>
      <b-modal ok-only ok-title=Verify @ok=verify class="p-3" id="modal-1" title="Verify Credential">
        <b-row>
          <div id="pad">
          <p>Credential issued by: {{form.issuer}}</p>
          
          </div>
        </b-row>
      </b-modal>
        </v-container>
    </v-layout>
  </v-container>
</template>

<script>


import EosService from '@/eosio/EosService';
import jwt from 'jsonwebtoken';

export default {
  data() {
    return {
      showUpload:false,
      file: null,
      showFailed: false,
      expired: false,
      showAlert: false,
      showDismissibleAlert: false,
      showSuccess: false,
      form:{
        token: '',
        key: '',
        issuer: ''
      },
      show: true,
      defaultDidContract: process.env.VUE_APP_ISSUEDID_CONTRACT_NAME,
      defaultHealthOrgContract: process.env.VUE_APP_HEALTHORG_CONTRACT_NAME,
      eosio: null
    };
  },
  methods: {
    
    
    check: async function(){
      var newReader=new FileReader();
      newReader.addEventListener('load',(event)=>{
        this.form.token=event.target.result;  
      });
      newReader.readAsText(this.file,"UTF-8");

      if (this.eosio === null) {
        this.eosio = new EosService(
          process.env.VUE_APP_ISSUEDID_NAME,
          process.env.VUE_APP_ISSUEDID_CONTRACT_NAME
        );
      }
      if (!(await this.eosio.connect()))
        return console.log('Failed to get Scatter account');
      
      var user=this.eosio.account.name;
      user="did:eos:"+user;
      
      try{
        var token=this.form.token;
        var decoded=jwt.decode(token, {complete: true});
        var iss=decoded.payload.iss.split(":")[2];
        let key=await this.eosio.getKey(iss);
        var verified = jwt.verify(token,key[0],{audience: user});
        
        document.getElementById("ver").style.display="inline";
        document.getElementById("res").style.display="none";
        this.showAlert=true;
      }catch(error){
        if(error.message.split('.')[0]==="jwt audience invalid"){
          this.showDismissibleAlert=true;
        }
        if(error.name==="TokenExpiredError"){
          this.expired=true;
        }   
        
      }
    },
    resolve: async function(){
      console.log("Here");
      try{
        var token=this.form.token;
        var decoded=jwt.decode(token, {complete: true});
        var to_verify=decoded.payload.vp.verifiableCredential;
        var credentialToken=jwt.decode(to_verify, {complete: true});
        var iss=credentialToken.payload.iss.split(":")[2];
        
        this.$bvModal.show('modal-1');
      }catch(error){
        
        this.showFailed=true;
      }
      
      if (this.eosio === null) {
        this.eosio = new EosService(
          process.env.VUE_APP_ISSUEDID_NAME,
          process.env.VUE_APP_ISSUEDID_CONTRACT_NAME
        );
      }
      /*
      try{
        var token=this.form.token;
        var decoded=jwt.decode(token, {complete: true});
        var iss=decoded.payload.iss.split(":")[2];
        let key=await this.eosio.getKey(iss);
        //var verified = jwt.verify(to_verify,key[0]);
        
      }catch(error){
        console.log(error);
      }
      */
      let key=await this.eosio.getKey(iss);
      this.form.issuer=iss;
      this.form.key=key;
    },
    verify: async function(evt){
      //evt.preventDefault();
      this.showSuccess=false;
      this.showDismissibleAlert=false;
      var token=this.form.token;
      var key=this.form.key;
      this.showAlert=false;
      this.showDismissibleAlert=false;
      this.showSuccess=false;
      var decoded = jwt.decode(token, {complete: true});
      var to_verify=decoded.payload.vp.verifiableCredential;
      
      try{
        var verified = jwt.verify(to_verify,key[0]);
        this.showSuccess=true;
        this.$bvModal.hide('modal-1');
      }catch(error){
        this.showFailed=true;
        console.log(error);
      }

    },
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
  #pad{
    padding: 10px;
  }
  #mar{
    margin: 20px;
  }
  
</style>
