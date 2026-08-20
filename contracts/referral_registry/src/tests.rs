#![cfg(test)]

use super::*;
use soroban_sdk::{symbol_short, testutils::Address as _, Address, Env};

fn setup() -> (
    Env,
    Address,
    Address,
    ReferralRegistryContractClient<'static>,
) {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register_contract(None, ReferralRegistryContract);
    let escrow_contract_addr = Address::generate(&env);
    let client = ReferralRegistryContractClient::new(&env, &contract_id);
    client.init(&escrow_contract_addr);
    (env, contract_id, escrow_contract_addr, client)
}