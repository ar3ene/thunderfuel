use serde::{Deserialize, Serialize};
use std::path::Path;
use anyhow::Result;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Config {
    pub node: NodeConfig,
    pub network: NetworkConfig,
    pub api: ApiConfig,
    pub blockchain: BlockchainConfig,
    pub storage: StorageConfig,
    pub database_url: String,
    pub solana_rpc_url: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NodeConfig {
    pub bandwidth_mbps: u32,
    pub max_connections: usize,
    pub storage_limit_gb: u64,
    pub stake_amount: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NetworkConfig {
    pub listen_addresses: Vec<String>,
    pub bootstrap_nodes: Vec<String>,
    pub quic_port: u16,
    pub tcp_port: u16,
    pub mdns_enabled: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ApiConfig {
    pub host: String,
    pub port: u16,
    pub cors_origins: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BlockchainConfig {
    pub rpc_url: String,
    pub program_id: String,
    pub commitment: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct StorageConfig {
    pub data_dir: String,
    pub cache_size_mb: usize,
    pub cleanup_interval_hours: u64,
}

impl Default for Config {
    fn default() -> Self {
        Self {
            node: NodeConfig {
                bandwidth_mbps: 100,
                max_connections: 1000,
                storage_limit_gb: 100,
                stake_amount: 10000,
            },
            network: NetworkConfig {
                listen_addresses: vec![
                    "/ip4/0.0.0.0/tcp/7001".to_string(),
                    "/ip4/0.0.0.0/udp/7001/quic-v1".to_string(),
                ],
                bootstrap_nodes: vec![
                    // Mainnet bootstrap nodes will be added here
                ],
                quic_port: 7001,
                tcp_port: 7001,
                mdns_enabled: true,
            },
            api: ApiConfig {
                host: "0.0.0.0".to_string(),
                port: 8001,
                cors_origins: vec!["*".to_string()],
            },
            blockchain: BlockchainConfig {
                rpc_url: "https://api.devnet.solana.com".to_string(),
                program_id: "TF1111111111111111111111111111111111111111".to_string(),
                commitment: "confirmed".to_string(),
            },
            storage: StorageConfig {
                data_dir: "./data".to_string(),
                cache_size_mb: 1024,
                cleanup_interval_hours: 24,
            },
            database_url: "postgresql://localhost/thunderfuel".to_string(),
            solana_rpc_url: "https://api.devnet.solana.com".to_string(),
        }
    }
}

impl Config {
    pub fn load<P: AsRef<Path>>(path: P) -> Result<Self> {
        if path.as_ref().exists() {
            let content = std::fs::read_to_string(path)?;
            Ok(toml::from_str(&content)?)
        } else {
            // Create default config file
            let default_config = Self::default();
            let content = toml::to_string_pretty(&default_config)?;
            std::fs::write(path, content)?;
            Ok(default_config)
        }
    }

    pub fn save<P: AsRef<Path>>(&self, path: P) -> Result<()> {
        let content = toml::to_string_pretty(self)?;
        std::fs::write(path, content)?;
        Ok(())
    }

    pub fn validate(&self) -> Result<()> {
        // Validate configuration parameters
        if self.node.bandwidth_mbps < 10 {
            return Err(anyhow::anyhow!("Minimum bandwidth requirement: 10 Mbps"));
        }

        if self.node.stake_amount < 10000 {
            return Err(anyhow::anyhow!("Minimum stake requirement: 10000 TF"));
        }

        if self.node.storage_limit_gb < 10 {
            return Err(anyhow::anyhow!("Minimum storage requirement: 10 GB"));
        }

        if self.network.listen_addresses.is_empty() {
            return Err(anyhow::anyhow!("At least one listen address required"));
        }

        Ok(())
    }
}
