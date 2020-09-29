#include<eosio/eosio.hpp>
#include<eosio/crypto.hpp>
#include<eosio/system.hpp>

class [[eosio::contract("credentials")]] credentials : public eosio::contract {
  public:
    /**
     * @brief Construct a new immunity passport object
     * 
     * @param receiver 
     * @param code 
     * @param ds 
     */
    credentials(eosio::name receiver, eosio::name code, eosio::datastream<const char*> ds):
      contract(receiver, code, ds), requests_table(receiver, receiver.value), pendings_table(receiver, receiver.value), immpass_table(receiver, receiver.value){}

    /**
     * @brief Individual initiates request for Immunity Passport with 
     * own did; this request is added to list: initiation_requests
     * @param requester_name key/account of the requester
     * @param healthworker_name key/account of health worker
    */
    
    ACTION initiate(eosio::name _requester_name, eosio::name _healthworker_name, std::string _identifier, eosio::name didContractAccount, eosio::name healthWorkersContractAccount){

      eosio::require_auth(_requester_name);

      didindex dids(didContractAccount,didContractAccount.value);
      auto iter=dids.find(_requester_name.value);
      eosio::check(iter!=dids.end(),"Could not find a did record for your account");
      std::string id="";
      if(iter!=dids.end()){
        id=iter->id;
      }
      eosio::check(iter!=dids.end(),"No DID found for the requester");

      workerindex employees(healthWorkersContractAccount,healthWorkersContractAccount.value);
      auto iterator = employees.find(_healthworker_name.value);
      eosio::check(iterator!=employees.end(),"No DID found for the healthworker");

       eosio::check(requests_table.find(_requester_name.value) == 
         requests_table.end(), "Request already exists with the same account");
  
       requests_table.emplace(_requester_name, [&](auto& request) {
         request.requester_name = _requester_name;
         request.healthworker_name = _healthworker_name;
         request.identifier=_identifier;
       });
    }

    
    ACTION issue(eosio::name _requester_name, eosio::name _issuer_name){
      
      eosio::require_auth(_issuer_name);
      auto itr = requests_table.find(_requester_name.value);
      eosio::check(itr!=requests_table.end(), "Couldn't find a request with this account");

      // TODO: What if there are more than one request for an individual with different healthworkers?
      eosio::check(itr->healthworker_name==_issuer_name,"The organization representative found on record for this request is different from the one you entered");

      requests_table.erase(itr);

    }

    
    /*
    ACTION issue(eosio::name _requester, eosio::name _healthworker, uint64_t _testreport_id){
      
      auto itr = pendings_table.find(_requester.value);
      // TODO: What if there are more than one found?
      eosio::check(itr!=pendings_table.end(),"Could not find individuals validated request to issue");
      eosio::check(itr->healthworker_name==_healthworker,"Found Health worker id on record for valdiated request is not the one entered");
      // TODO: Check if _testreport_id is valid
      auto govtid_individual = itr->individual_govt_id;
      // TODO: What if there are more than one found?
      pendings_table.erase(itr);
      std::string immpass_string = _requester.to_string();
      immpass_string.append(govtid_individual);
      immpass_string.append(_healthworker.to_string());
      immpass_string.append(std::to_string(_testreport_id));
      eosio::checksum256 hash_signature{};
      hash_signature = eosio::sha256(const_cast<char*>(immpass_string.c_str()), immpass_string.size());

      // TODO: Days valid must be a input parameter
      int days_valid = 365;
      auto expiry_time = eosio::current_time_point() + eosio::days(365);

      immpass_table.emplace(_healthworker,[&](auto& immpass){
        //immpass.test_report_id = _testreport_id;
        immpass.individual = _requester; 
        immpass.signature = hash_signature;
        immpass.expiry_time = expiry_time;
      });

    }

    
    ACTION reject(eosio::name _requester, eosio::name _healthworker, uint32_t _testreport_id){
      eosio::require_auth(_healthworker);
      auto itr = pendings_table.find(_requester.value);
      // TODO: What if there are more than one found?
      eosio::check(itr!=pendings_table.end(),"Could not find individuals validated request to issue");
      eosio::check(itr->healthworker_name==_healthworker,"Found Health worker id on record for valdiated request is not the one entered");
      auto govtid_individual = itr->individual_govt_id;
      // TODO: What if there are more than one found?
      pendings_table.erase(itr);
    }

    ACTION verify(eosio::name _individual){
      eosio::require_auth(_individual);
      auto itr = immpass_table.find(_individual.value);
      eosio::check(itr!=immpass_table.end(),"Could not find Immunity Passport for your account");
      eosio::check(itr->expiry_time>eosio::current_time_point(),"Found Immunity passport is no longer valid");
    }
    */
    
  private:

    struct [[eosio::table]] certificate{
      
      eosio::name individual;
      // TODO: Decide if this needs to be time_point_sec
      eosio::time_point_sec expiry_time;

      // TODO: I think we need a hash/ signature right?
      eosio::checksum256 signature;

      uint64_t primary_key() const { return individual.value;}
    };

    typedef eosio::multi_index<"imntypass"_n, certificate> immunitypassports_index;
    immunitypassports_index immpass_table;

    struct [[eosio::table]] newrequest{
      eosio::name requester_name;
      eosio::name healthworker_name;
      std::string identifier;
      uint64_t primary_key() const { return requester_name.value;}
    };

    typedef eosio::multi_index<"listinit"_n, newrequest> requests_index;
    requests_index requests_table;

    struct [[eosio::table]] pendingrequest{
      eosio::name requester_name;
      eosio::name healthworker_name;
      // TODO: Individual Govt ID must not be stored publicly
      std::string individual_govt_id; 
      std::string identifier;
      uint64_t primary_key() const { return requester_name.value;}
    };

    typedef eosio::multi_index<"listpdg"_n, pendingrequest> pendings_index;
    pendings_index pendings_table;

        TABLE healthworker {
            eosio::name key;
            std::string id;
            eosio::name organization;

            uint64_t primary_key() const { return key.value;}

            EOSLIB_SERIALIZE(healthworker, (key)(id)(organization));
        };

        typedef eosio::multi_index<"workers"_n, healthworker> workerindex;

        TABLE did {
            eosio::name key;
            std::string id;
            std::string controllerId;
            std::string publicKey;
            std::string keyType;  

            uint64_t primary_key() const { return key.value;}

            EOSLIB_SERIALIZE(did, (key)(id)(controllerId)(publicKey)(keyType));
        };
        typedef eosio::multi_index<"dids"_n, did> didindex;

        TABLE org {
            eosio::name key;
            std::string id;
            std::string email;
            int organizationId;
            std::string licenseIssuedByGov;

            uint64_t primary_key() const { return key.value;}

            EOSLIB_SERIALIZE(org, (key)(id)(email)(organizationId)(licenseIssuedByGov));
        };
        
        typedef eosio::multi_index<"orgs"_n, org> orgindex;

};
