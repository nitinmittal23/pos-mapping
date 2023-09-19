let path = require("path");
let dotenv = require("dotenv");

// load config env
let root = path.normalize(`${__dirname}/../..`);
let fileName = "/.env";

const configFile = `${root}${fileName}`;
dotenv.config({ path: configFile, silent: true });

module.exports = {
  // RPCs
  MAINNET_ETHEREUM_RPC: process.env.MAINNET_ETHEREUM_RPC,
  MAINNET_MATIC_RPC: process.env.MAINNET_MATIC_RPC,
  TESTNET_ETHEREUM_RPC: process.env.TESTNET_ETHEREUM_RPC,
  TESTNET_MATIC_RPC: process.env.TESTNET_MATIC_RPC,

  // deployer address
  DEPLOY_ADMIN_ADDRESS: process.env.DEPLOY_ADMIN_ADDRESS || '0x463f64Ad3448e0bE80ba3b6428a9d029f25f162f',
  DEPLOY_ADMIN_PRIVATE_KEY: process.env.DEPLOY_ADMIN_PRIVATE_KEY,

  // extra params
  NULL_ADDRESS: "0x0000000000000000000000000000000000000000",
  GAS: {
    GAS: 500000,
    DEPLOYMENT_GAS: 7000000,
    GAS_PRICE: 70000000000
  },

  // ownership transfer address
  JD_ADDRESS: process.env.JD_ADDRESS || '0x355b8E02e7F5301E6fac9b7cAc1D6D9c86C0343f',
  CHILDCHAIN_MAINNET_GNOSIS_SAFE_ADDRESS: process.env.CHILDCHAIN_MAINNET_GNOSIS_SAFE_ADDRESS || '0x355b8E02e7F5301E6fac9b7cAc1D6D9c86C0343f',

};
