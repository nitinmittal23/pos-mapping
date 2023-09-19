const config = require("../config/config");
const { getPoSMeta } = require("./meta");

// Fucntion to get the child token from root chain manager proxy contract
const getPoSChildToken = async (root_token, meta) => {
    const child = await meta.rootChainManagerContract.methods
        .rootToChildToken(root_token)
        .call();
    return child;
}

// NonMintable ERC20
const deployPoSERC20 = async (token, meta) => {
    console.log("1. Deploying Implementation contract")
    const ERC20 = await meta.ERC20Contract.deploy({
        data: meta.ERC20Bytecode,
    }).send({
        from: config.DEPLOY_ADMIN_ADDRESS,
        gas: config.GAS.DEPLOYMENT_GAS,
        maxPriorityFeePerGas: config.GAS.GAS_PRICE
    }).on('transactionHash', transactionHash => { console.log(transactionHash) })

    console.log("2. Deployed Implementation Contract ", ERC20.options.address)
    await new Promise(r => setTimeout(r, 5000));

    console.log("3. Deploying Proxy contract")
    const ERC20Proxy = await meta.ERC20ProxyContract.deploy({
        data: meta.ERC20ProxyBytecode,
        arguments: [ERC20.options.address],
    }).send({
        from: config.DEPLOY_ADMIN_ADDRESS,
        gas: config.GAS.DEPLOYMENT_GAS,
        maxPriorityFeePerGas: config.GAS.GAS_PRICE
    });
    console.log("4. Deployed proxy", ERC20Proxy.options.address);

    const ERC20Upgradable = await new meta.childWeb3.eth.Contract(
        meta.ERC20Abi,
        ERC20Proxy.options.address
    );

    await new Promise(r => setTimeout(r, 5000));
    console.log("5. Initializing contract")

    await ERC20Upgradable.methods
        .initialize(
            token.name,
            token.symbol,
            token.decimals,
            meta.childChainManagerAddress
        )
        .send({
            from: config.DEPLOY_ADMIN_ADDRESS,
            gas: config.GAS.GAS,
            maxPriorityFeePerGas: config.GAS.GAS_PRICE
        });
    console.log("6. initialized");

    return [ERC20.options.address, ERC20Proxy.options.address];
}

// Mintable ERC20
const deployChildMintableERC20 = async (token, meta) => {
    console.log("1. Deploying")
    const ERC20 = await meta.MintableChildERC20Contract.deploy({
        data: meta.MintableChildERC20Bytecode,
        arguments: [
            token.name,
            token.symbol,
            token.decimals,
            meta.childChainManagerAddress,
        ],
    }).send({
        from: config.DEPLOY_ADMIN_ADDRESS,
        gas: config.GAS.DEPLOYMENT_GAS,
        maxPriorityFeePerGas: config.GAS.GAS_PRICE
    });
    console.log("2. deployed MintableERC20: ", ERC20.options.address);

    return ERC20.options.address;
}

const transferOwnershipOnPoSRoot = async (child_address, meta) => {
    console.log("7. changing Ownership to multisig Account");
    let address = null;
    if (meta.network === 'mainnet') {
        address = config.CHILDCHAIN_MAINNET_GNOSIS_SAFE_ADDRESS;
    } else {
        address = config.JD_ADDRESS;
    }

    const ERC20Upgradable = await new meta.childWeb3.eth.Contract(
        meta.ERC20ProxyAbi,
        child_address
    );

    await ERC20Upgradable.methods.transferProxyOwnership(address).send({
        from: config.DEPLOY_ADMIN_ADDRESS,
        gas: config.GAS.GAS,
        maxPriorityFeePerGas: config.GAS.GAS_PRICE
    });
    console.log("8. Ownership Transferred");
}

const revokeRoleOnPoSChild = async (abi, address, meta) => {
    console.log("9. revoking role");
    const ERC20Contract = await new meta.childWeb3.eth.Contract(
        abi,
        address
    );

    await ERC20Contract.methods
        .revokeRole(
            "0x0000000000000000000000000000000000000000000000000000000000000000",
            config.DEPLOY_ADMIN_ADDRESS
        )
        .send({
            from: config.DEPLOY_ADMIN_ADDRESS,
            gas: config.GAS.GAS,
            maxPriorityFeePerGas: config.GAS.GAS_PRICE
        });
    console.log("10. role revoked");
}

export const deployERC20 = async (mapping) => {
    console.log("Start deploy");
    const meta = getPoSMeta(mapping.network);

    // Check if token is already mapped or not
    const child = await getPoSChildToken(mapping.root_token, meta);
    console.log("Get child token ", child);

    if (child === '0x0000000000000000000000000000000000000000') {

        if (mapping.mintable) {
            const deployedToken = await deployChildMintableERC20(mapping, meta);
            console.log("3, 4, 5, 6, 7, 8 steps not required")
            await new Promise(r => setTimeout(r, 5000));
            await revokeRoleOnPoSChild(meta.MintableChildERC20Abi, deployedToken, meta);
            mapping = {
                ...mapping,
                child_Token: deployedToken,
                token_type: meta.mintableErc20TokenType
            }
        } else {
            const [implementation, proxy] = await deployPoSERC20(mapping, meta);
            await new Promise(r => setTimeout(r, 5000));
            await transferOwnershipOnPoSRoot(proxy, meta);
            await new Promise(r => setTimeout(r, 5000));
            await revokeRoleOnPoSChild(meta.ERC20Abi, proxy, meta);
            mapping = {
                ...mapping,
                implementation,
                child_Token: proxy,
                token_type: meta.erc20TokenType
            }
        }

        console.log("final Mapping details", mapping);
        return mapping;

    } else {
        console.log("token already mapped to child", child);
        return;
    }
}
