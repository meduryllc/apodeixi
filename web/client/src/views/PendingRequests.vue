<template>
  <v-container>
    <v-layout row class="text-xs-center">
        <v-container style="position: relative;top: 13%;" class="text-xs-center">
              <h1 id="remove">Pending Requests</h1>
              <pre><h1 id="ifExists">Select the patient: </h1></pre>
              <p id="ifNotSelected">Please select an option from the drop down menu</p>
              <p id="colorRed">Could not process the details</p>
              <pre><p id="green">Your action has been saved</p></pre>
              <h1 id="noRequests">You have no pending requests for now.</h1>
                <v-btn color="primary"  id="request" @click="viewRequests()" primary>View</v-btn>
              <form id="form" name="requestsForm">
                <select id="border">
                  <option value="none">Choose the patient</option>
                </select>
                <div id="display">
                  <v-btn color="primary"  id="requestIssue" @click="Issuing()" primary>Issue</v-btn>
                  <v-btn color="primary"  id="requestReject" @click="Rejecting()" primary>Reject</v-btn>
                </div>
              </form>

              <h1 id="ifValid">Issue Immunity Passport to: {{name}}</h1>
              <h1 id="ifNotValid">Reject Immunity Passport to: {{name}}</h1>
              <div id="issue">
                  <v-text-field
                  v-model="testReportId"
                  name="ID"
                  label="Test Report ID"
                  ></v-text-field>
                  <v-btn color="primary"  @click="Issue()" primary >Issue</v-btn>
              </div>
              <div id="reject">
                  <v-text-field
                  v-model="testReportId"
                  name="ID"
                  label="Test Report ID"
                  ></v-text-field>
                
                  <v-btn color="primary"  @click="Reject()" primary >Reject</v-btn>
              </div>
        </v-container>
    </v-layout>
  </v-container>
</template>

<script>
import EosService from '@/eosio/EosService';

import Issue from './issueImmPass'
import Reject from './rejectImmPass'

export default {
  data() {
    return {
      name:'',
      testReportId:'',
      pKey: '',
      listRequests:[],
      picked: '',
      eosio: null
    };
  },
  components:{
      Issue,
      Reject
  },
  methods: {
        Issue: async function() {
        if (this.eosio === null) {
          this.eosio = new EosService(
            process.env.VUE_APP_IMMPASS_NAME,
            process.env.VUE_APP_IMMPASS_CONTRACT_NAME
          );
          console.log(process.env.VUE_APP_IMMPASS_CONTRACT_NAME);
          console.log(process.env.VUE_APP_IMMPASS_NAME);
        }

        if (!(await this.eosio.connect()))
          return console.log('Failed to get Scatter account');
        try{
        if (
          await this.eosio.transaction('issue', { _requester: this.name, _healthworker: this.eosio.account.name, _testreport_id: this.testReportId })
        ) {
          this.$store.commit('loginStatus', true);
          document.querySelector('#green').style.display="inline";
          document.querySelector('#colorRed').style.display="none";
          document.querySelector('#request').style.display="none";
          document.querySelector('#requestIssue').style.display="none";
          document.querySelector('#requestReject').style.display="none";
          document.querySelector('#issue').style.display="none";
          document.querySelector('#reject').style.display="none";
          document.querySelector("#border").style.display="none";
          document.querySelector("#ifValid").style.display="none";
          document.querySelector("#ifNotValid").style.display="none";
          document.querySelector("#ifExists").style.display="none";
          document.querySelector("#remove").style.display="inline";
          this.$router.push('requests');
        }
        }catch(error){
          document.querySelector('#colorRed').style.display="inline";
          console.log(error);
        }

      },
      Reject: async function() {
        if (this.eosio === null) {
          this.eosio = new EosService(
            process.env.VUE_APP_IMMPASS_NAME,
            process.env.VUE_APP_IMMPASS_CONTRACT_NAME
          );
          console.log(process.env.VUE_APP_IMMPASS_CONTRACT_NAME);
          console.log(process.env.VUE_APP_IMMPASS_NAME);
        }

        if (!(await this.eosio.connect()))
          return console.log('Failed to get Scatter account');

        try{
          if (
            await this.eosio.transaction('reject', { _requester: this.name, _healthworker: this.eosio.account.name, _testreport_id: this.testReportId })
          ) {
            this.$store.commit('loginStatus', true);
            document.querySelector('#green').style.display="inline";
            document.querySelector('#colorRed').style.display="none";
            document.querySelector('#request').style.display="none";
            document.querySelector('#requestIssue').style.display="none";
            document.querySelector('#requestReject').style.display="none";
            document.querySelector('#issue').style.display="none";
            document.querySelector('#reject').style.display="none";
            this.$router.push('requests');
          }
        }catch(error){
          document.querySelector('#colorRed').style.display="inline";
        }
      },
      Issuing: async function(){
          var value=document.querySelector("#border").value;
          this.name=value;
          console.log(this.name);
          document.querySelector('#issue').style.display="none";
          document.querySelector('#reject').style.display="none";
          document.querySelector('#ifValid').style.display="none";
          document.querySelector('#ifNotValid').style.display="none";

          if(this.name!=='none') {
            document.querySelector('#ifNotSelected').style.display="none";
            document.querySelector('#display').style.display="inline";
            document.querySelector('#ifValid').style.display="inline";
            document.querySelector("#issue").style.display="inline";
          }
          else{
            document.querySelector('#ifNotSelected').style.display="inline";
          }
      },
      Rejecting: async function(){
          var value=document.querySelector("#border").value;
          this.name=value;
          document.querySelector("#reject").style.display="none";
          document.querySelector("#issue").style.display="none";
          document.querySelector('#ifValid').style.display="none";
          document.querySelector('#ifNotValid').style.display="none";
         
          if(this.name!=='none') {
            document.querySelector('#ifNotSelected').style.display="none";
            document.querySelector('#display').style.display="inline";
            document.querySelector('#ifNotValid').style.display="inline";
            document.querySelector("#reject").style.display="inline";
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
        let requests=await this.eosio.getPendingRequests();
        let array=[];
        var count=0;
        for(var index in requests){
            if(requests[index].healthworker_name == this.eosio.account.name) {
                array.push(requests[index]);
                count++;
                var option=document.createElement('option');
                option.value=requests[index].requester_name;
                option.text=requests[index].requester_name;

                document.querySelector("#border").appendChild(option);
                var linebreak=document.createElement("br");
                document.querySelector("#border").appendChild(linebreak);
            }
        }
        this.listRequests=array;
        document.querySelector('#remove').style.display="none";
        document.querySelector('#request').style.display="none";
        if(count!=0) {
            document.querySelector('#ifExists').style.display="inline";
            document.querySelector('#display').style.display="inline";
            document.querySelector('#border').style.display="block";
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
    #issue{
        display:none;
    }
    #reject{
        display: none;
    }
    #border{
        display:none;
        margin:auto;
        padding: 10px;
        border: 2px solid black;
    }
    #ifValid{
      display: none;
      color:green;
    }
    #ifNotValid{
      display: none;
      color:red;
    }
    #green{
      display:none;
      color:green;
    }
    #ifNotSelected{
      display:none;
      color:red;
    }
</style>>