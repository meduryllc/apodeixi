const assert = require('assert');
const eoslime = require('eoslime');
//const eoslime = require('eoslime').init('jungle', { url: 'https://jungle2.eosio.cr:443', chainId: 'e70aaab8997e1dfce58fbfac80cbbb8fecec7b99cf982a9444273cbc64c41473' });
/*
const Networks = {
    bos: {
        name: 'bos',
        url: 'https://hapi.bos.eosrio.io',
        chainId: 'd5a3d18fbb3c084e3b1f3fa98c21014b5f3db536cc15d08f9f6479517c6a3d86'
    },
    local: {
        name: 'local',
        url: 'http://127.0.0.1:8888',
        chainId: 'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f'
    },
    worbli: {
        name: 'main',
        url: 'https://eos.greymass.com',
        chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906'
    },
    jungle: {
        name: 'jungle',
        url: 'https://jungle2.cryptolions.io',
        chainId: 'e70aaab8997e1dfce58fbfac80cbbb8fecec7b99cf982a9444273cbc64c41473'
    },
    main: {
        name: 'main',
        url: 'https://eos.greymass.com',
        chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906'
    },
    kylin: {
        name: 'kylin',
        url: 'https://kylin.eoscanada.com',
        chainId: '5fff1dae8dc8e2fc4d5b23b2c7665c97f9e9d8edf2b6485a86ba311c25639191'
    },
    custom: {
        name: 'custom',
        url: 'https://custom.com',
        chainId: '123'
    },
}
*/
const IMM_PASS_WASM_PATH = './compiled/credentials.wasm';
const IMM_PASS_ABI_PATH = './compiled/credentials.abi';

function makeid(length) {
   var result           = '';
   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

describe("Test Immunity Passport contract", function (eoslime) {

    // Increase mocha(testing framework) time, otherwise tests fails
    this.timeout(1500000);

    let myDefaultAccount;
    let newaccount;
    let immunityPassportContract;
    let sanjaysahu;
    let individual1;

    

    before(async () => {
        
        contractAccount = await eoslime.Account.load('immpass','5JQuzojmXPZ4waW5RWWkfUmB5AABPEpwveWw7inYEpWk5cjMs45');
        individual1= await eoslime.Account.load('individual1','5KizW4BGEo1hzjLJS5YZPCMwiPALKrQPqBkVHzv3kVzRimMKbBF');
        worker1= await eoslime.Account.load('worker1','5JXzVj5kk2zTpBtrq4LJmjbr582BYjzW4JHhwaVjzr1GvmHiyr6');
        immunityPassportContract = await eoslime.Contract.deployOnAccount(IMM_PASS_WASM_PATH,IMM_PASS_ABI_PATH,contractAccount);
    });

    it("Adds request to requests table to let authorized employee verify it ", async() => {

        try{
            await immunityPassportContract.initiate(individual1.name, worker1.name,"studentID", "issuedid", "onboarding", {from: individual1});
            let requestsTable = immunityPassportContract.listinit;
            let requests = await requestsTable.equal(individual1.name).find();
            assert(requests[0].requester_name==individual1.name);
        }catch(error){
            console.log(error);
        }

    });

    

});