use anyhow::Result;
use clap::Parser;
use std::path::PathBuf;
use tracing::{info, warn, error};
use tokio::signal;

mod config;
mod network;
mod blockchain;
mod storage;
mod metrics;
mod server;
mod torrent;

use config::Config;
use network::P2PNetwork;
use blockchain::BlockchainClient;
use storage::Storage;
use metrics::MetricsCollector;
use server::ApiServer;

#[derive(Parser)]
#[command(name = "thunderfuel-super-node")]
#[command(about = "ThunderFuel Network Super Node")]
struct Args {
    /// Configuration file path
    #[arg(short, long, default_value = "config.toml")]
    config: PathBuf,
    
    /// Node ID (generated if not provided)
    #[arg(long)]
    node_id: Option<String>,
    
    /// Staked amount (in TF tokens)
    #[arg(long, default_value = "10000")]
    stake: u64,
    
    /// Enable verbose logging
    #[arg(short, long)]
    verbose: bool,
}

#[tokio::main]
async fn main() -> Result<()> {
    let args = Args::parse();
    
    // Initialize logging
    let subscriber = tracing_subscriber::FmtSubscriber::builder()
        .with_max_level(if args.verbose {
            tracing::Level::DEBUG
        } else {
            tracing::Level::INFO
        })
        .finish();
    tracing::subscriber::set_global_default(subscriber)?;

    info!("Starting ThunderFuel Super Node...");

    // Load configuration
    let config = Config::load(&args.config)?;
    info!("Configuration loaded: {:?}", config);

    // Validate stake requirement
    if args.stake < 10000 {
        error!("Insufficient stake: {} TF. Minimum required: 10000 TF", args.stake);
        return Err(anyhow::anyhow!("Insufficient stake amount"));
    }

    // Initialize components
    let storage = Storage::new(&config.database_url).await?;
    let blockchain = BlockchainClient::new(&config.solana_rpc_url).await?;
    let metrics = MetricsCollector::new();
    
    // Initialize P2P network
    let mut network = P2PNetwork::new(
        config.clone(),
        args.node_id.clone(),
        storage.clone(),
        metrics.clone(),
    ).await?;

    // Start API server
    let api_server = ApiServer::new(
        config.api.clone(),
        storage.clone(),
        metrics.clone(),
    );

    // Start all services
    let network_handle = tokio::spawn(async move {
        if let Err(e) = network.start().await {
            error!("P2P network error: {}", e);
        }
    });

    let api_handle = tokio::spawn(async move {
        if let Err(e) = api_server.start().await {
            error!("API server error: {}", e);
        }
    });

    let metrics_handle = tokio::spawn(async move {
        if let Err(e) = metrics.start_collection().await {
            error!("Metrics collection error: {}", e);
        }
    });

    info!("Super Node started successfully");
    info!("Node ID: {}", args.node_id.unwrap_or_else(|| "auto-generated".to_string()));
    info!("Stake: {} TF", args.stake);
    info!("API server: http://0.0.0.0:{}", config.api.port);

    // Wait for shutdown signal
    match signal::ctrl_c().await {
        Ok(()) => {
            info!("Shutdown signal received, stopping services...");
        }
        Err(err) => {
            error!("Unable to listen for shutdown signal: {}", err);
        }
    }

    // Graceful shutdown
    network_handle.abort();
    api_handle.abort();
    metrics_handle.abort();

    info!("Super Node stopped");
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_node_startup() {
        // Test basic node initialization
        let config = Config::default();
        let storage = Storage::new_in_memory().await.unwrap();
        let metrics = MetricsCollector::new();
        
        // This should not panic
        let _network = P2PNetwork::new(
            config,
            Some("test-node".to_string()),
            storage,
            metrics,
        ).await.unwrap();
    }
}
