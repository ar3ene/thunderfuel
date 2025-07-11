use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

declare_id!("TF1111111111111111111111111111111111111111");

#[program]
pub mod thunderfuel_rewards {
    use super::*;

    /// 初始化奖励程序
    pub fn initialize(ctx: Context<Initialize>, authority: Pubkey) -> Result<()> {
        let reward_pool = &mut ctx.accounts.reward_pool;
        reward_pool.authority = authority;
        reward_pool.total_rewards = 0;
        reward_pool.total_distributed = 0;
        reward_pool.upload_reward_rate = 2_000_000_000; // 2 TF per GB (9 decimals)
        reward_pool.node_reward_rate = 5_000_000_000;   // 5 TF per hour
        reward_pool.seed_reward_rate = 100_000_000;     // 0.1 TF per hour
        Ok(())
    }

    /// 奖励用户上传数据
    pub fn reward_upload(
        ctx: Context<RewardUpload>,
        size_gb: u64,
        rarity_multiplier: u64,
    ) -> Result<()> {
        let reward_pool = &mut ctx.accounts.reward_pool;
        let user_account = &mut ctx.accounts.user_account;
        
        // 计算奖励: size_gb * rate * multiplier
        let base_reward = size_gb
            .checked_mul(reward_pool.upload_reward_rate)
            .ok_or(ErrorCode::MathOverflow)?;
        
        let total_reward = base_reward
            .checked_mul(rarity_multiplier)
            .ok_or(ErrorCode::MathOverflow)?;

        // 更新用户余额
        user_account.balance = user_account.balance
            .checked_add(total_reward)
            .ok_or(ErrorCode::MathOverflow)?;
        
        user_account.total_uploaded = user_account.total_uploaded
            .checked_add(size_gb)
            .ok_or(ErrorCode::MathOverflow)?;

        // 更新奖励池统计
        reward_pool.total_distributed = reward_pool.total_distributed
            .checked_add(total_reward)
            .ok_or(ErrorCode::MathOverflow)?;

        emit!(UploadRewardEvent {
            user: ctx.accounts.user_account.key(),
            amount: total_reward,
            size_gb,
            rarity_multiplier,
        });

        Ok(())
    }

    /// 奖励超级节点运营
    pub fn reward_super_node(
        ctx: Context<RewardNode>,
        duration_hours: u64,
        uptime_percentage: u8,
    ) -> Result<()> {
        let reward_pool = &mut ctx.accounts.reward_pool;
        let user_account = &mut ctx.accounts.user_account;
        
        // 检查是否有足够质押
        require!(
            user_account.staked_amount >= 10_000_000_000_000, // 10,000 TF
            ErrorCode::InsufficientStake
        );

        // 计算基础奖励
        let base_reward = duration_hours
            .checked_mul(reward_pool.node_reward_rate)
            .ok_or(ErrorCode::MathOverflow)?;

        // 根据在线率调整奖励 (最低90%在线率)
        require!(uptime_percentage >= 90, ErrorCode::LowUptime);
        
        let uptime_bonus = if uptime_percentage >= 99 {
            120 // 20% bonus for 99%+ uptime
        } else if uptime_percentage >= 95 {
            110 // 10% bonus for 95%+ uptime
        } else {
            100 // no bonus
        };

        let final_reward = base_reward
            .checked_mul(uptime_bonus as u64)
            .ok_or(ErrorCode::MathOverflow)?
            .checked_div(100)
            .ok_or(ErrorCode::MathOverflow)?;

        // 更新用户余额
        user_account.balance = user_account.balance
            .checked_add(final_reward)
            .ok_or(ErrorCode::MathOverflow)?;

        user_account.node_operation_hours = user_account.node_operation_hours
            .checked_add(duration_hours)
            .ok_or(ErrorCode::MathOverflow)?;

        // 更新奖励池统计
        reward_pool.total_distributed = reward_pool.total_distributed
            .checked_add(final_reward)
            .ok_or(ErrorCode::MathOverflow)?;

        emit!(NodeRewardEvent {
            user: ctx.accounts.user_account.key(),
            amount: final_reward,
            duration_hours,
            uptime_percentage,
        });

        Ok(())
    }

