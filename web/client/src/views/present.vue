<template>
  <v-container>
    <v-layout row wrap align-center>
        <v-container style="position: relative;top: 13%;" class="text-xs-center" >
            <h1>Present Verifiable Credential</h1>
            <hr>
            <p id="colorRed">Could not process the details</p>
            <p id="red">Domain did not match with the listed domain of the organization</p>
            <b-alert  v-model="showSuccess" variant="success">
              Verifiable Presentation JWT is generated
            </b-alert>
        <b-row @submit=present align-h="center">
            <b-col cols="10">
                <b-form v-if="show">
                
                <b-form-group
                    id="input-group-1"
                    
                    label-for="input-1"
                    
                >
                    <b-form-input
                    id="input-1"
                    v-model="form.audience"
                    type="text"
                    required
                    placeholder="Intended Audience"
                    ></b-form-input>
                </b-form-group>

                
                <div id="disp">
                  <div class="mar">
                  <b-form-file
                    v-model="token"
                    id="fileID"
                    :state="Boolean(token)"
                    placeholder="File containing your JWT Credential"
                    drop-placeholder="Drop file here..."
                  ></b-form-file>
                  </div>
                  <b-form-file
                    v-model="file"
                    id="fileID"
                    :state="Boolean(file)"
                    placeholder="File containing your private key"
                    drop-placeholder="Drop file here..."
                  ></b-form-file>
                  
                  <div class="mar"> 
                    <b-button @click="getKey()" variant="primary">Load</b-button>&nbsp;&nbsp;        
                    <b-button type="submit" variant="primary">Submit</b-button>
                  </div>
                </div>  
                </b-form>
               
            </b-col>
      </b-row>
        </v-container>
    </v-layout>
  </v-container>
</template>

<script>


import EosService from '@/eosio/EosService';
import jwt from 'jsonwebtoken';
import {saveAs} from 'file-saver';

export default {
  data() {
    return {
      token: null,
      showAlert: false,
      file: null,
      showSuccess: false,
      privateKey: '',
      form:{
        audience: '',
        key: '',
        token: ''
      },
      show: true,
      defaultDidContract: process.env.VUE_APP_ISSUEDID_CONTRACT_NAME,
      defaultHealthOrgContract: process.env.VUE_APP_HEALTHORG_CONTRACT_NAME,
      eosio: null
    };
  },
  methods: {
    getKey: async function(evt){
      var reader=new FileReader();
      reader.addEventListener('load',(event)=>{
        this.form.key=event.target.result;  
      });
      reader.readAsText(this.file,"UTF-8");
      
      var newReader=new FileReader();
      newReader.addEventListener('load',(event)=>{
        this.form.token=event.target.result;  
      });
      newReader.readAsText(this.token,"UTF-8");
      
    },
    present: async function(evt){
      evt.preventDefault();
      
      var audience=this.form.audience;
      var token=this.form.token;
      var decoded=jwt.decode(token, {complete: true});
      
      var payload ={
        vp: {
          context: "",
          type: "",
          verifiableCredential: ""
        }
      };
      payload.vp.context=decoded.payload.vc.context;
      payload.vp.type=["VerifiablePresentiation"];
      payload.vp.verifiableCredential=token;
      

      var id = '';
      var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      var length=15;
      var charactersLength = characters.length;
      for ( var i = 0; i < length; i++ ) {
          id += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      
      var presentSignOptions={
        issuer:decoded.payload.sub,
        audience: audience,
        expiresIn: "2m",
        jwtid:id,
        algorithm: "ES256"
      }
      
      var token = jwt.sign(payload, this.form.key, presentSignOptions);
      
      
      document.getElementById("input-1").style.display="none";
      this.showSuccess=true;
      document.getElementById("disp").style.display="none";
      var blob=new Blob([token],{type:"text/plain; charset=utf-8"});
      saveAs(blob,"jwtPresentation.txt");
      
    },
    setVal: async function(token){
      console.log(token);
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
  .mar{
    margin-top: 20px;
    margin-bottom: 20px;
  }
  
</style>
