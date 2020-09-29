<template>
  <v-container>
    <v-layout row class="text-xs-center">
        <v-container style="position: relative;top: 13%;" class="text-xs-center">
              <h1 id="remove">Requests Initiated</h1>
              
              <h1 id="ifExists">The following have requested for a University Credential</h1>
              <hr>
              <p id="ifNotSelected">Please select a name from the drop down menu</p>
              <p id="fail">Could not process the details</p>
              <h1 id="noRequests">You have no requests for now.</h1>
              <pre><p id="green">The request has been validated</p></pre>
              <v-btn color="primary"  id="request" @click="viewRequests()" primary>View</v-btn>
              <b-alert  v-model="showDismissibleAlert" @dismissed="showDismissibleAlert=false" variant="danger" dismissible>
              Could not issue a JWT
              </b-alert>
              <b-alert  v-model="showAlert" variant="success">
              JWT Issued
              </b-alert>
              
              <form id="form" name="requestsForm">
                <select id="border">
                  <option value="none">Choose the Student</option>
                </select>
                <v-btn color="primary"  id="ifTrue" @click="getName()">View Request</v-btn>
                
              </form>
              <div id="card" style="display:none;">
              <b-row align-h="center" class="mt-5">
                <b-col cols="5">
                  <b-card
                    title="University Credential"
                    style="max-width: 50rem;"
                    class="mb-2"
                  >
                    <b-card-text>
                      Name: {{this.name}}
                      
                    </b-card-text>

                    <b-button v-b-modal.modal-1 variant="primary">Issue Credential</b-button>
                  </b-card>
                </b-col>

              </b-row>
              </div>
              <textarea readonly rows="20" cols="100" id="token"></textarea>
              <b-modal @ok=createJWT class="p-3" id="modal-1" title="Issue Credential">
                <b-row>
                  <div id="pad">
                  
                  <b-form>
                    
                    <b-form-group id="input-group-2" label="Type of Degree:" label-for="input-3">
                      <b-form-input
                        id="input-3"
                        v-model="form.degreeType"
                        required
                        placeholder="Type of degree"
                      ></b-form-input>
                    </b-form-group>
                    <b-form-group id="input-group-2" label="Name of degree:" label-for="input-4">
                      <b-form-input
                        id="input-4"
                        v-model="form.degreeName"
                        required
                        placeholder="Name of degree"
                      ></b-form-input>
                    </b-form-group>
                    
                    <b-form-file
                      v-model="file"
                      id="fileID"
                      :state="Boolean(file)"
                      placeholder="File containing your private key"
                      drop-placeholder="Drop file here..."
                    ></b-form-file>
                    <div id="mar">   
                      <b-button @click="getKey()" variant="primary">Load</b-button>&nbsp;&nbsp;        
                      
                    </div>

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
import Validate from './validateImmPass';
import jwt from 'jsonwebtoken'
import {saveAs} from 'file-saver';
import { jsPDF } from "jspdf";
export default {
  data() {
    return {
      file:null,
      name: '',
      identifier: '',
      govtId: '',
      showAlert: false,
      showDismissibleAlert: false,
      form:{
        issuingTo: '',
        issuer: '',
        degreeType: '',
        degreeName: '',
        expiresIn: '',
        pkey: ''
      },
      listRequests:[],
      eosio: null
    };
  },
  components:{
      Validate
  },
  methods: {
        getKey: async function(){
          var reader=new FileReader();
          reader.addEventListener('load',(event)=>{
            this.form.pkey=event.target.result;  
          });
          reader.readAsText(this.file,"UTF-8");
        },
        createJWT: async function(evt){
          evt.preventDefault();
          
          var subject=this.form.issuingTo;
          var issuer=this.form.issuer;
          var degree_type=this.form.degreeType;
          var degree_name=this.form.degreeName;
          var expires=this.form.expiresIn;

          var payload={
              "vc":{
                  "context":["https://www.w3.org/2018/credentials/v1","https://www.w3.org/2018/credentials/examples/v1"],
                  "type": ["VerifiableCredential", "UniversityDegreeCredential"],
                  "credentialSubject":{
                      "degree": {
                          "type": "BachelorDegree",
                          "name": "Bachelor of Science and Arts"
                      }
                  }
              }
          };

        payload.vc.credentialSubject.degree.type=degree_type;
        payload.vc.credentialSubject.degree.name=degree_name;
        
        var iss=issuer;
        var sub=subject;
        var aud="India";
        var exp=expires;

        var id = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var length=15;
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
            id += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        
    
        var signOptions={
        issuer:iss,
        subject: sub,
        jwtid: id,
        algorithm: "ES256"
        };
        
        var token = jwt.sign(payload, this.form.pkey, signOptions);
        //document.getElementById("token").value=token;
        this.$bvModal.hide('modal-1');
        this.showAlert=true;
        document.getElementById("card").style.display="none";
        document.getElementById("form").style.display="none";
        /*
        try{
          await this.eosio.transaction('issue',{_requester_name: this.name, _issuer_name: this.eosio.account.name})
        }catch(error){
          console.log(error);
        }
        */
        var univName=signOptions.issuer.split(":")[2];
        var studentName=signOptions.subject.split(":")[2];
        var blob=new Blob([token],{type:"text/plain; charset=utf-8"});
        saveAs(blob,univName+"-vc-"+studentName+".txt");
        
        const doc = new jsPDF('p', 'mm', [297, 210]);
      
      
      var today=new Date();
      var date=today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()+'T';
      var time=today.getHours()+':'+today.getMinutes()+":"+today.getSeconds()+'Z';
      var cred={
        context: ["https://www.w3.org/2018/credentials/v1","https://www.w3.org/2018/credentials/examples/v1"],
        type: ["VerifiableCredential","AlumniCredential"],
        issuer: signOptions.issuer,
        issuanceDate: date+time,
        credentialSubject: {
          id: signOptions.subject,
          degree: {
            type: "Bachelors",
            name: "Computer Science and Engineering"
          }
        },
        proof: {
          type: "EcdsaSignature",
          created: date+time,
          proofPurpose: "assertionMethod",
          verificationMethod: "publicKey",
          jws: token
        }
      }
      //console.log(cred.issuer);
      doc.setFontSize(32);
      doc.text("Verifiable Credential",55,30);
      doc.setFontSize(12);
      doc.text("Context: "+cred.context[0],10,50);
      doc.text(cred.context[1],27,55);
      doc.text("Type:     "+cred.type[0],10,65);
      doc.text(cred.type[1],27,70);
      doc.text("Issuer:   "+cred.issuer,10,80);
      doc.text("Issuance date: "+cred.issuanceDate,10,90);
      doc.text("Issued to: "+cred.credentialSubject.id,10,100);
      doc.text("Degree Type: "+cred.credentialSubject.degree.type,10,110);
      doc.text("Degree Name: "+cred.credentialSubject.degree.name,10,120);
      doc.text("Proof Type: "+cred.proof.type,10,130);
      doc.text("Created on: "+cred.proof.created,10,140);
      doc.text("Proof Purpose: "+cred.proof.proofPurpose,10,150);
      doc.text("Verification Method: "+cred.proof.verificationMethod,10,160);
      doc.save("Credential.pdf");
      },


        handleLogin: async function() {
        document.querySelector("#green").style.display="none";
        document.querySelector("#fail").style.display="none";
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
            await this.eosio.transaction('validate', { _requester_name: this.name, _health_worker_name: this.eosio.account.name, _govt_id_number: this.govtId })
          ) {
            this.$router.push('pending');
            this.$store.commit('loginStatus', true);
            
            document.querySelector("#click").style.display="none";
            
            document.querySelector("#ifTrue").style.display="none";
            document.querySelector("#border").style.display="none";
            document.querySelector("#green").style.display="inline";
            document.querySelector("#green").style.display="inline";
            document.querySelector("#ifExists").style.display="none";
            document.querySelector("#remove").style.display="inline";
          }
        }catch(error){
          document.querySelector("#fail").style.display="inline";

          console.log(error);
        }

      },
      getName: async function(){
        document.querySelector('#ifNotSelected').style.display="none";
        var value=document.querySelector("#border").value;
        this.name=value;
        this.identifier=document.querySelector("#border").label;
        
        if(this.name!=='none') {
          document.getElementById("card").style.display="inline";
          let issuer=await this.eosio.getOrg(this.eosio.account.name);
          console.log(issuer);
          this.form.issuer="did:eos:"+issuer;
          this.form.issuingTo="did:eos:"+this.name;
        }
        else{
          document.querySelector('#ifNotSelected').style.display="inline";
        }
        
      },
      viewRequests: async function() {
      if (this.eosio === null) {
        this.eosio = new EosService(
          process.env.VUE_APP_IMMPASS_NAME,
          process.env.VUE_APP_IMMPASS_CONTRACT_NAME
        );
      }
        
      if (!(await this.eosio.connect()))
        return console.log('Failed to get Scatter account');
        
      try{
        
        let requests=await this.eosio.getRequests();
        let array=[];
        let identifiers=[];
        var count=0;
        for(var index in requests){
            
            if(requests[index].healthworker_name == this.eosio.account.name) {
                array.push(requests[index]);
                count++;
                var option=document.createElement('option');
                option.value=requests[index].requester_name;
                option.text=requests[index].requester_name;
                option.label=requests[index].identifier;
                
                var linebreak=document.createElement("br");
                document.querySelector("#border").appendChild(linebreak);
                document.querySelector("#border").appendChild(option);
                document.querySelector("#border").appendChild(linebreak);
                
            }
        
        }
        this.listRequests=array;
        
        document.querySelector('#remove').style.display="none";
        document.querySelector('#request').style.display="none";
        
        if(count!=0) {
            document.querySelector('#ifExists').style.display="inline";
            
            document.querySelector('#border').style.display="block";
            document.querySelector('#ifTrue').style.display="inline";
        }
        else document.querySelector('#noRequests').style.display="inline";
      }catch(error){
        console.log(error);
      }
    }
  }
};
</script>

<style scoped>
    #remove{
        display:block;
    }
    #request{
        display:inline;
    }
    #ifExists{
        display:none;
    }
    #display{
        display:none;
    }
    #noRequests{
        display:none;
    }
    #border{
        display:none;
        margin:auto;
        padding: 10px;
        border: 2px solid black;
    }
    #ifTrue{
      display:none;
    }
    #ifValid{
      display:none;
      color:green;
    }
    #fail{
      color:red;
      display:none;
    }
    #green{
      color:green;
      display:none;
    }
    #ifNotSelected{
      color:red;
      display:none;
    }
    #pad{
      padding: 10px;
      width: 450px;
    }
</style>