    /// 奖励长期做种
    pub fn reward_seeding(
        ctx: Context<RewardSeed>,
        duration_hours: u64,
        file_popularity: u8, // 1-100
    ) -> Result<()> {
        let reward_pool = &mut ctx.accounts.reward_pool;
        let user_account = &mut ctx.accounts.user_account;

        // 计算基础奖励
        let base_reward = duration_hours
            .checked_mul(reward_pool.seed_reward_rate)
            .ok_or(ErrorCode::MathOverflow)?;

        // 热度系数: 热门文件奖励更高
        let popularity_multiplier = if file_popularity >= 80 {
            150 // 50% bonus for very popular files
        } else if file_popularity >= 50 {
            125 // 25% bonus for popular files
        } else if file_popularity <= 20 {
            200 // 100% bonus for rare files
        } else {
            100 // no bonus
        };

        let final_reward = base_reward
            .checked_mul(popularity_multiplier as u64)
            .ok_or(ErrorCode::MathOverflow)?
            .checked_div(100)
            .ok_or(ErrorCode::MathOverflow)?;

        // 更新用户余额
        user_account.balance = user_account.balance
            .checked_add(final_reward)
            .ok_or(ErrorCode::MathOverflow)?;

        user_account.seeding_hours = user_account.seeding_hours
            .checked_add(duration_hours)
            .ok_or(ErrorCode::MathOverflow)?;

        emit!(SeedRewardEvent {
            user: ctx.accounts.user_account.key(),
            amount: final_reward,
            duration_hours,
            file_popularity,
        });

        Ok(())
    }

    /// 消耗代币获得下载加速
    pub fn consume_for_speed(
        ctx: Context<ConsumeTokens>,
        amount: u64,
    ) -> Result<()> {
        let user_account = &mut ctx.accounts.user_account;
        
        // 检查余额
        require!(
            user_account.balance >= amount,
            ErrorCode::InsufficientBalance
        );

        // 扣除代币
        user_account.balance = user_account.balance
            .checked_sub(amount)
            .ok_or(ErrorCode::MathOverflow)?;

        user_account.total_consumed = user_account.total_consumed
            .checked_add(amount)
            .ok_or(ErrorCode::MathOverflow)?;

        emit!(SpeedBoostEvent {
            user: ctx.accounts.user_account.key(),
            amount,
            new_balance: user_account.balance,
        });

        Ok(())
    }

    /// 质押代币成为超级节点
    pub fn stake_for_node(
        ctx: Context<StakeTokens>,
        amount: u64,
    ) -> Result<()> {
        let user_account = &mut ctx.accounts.user_account;
        
        // 检查最小质押量
        require!(amount >= 10_000_000_000_000, ErrorCode::InsufficientStake);
        
        // 检查余额
        require!(
            user_account.balance >= amount,
            ErrorCode::InsufficientBalance
        );

        // 从余额转入质押
        user_account.balance = user_account.balance
            .checked_sub(amount)
            .ok_or(ErrorCode::MathOverflow)?;

        user_account.staked_amount = user_account.staked_amount
            .checked_add(amount)
            .ok_or(ErrorCode::MathOverflow)?;

        emit!(StakeEvent {
            user: ctx.accounts.user_account.key(),
            amount,
            total_staked: user_account.staked_amount,
        });

        Ok(())
    }

    /// 解除质押
    pub fn unstake_tokens(
        ctx: Context<UnstakeTokens>,
        amount: u64,
    ) -> Result<()> {
        let user_account = &mut ctx.accounts.user_account;
        
        // 检查质押余额
        require!(
            user_account.staked_amount >= amount,
            ErrorCode::InsufficientStake
        );

        // 从质押转回余额
        user_account.staked_amount = user_account.staked_amount
            .checked_sub(amount)
            .ok_or(ErrorCode::MathOverflow)?;

        user_account.balance = user_account.balance
            .checked_add(amount)
            .ok_or(ErrorCode::MathOverflow)?;

        emit!(UnstakeEvent {
            user: ctx.accounts.user_account.key(),
            amount,
            remaining_staked: user_account.staked_amount,
        });

        Ok(())
    }
}

// 数据结构定义

#[account]
pub struct RewardPool {
    pub authority: Pubkey,
    pub total_rewards: u64,
    pub total_distributed: u64,
    pub upload_reward_rate: u64,  // TF per GB
    pub node_reward_rate: u64,    // TF per hour
    pub seed_reward_rate: u64,    // TF per hour
}

