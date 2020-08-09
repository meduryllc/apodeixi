const assert = require('assert');

const ISSUE_DID_WASM_PATH = './compiled/issuedid.wasm';
const ISSUE_DID_ABI_PATH = './compiled/issuedid.abi';

describe("Test DID contract", function (eoslime) {

    // Increase mocha(testing framework) time, otherwise tests fails
    this.timeout(150000);
    let individual1;
    let individual2;
    let issueDidContract;

    const userprofile1 = {
        name : 'individual1',
        id : 'did:eos:individual1',
        controllerId : 'did:eos:individual1',
        keyType: 'secp256k1',
        
    };

    const healthorgProfile1={
        name : 'healthorg1',
        id : 'did:eos:healthorg1',
        controllerId : 'did:eos:healthorg1',
        keyType: 'secp256k1',
        
    };
    
    const workerProfile1={
        name : 'worker1',
        id : 'did:eos:worker1',
        controllerId : 'did:eos:worker1',
        keyType: 'secp256k1',
        
    };

    
    before(async () => {
        contractAccount = await eoslime.Account.load('issuedid','5JaVpzSKgfVcmxbyzWN4Vq5FNokMuBGeMEoTLRGSN6Y5fNtHQpr');
        individual1= await eoslime.Account.load('individual1','5KizW4BGEo1hzjLJS5YZPCMwiPALKrQPqBkVHzv3kVzRimMKbBF');
        individual2= await eoslime.Account.load('individual2','5K5dZPm63DFT4Afofpf2tm8jNHfmVJta2T2PmTbtXCYiCgT5Fzt');
        healthorg1= await eoslime.Account.load('healthorg1','5HsWbyvg3gFzY2Hmggz8xRgZya39Z2WXbFE76FXMT33KZ8obaxR');
        healthorg2= await eoslime.Account.load('healthorg2','5JtSzuqcv3S834aqk7jxRoS9a1JcRwBx1jreJ5zvFcHy7sYvef2');
        worker1= await eoslime.Account.load('worker1','5JXzVj5kk2zTpBtrq4LJmjbr582BYjzW4JHhwaVjzr1GvmHiyr6');
        worker2= await eoslime.Account.load('worker2','5Hz6Qh7HYDZD1GnNk7udLnF5Zb6zh8MEgCD97Nf8438QMkNXfg5');
        issueDidContract = await eoslime.Contract.deployOnAccount(ISSUE_DID_WASM_PATH,ISSUE_DID_ABI_PATH,contractAccount);

    });
    
    it("Issues Individual DID", async () => {
        try{
            await issueDidContract.upsert(individual1.name, "EOS75ofK3LWeH7uReyjz3BrF44p9p1SUYQRDctXg8M3PcHqB5XXKV", {from: individual1});

            let didData = await issueDidContract.dids.equal(individual1.name).find();

            assert.equal(didData[0].key, individual1.name, "Incorrect user");
            assert.equal(didData[0].id, userprofile1.id, "Incorrect DID");
            assert.equal(didData[0].controllerId, userprofile1.controllerId, "Incorrect controller ID");
            assert.equal(didData[0].keyType,userprofile1.keyType,"Incorrect Key Type");
            
        }catch(error){
            console.log
        }
        
        
    });
    
    
    it("Issues organization DID", async () => {
        await issueDidContract.upsert(healthorg1.name, "EOS8axLLpFh9da7mpBvTvUJ964HS6dMk1kaH39iLmr6CoQfkbCzij", {from: healthorg1});

        let didData = await issueDidContract.dids.equal(healthorg1.name).find();

        assert.equal(didData[0].key, healthorg1.name, "Incorrect user");
        assert.equal(didData[0].id, healthorgProfile1.id, "Incorrect DID");
        assert.equal(didData[0].controllerId, healthorgProfile1.controllerId, "Incorrect controller ID");
        assert.equal(didData[0].keyType,healthorgProfile1.keyType,"Incorrect Key Type");
        
        
    });

    
    it("Issues Worker DID", async () => {
        await issueDidContract.upsert(worker1.name, "EOS6c5QgEfGJwiMTUQnJ2nyw7kppKcK2ZBXzQwVsqM7tLM75VwZtT", {from: worker1});
        
        let didData = await issueDidContract.dids.equal(worker1.name).find();

        assert.equal(didData[0].key, worker1.name, "Incorrect user");
        assert.equal(didData[0].id, workerProfile1.id, "Incorrect DID");
        assert.equal(didData[0].controllerId, workerProfile1.controllerId, "Incorrect controller ID");
        assert.equal(didData[0].keyType,workerProfile1.keyType,"Incorrect Key Type");
       
        
    });

    
});
