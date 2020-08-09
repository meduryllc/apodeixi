import { Api, JsonRpc } from 'eosjs';

import ScatterJS from 'scatterjs-core';
import ScatterEOS from 'scatterjs-plugin-eosjs2';


const endpoint = 'https://jungle2.cryptolions.io:443'; // Jungle
const network = {
  blockchain: 'eos',
  protocol: 'https',
  host: 'jungle2.cryptolions.io',
  port: 443,
  chainId: 'e70aaab8997e1dfce58fbfac80cbbb8fecec7b99cf982a9444273cbc64c41473'
};

/*
const endpoint = 'http://127.0.0.1:8888'; // Jungle
const network = ScatterJS.Network.fromJson({
  blockchain: 'eos',
  protocol: 'http',
  host: 'localhost',
  port: '8888',
  chainId: 'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f'
});
*/

const didContract=process.env.VUE_APP_ISSUEDID_CONTRACT_NAME;
const universityContract=process.env.VUE_APP_HEALTHORG_CONTRACT_NAME;
const workerContract=process.env.VUE_APP_HEALTHWORKER_CONTRACT_NAME;
const credentialContract=process.env.VUE_APP_IMMPASS_CONTRACT_NAME;

class EosService {
  constructor(dappName, contractAccount) {
    this.dappName = dappName;
    this.contractAccount = contractAccount;
    ScatterJS.plugins(new ScatterEOS());
    this.rpc = new JsonRpc(endpoint);
    const rpc=this.rpc;
    window.ScatterJS = null;
  }
  
  connect = async () => {
    await ScatterJS.scatter.connect(this.dappName).then(connected => {
      if (!connected) return console.log('Failed to connect with Scatter!');
      this.scatter = ScatterJS.scatter;
    });
    await this.scatter.forgetIdentity();
    await this.scatter.getIdentity({ accounts: [network] }).then(() => {
      this.account = this.scatter.identity.accounts.find(
        e => e.blockchain === 'eos'
      );
    });
    
    
    if (this.account === null) return false;

    return true;
  };
  
  getKey= async (account)=>{
    
    const res= await this.rpc.get_table_rows({
        json: true,
        code: didContract,
        scope: didContract,
        table: 'dids',
        lower_bound: account
      });
      return [res.rows[0].publicKey];
  };

  getOrg= async (account)=>{
    const res= await this.rpc.get_table_rows({
        json: true,
        code: workerContract,
        scope: workerContract,
        table: 'workers',
        lower_bound: account
      });
      return [res.rows[0].organization];
  };

  getDid = async(account) =>{
      const res= await this.rpc.get_table_rows({
        json: true,
        code: credentialContract,
        scope: credentialContract,
        table: 'imntypass',
        lower_bound: account
      });
      return [res.rows[0].expiry_time,res.rows[0].signature];
  };

  getRequests = async(account) =>{
      const res= await this.rpc.get_table_rows({
        json: true,
        code: credentialContract,
        scope: credentialContract,
        table: 'listinit',
        lower_bound: account
      });
      
      return res.rows
  }
  getPendingRequests = async(account) =>{
      const res= await this.rpc.get_table_rows({
        json: true,
        code: credentialContract,
        scope: credentialContract,
        table: 'listpdg',
        lower_bound: account
      });
      return res.rows
  }
  getDomain = async(orgName) =>{
      const res= await this.rpc.get_table_rows({
        json: true,
        code: universityContract,
        scope: universityContract,
        table: 'orgs',
        lower_bound: orgName
      });
      return res.rows[0].email;
  }
  getOrganizations = async() =>{
      console.log("Here");
      const res= await this.rpc.get_table_rows({
        json: true,
        code: universityContract,
        scope: universityContract,
        table: 'orgs'
      });
      return res.rows;
  }
  getLogin = async(accountName,contract) =>{
      let thisTable='';
      if(contract===didContract) {
        thisTable='dids';
      }
      else if(contract===workerContract) {
        thisTable='workers';
      }
      const res= await this.rpc.get_table_rows({
        json: true,
        code: contract,
        scope: contract,
        table: thisTable,
        lower_bound: accountName
      });
      if(accountName===res.rows[0].key) return true;
      else return false;
  }


  transaction = async (action, data) => {
    this.api = this.scatter.eos(network, Api, { rpc: this.rpc });
    
    const resultWithConfig = await this.api.transact(
      {
        actions: [
          {
            account: this.contractAccount,
            name: action,
            authorization: [
              {
                actor: this.account.name,
                permission: this.account.authority
              }
            ],
            data: {
              ...data
            }
          }
        ]
      },
      {
        blocksBehind: 3,
        expireSeconds: 30
      }
    );
    
    //console.log(resultWithConfig);
    
    
    return true;
  };
}

export default EosService;