#[account]
pub struct UserAccount {
    pub owner: Pubkey,
    pub balance: u64,             // Available TF balance
    pub staked_amount: u64,       // Staked TF for super node
    pub total_uploaded: u64,      // Total GB uploaded
    pub total_consumed: u64,      // Total TF consumed for speed
    pub seeding_hours: u64,       // Total hours seeding
    pub node_operation_hours: u64, // Total hours operating super node
    pub reputation_score: u32,    // User reputation (0-1000)
}

// Context definitions

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + std::mem::size_of::<RewardPool>(),
        seeds = [b"reward_pool"],
        bump
    )]
    pub reward_pool: Account<'info, RewardPool>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct RewardUpload<'info> {
    #[account(
        mut,
        seeds = [b"reward_pool"],
        bump
    )]
    pub reward_pool: Account<'info, RewardPool>,
    
    #[account(
        init_if_needed,
        payer = user,
        space = 8 + std::mem::size_of::<UserAccount>(),
        seeds = [b"user", user.key().as_ref()],
        bump
    )]
    pub user_account: Account<'info, UserAccount>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct RewardNode<'info> {
    #[account(
        mut,
        seeds = [b"reward_pool"],
        bump
    )]
    pub reward_pool: Account<'info, RewardPool>,
    
    #[account(
        mut,
        seeds = [b"user", user.key().as_ref()],
        bump
    )]
    pub user_account: Account<'info, UserAccount>,
    
    #[account(mut)]
    pub user: Signer<'info>,
}

#[derive(Accounts)]
pub struct RewardSeed<'info> {
    #[account(
        mut,
        seeds = [b"reward_pool"],
        bump
    )]
    pub reward_pool: Account<'info, RewardPool>,
    
    #[account(
        mut,
        seeds = [b"user", user.key().as_ref()],
        bump
    )]
    pub user_account: Account<'info, UserAccount>,
    
    #[account(mut)]
    pub user: Signer<'info>,
}

#[derive(Accounts)]
pub struct ConsumeTokens<'info> {
    #[account(
        mut,
        seeds = [b"user", user.key().as_ref()],
        bump
    )]
    pub user_account: Account<'info, UserAccount>,
    
    #[account(mut)]
    pub user: Signer<'info>,
}

#[derive(Accounts)]
pub struct StakeTokens<'info> {
    #[account(
        mut,
        seeds = [b"user", user.key().as_ref()],
        bump
    )]
    pub user_account: Account<'info, UserAccount>,
    
    #[account(mut)]
    pub user: Signer<'info>,
}

#[derive(Accounts)]
pub struct UnstakeTokens<'info> {
    #[account(
        mut,
        seeds = [b"user", user.key().as_ref()],
        bump
    )]
    pub user_account: Account<'info, UserAccount>,
    
    #[account(mut)]
    pub user: Signer<'info>,
}

// Event definitions

#[event]
pub struct UploadRewardEvent {
    pub user: Pubkey,
    pub amount: u64,
    pub size_gb: u64,
    pub rarity_multiplier: u64,
}

#[event]
pub struct NodeRewardEvent {
    pub user: Pubkey,
    pub amount: u64,
    pub duration_hours: u64,
    pub uptime_percentage: u8,
}

#[event]
pub struct SeedRewardEvent {
    pub user: Pubkey,
    pub amount: u64,
    pub duration_hours: u64,
    pub file_popularity: u8,
}

#[event]
pub struct SpeedBoostEvent {
    pub user: Pubkey,
    pub amount: u64,
    pub new_balance: u64,
}

#[event]
pub struct StakeEvent {
    pub user: Pubkey,
    pub amount: u64,
    pub total_staked: u64,
}

#[event]
pub struct UnstakeEvent {
    pub user: Pubkey,
    pub amount: u64,
    pub remaining_staked: u64,
}

// Error definitions

#[error_code]
pub enum ErrorCode {
    #[msg("Mathematical operation overflow")]
    MathOverflow,
    
    #[msg("Insufficient balance")]
    InsufficientBalance,
    
    #[msg("Insufficient stake amount")]
    InsufficientStake,
    
    #[msg("Node uptime too low")]
    LowUptime,
}
