# PoS Mappings

![GitHub](https://img.shields.io/github/license/nitinmittal23/pos-mapping)

## Installation

```sh
$ nvm use 18
$ npm install
```

## Configure environment

You need to configure your environment variables now. Copy `.env.example` and rename as `.env`. Now provide values for the keys mentioned there.

## USAGE

- update the mapping details in `main.js` file

```sh
# deploy token
$ npm run deploy
```

## Mapping

Once child token is deployed, the script will return the complete mapping details

```sh
{
    root_token: "0xabc",
    child_token: "0xpqr"
    token_type: "0xabcdef"
    // other non important related details
}
```

### Testnet
Mappings on testnet does not require multisig. mapping can be done by EOA [0xf89154D7A42c5E9f77884511586A9db4618683C5](https://goerli.etherscan.io/address/0xf89154D7A42c5E9f77884511586A9db4618683C5)

Steps:
1. Go to [rootChainManagerProxy](https://goerli.etherscan.io/address/0xBbD7cBFA79faee899Eaf900F13C9065bF03B1A74#writeProxyContract) Contract on goerli.
2. click on `Write as Proxy` and connect account with the above `EOA` address
3. Go to `mapToken` function and enter the details returned by the script and execute transaction
4. Mapping done


### Mainnet
Mappings on mainnet is done via [multisig](https://etherscan.io/address/0x424bDE99FCfB68c5a1218fd3215caFfD031f19C4) on Ethereum chain.

Steps:
1. Add above multisig added in [gnosis](https://app.safe.global/apps?safe=eth:0x424bDE99FCfB68c5a1218fd3215caFfD031f19C4)
2. Open [transaction Builder](https://app.safe.global/share/safe-app?appUrl=https%3A%2F%2Fapps-portal.safe.global%2Ftx-builder&chain=eth)
3. Add the rootChainManager contract (Make sure that the ABI used is from [implementation](https://etherscan.io/address/0x536c55cFe4892E581806e10b38dFE8083551bd03) contract but the address used is [Proxy](https://etherscan.io/address/0x86E4Dc95c7FBdBf52e33D563BbDB00823894C287) contract).
4. Select `mapToken` and enter the details returned by the script and initiate transaction
2. Mapping will be done when all the multisig owners sign the transaction and execute it.
