<template>
  <v-container>
    <v-layout row class="text-xs-center">
        <v-container style="position: relative;top: 13%;" class="text-xs-center">
            <h1>Get a DID</h1>
            <hr>
            <pre><p id="colorRed">Could not process the details</p></pre>
            <v-btn color="primary"  v-b-modal.modal-1 primary >Register</v-btn>
            <b-modal @ok=handleLogin id="modal-1" title="Get DID">
                <b-row>
                  <div id="pad">
                  
                  <b-form>
                    <b-form-group
                      id="input-group-1"
                      label="Your ECC Public Key:"
                      label-for="input-1"
                      
                    >
                    <div id="wid">
                      <b-form-file
                        v-model="file"
                        id="fileID"
                        :state="Boolean(file)"
                        placeholder="File containing your public key"
                        drop-placeholder="Drop file here..."
                      ></b-form-file>
                      <hr> 
                      <b-button @click="getKey()" variant="primary">Load</b-button>&nbsp;&nbsp;        
                      <div>
                        <span>Don't have an ECC key pair? <span style="color:blue;" @click="gen()">Generate </span>one</span>
                      </div>
                    </div>
                    </b-form-group>
                    
                  </b-form>
                  </div>
                </b-row>
              </b-modal>
        </v-container>
    </v-layout>
  </v-container>
</template>

<script>
import EosService from '@/eosio/EosService';
const { randomBytes } = require('crypto')
const secp256k1 = require('secp256k1')
import ecc from 'eccjs';
const EC = require('elliptic').ec;
//import keyEncoder from 'key-encoder';
import KeyEncoder from 'key-encoder/lib/key-encoder';
import {saveAs} from 'file-saver';


export default {
  data() {
    return {
      file:null,
      pKey: '',
      eosio: null
    };
  },
  methods: {
    gen: async function(){
      var secp=new EC('secp256k1');
      var keypair=secp.genKeyPair();
      var rawPrivateKey=keypair.getPrivate("hex");
      var rawPublicKey=keypair.getPublic("hex");
      
      var keyEncoder=new KeyEncoder('secp256k1');
    
      var encoderOptions = {
          curveParameters: [1, 3, 132, 0, 10],
          privatePEMOptions: {label: 'EC PRIVATE KEY'},
          publicPEMOptions: {label: 'PUBLIC KEY'},
          curve: new EC('secp256k1')
      }
      var keyEncoder = new KeyEncoder(encoderOptions)
      var pemPrivateKey = keyEncoder.encodePrivate(rawPrivateKey, 'raw', 'pem');
      var pemPublicKey=keyEncoder.encodePublic(rawPublicKey, 'raw','pem')
      var blob=new Blob([pemPrivateKey],{type:"text/plain; charset=utf-8"});
      saveAs(blob,"privateKey.txt");
      var diffBlob=new Blob([pemPublicKey],{type:"text/plain; charset=utf-8"});
      saveAs(diffBlob,"publicKey.txt");
    },
    getKey: async function(){
      var reader=new FileReader();
      reader.addEventListener('load',(event)=>{
        this.pKey=event.target.result;  
      });
      reader.readAsText(this.file,"UTF-8");

    },
    handleLogin: async function() {
      
      if (this.eosio === null) {
        this.eosio = new EosService(
          process.env.VUE_APP_ISSUEDID_NAME,
          process.env.VUE_APP_ISSUEDID_CONTRACT_NAME
        );
      }
    
      if (!(await this.eosio.connect())) 
      return console.log('Failed to get Scatter account');
      
      var key=this.pKey;
      
      key.replace('\n',"");

      try{
        if (
          await this.eosio.transaction('upsert', { user: this.eosio.account.name, publicKey: key })
        ) {
          this.$store.commit('loginStatus', true);
          this.$store.commit('Identity', 'individual');
          this.$router.push('individual');
        }
      }catch(error){
        document.querySelector('#colorRed').style.display="inline";
        console.log(error);
      }
      
    }
  }
};
</script>

<style>
  #colorRed{
    color:red;
    display: none;
  }
  #wid{
    width:400px;
  }
  span{
    display:"none";
  }
  #mar{
    margin-top:"20px";
    margin-left:"0px";
  }
</style>
