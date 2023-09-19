const MetaNetwork = require('@maticnetwork/meta/network');
const Web3 = require('web3');
const config = require('../config/config');

export const getPoSMeta = (network = 'mainnet') => {
    const erc20TokenType = "0x8ae85d849167ff996c04040c44924fd364217285e4cad818292c7ac37c0a345b";
    const erc721TokenType = "0x73ad2146b3d3a286642c794379d750360a2d53a3459a11b3e5d6cc900f55f44a";
    const erc1155TokenType = "0x973bb64086f173ec8099b7ed3d43da984f4a332e4417a08bc6a286e6402b0586";
    const mintableErc20TokenType = "0x5ffef61af1560b9aefc0e42aaa0f9464854ab113ab7b8bfab271be94cdb1d053";
    const mintableErc721TokenType = "0xd4392723c111fcb98b073fe55873efb447bcd23cd3e49ec9ea2581930cd01ddc";
    const mintableErc1155TokenType = "0xb62883a28321b19a93c6657bfb8ea4cec51ed05c3ab26ecec680fa0c7efb31b9";

    let metaNetwork = new MetaNetwork('mainnet', 'v1');
    let parentProvider = new Web3.providers.HttpProvider(config.MAINNET_ETHEREUM_RPC);
    let childProvider = new Web3.providers.HttpProvider(config.MAINNET_MATIC_RPC);
    if (network === 'testnet') {
        metaNetwork = new MetaNetwork('testnet', 'mumbai')
        parentProvider = new Web3.providers.HttpProvider(config.TESTNET_ETHEREUM_RPC);
        childProvider = new Web3.providers.HttpProvider(config.TESTNET_MATIC_RPC);
    }


    const parentWeb3 = new Web3(parentProvider);
    const childWeb3 = new Web3(childProvider);
    childWeb3.eth.accounts.wallet.add(config.DEPLOY_ADMIN_PRIVATE_KEY);

    const childChainManagerAddress = metaNetwork.Matic.POSContracts.ChildChainManagerProxy;
    const rootChainManagerAddress = metaNetwork.Main.POSContracts.RootChainManagerProxy;
    const rootChainManagerAbi = metaNetwork.abi("RootChainManager", "pos");
    const rootChainManagerContract = new parentWeb3.eth.Contract(
        rootChainManagerAbi,
        rootChainManagerAddress
    );

    // ERC20
    const ERC20ProxyBytecode =
        "0x" + require("../artifacts/POSChildERC20Proxified.json").bytecode;
    const ERC20ProxyAbi =
        require("../artifacts/POSChildERC20Proxified.json").abi;
    const ERC20ProxyContract = new childWeb3.eth.Contract(ERC20ProxyAbi);

    const ERC20Bytecode =
        "0x" + require("../artifacts/POSChildERC20.json").bytecode;
    const ERC20Abi = require("../artifacts/POSChildERC20.json").abi;
    const ERC20Contract = new childWeb3.eth.Contract(ERC20Abi);

    // ERC721
    const ERC721Bytecode =
        "0x" + require("../artifacts/POSChildERC721.json").bytecode;
    const ERC721Abi = require("../artifacts/POSChildERC721.json").abi;
    const ERC721Contract = new childWeb3.eth.Contract(ERC721Abi);

    // ERC1155
    const ERC1155Bytecode =
        "0x" + require("../artifacts/POSChildERC1155.json").bytecode;
    const ERC1155Abi = require("../artifacts/ChildMintableERC1155.json").abi;
    const ERC1155Contract = new childWeb3.eth.Contract(ERC1155Abi);

    // ERC20
    const MintableChildERC20Bytecode =
        "0x" + require("../artifacts/ChildMintableERC20.json").bytecode;
    const MintableChildERC20Abi =
        require("../artifacts/ChildMintableERC20.json").abi;
    const MintableChildERC20Contract = new childWeb3.eth.Contract(
        MintableChildERC20Abi
    );

    // ERC721
    const MintableChildERC721Bytecode =
        "0x" + require("../artifacts/ChildMintableERC721.json").bytecode;
    const MintableChildERC721Abi =
        require("../artifacts/ChildMintableERC721.json").abi;
    const MintableChildERC721Contract = new childWeb3.eth.Contract(
        MintableChildERC721Abi
    );

    // ERC1155
    const MintableChildERC1155Bytecode =
        "0x" + require("../artifacts/ChildMintableERC1155.json").bytecode;
    const MintableChildERC1155Abi =
        require("../artifacts/ChildMintableERC1155.json").abi;
    const MintableChildERC1155Contract = new childWeb3.eth.Contract(
        MintableChildERC1155Abi
    );

    return {
        network,
        parentWeb3,
        childWeb3,
        erc20TokenType,
        erc721TokenType,
        erc1155TokenType,
        mintableErc20TokenType,
        mintableErc721TokenType,
        mintableErc1155TokenType,
        childChainManagerAddress,
        rootChainManagerAddress,
        rootChainManagerAbi,
        rootChainManagerContract,
        ERC20ProxyBytecode,
        ERC20ProxyAbi,
        ERC20ProxyContract,
        ERC20Bytecode,
        ERC20Abi,
        ERC20Contract,
        ERC721Bytecode,
        ERC721Abi,
        ERC721Contract,
        ERC1155Bytecode,
        ERC1155Abi,
        ERC1155Contract,
        MintableChildERC20Bytecode,
        MintableChildERC20Abi,
        MintableChildERC20Contract,
        MintableChildERC721Bytecode,
        MintableChildERC721Abi,
        MintableChildERC721Contract,
        MintableChildERC1155Bytecode,
        MintableChildERC1155Abi,
        MintableChildERC1155Contract,
    };
};
