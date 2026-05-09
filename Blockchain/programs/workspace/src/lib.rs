use anchor_lang::prelude::*;

declare_id!("Gkh5t4pgh19DgdAogGdADhzKhYpDBQynUcHvWvL9A9Yz");

#[program]
pub mod workspace {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
