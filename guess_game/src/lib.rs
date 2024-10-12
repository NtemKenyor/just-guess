use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    program_error::ProgramError,
    pubkey::Pubkey,
    system_instruction,
    program::invoke,
};
use borsh::{BorshDeserialize, BorshSerialize};

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct GameState {
    pub questioner: Pubkey,
    pub true_answer: String,
    pub funds: u64,
}

entrypoint!(process_instruction);

fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();

    let questioner = next_account_info(accounts_iter)?;
    let game_state = next_account_info(accounts_iter)?;
    let answerer = next_account_info(accounts_iter)?;

    // Instruction data: 0 -> initialize, 1 -> guess
    let instruction_type = instruction_data[0];

    if instruction_type == 0 {
        // Initialize the game
        let true_answer = String::from_utf8(instruction_data[1..].to_vec()).unwrap();

        let game_data = GameState {
            questioner: *questioner.key,
            true_answer,
            funds: questioner.lamports(),
        };

        game_data.serialize(&mut &mut game_state.try_borrow_mut_data()?[..])?;

        msg!("Game initialized with funds: {}", questioner.lamports());
    } else if instruction_type == 1 {
        // Attempt a guess
        let provided_answer = String::from_utf8(instruction_data[1..].to_vec()).unwrap();

        let mut game_data = GameState::try_from_slice(&game_state.try_borrow_data()?)?;

        if provided_answer == game_data.true_answer {
            msg!("Correct answer!");

            invoke(
                &system_instruction::transfer(
                    questioner.key,
                    answerer.key,
                    game_data.funds,
                ),
                &[questioner.clone(), answerer.clone()],
            )?;
        } else {
            msg!("Incorrect answer!");
        }
    }

    Ok(())
}



/* pub fn add(left: u64, right: u64) -> u64 {
    left + right
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn it_works() {
        let result = add(2, 2);
        assert_eq!(result, 4);
    }
} */
