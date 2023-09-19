const config = require("../config/config");
const { getPoSMeta } = require("./meta");

// Get PoS child token
const getPoSChildToken = async (root_token, meta) => {
    const child = await meta.rootChainManagerContract.methods
        .rootToChildToken(root_token)
        .call();
    return child;
}

const revokeRoleOnPoSChild = async (abi, address, meta) => {
    console.log("3. revoking role");
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
            maxPriorityFeePerGas: config.GAS.GAS_PRICE,
        });
    console.log("4. role revoked");
}

// ERC1155 PoS
const deployPoSERC1155 = async (token, meta) => {
    console.log("1. deploying");
    const uri = token.uri ? token.uri : "";
    const ERC1155 = await meta.ERC1155Contract.deploy({
        data: meta.ERC1155Bytecode,
        arguments: [uri, meta.childChainManagerAddress],
    }).send({
        from: config.DEPLOY_ADMIN_ADDRESS,
        gas: config.GAS.DEPLOYMENT_GAS,
        maxPriorityFeePerGas: config.GAS.GAS_PRICE,
    });
    console.log("2. deployed ERC1155: ", ERC1155.options.address);
    return ERC1155.options.address;
}

// Mintable ERC1155
const deployChildMintableERC1155 = async (token, meta) => {
    console.log("1. deploying");
    const uri = token.uri ? token.uri : "";
    const ERC1155 = await meta.MintableChildERC1155Contract.deploy({
        data: meta.MintableChildERC1155Bytecode,
        arguments: [uri, meta.childChainManagerAddress],
    }).send({
        from: config.DEPLOY_ADMIN_ADDRESS,
        gas: config.GAS.DEPLOYMENT_GAS,
        maxPriorityFeePerGas: config.GAS.GAS_PRICE,
    });
    console.log("2. deployed Mintable ERC1155: ", ERC1155.options.address);

    return ERC1155.options.address;
}


export const deployERC1155 = async (mapping) => {
    console.log("Start deploy");
    const meta = getPoSMeta(mapping.network);

    // Check if token is already mapped or not
    const child = await getPoSChildToken(mapping.root_token, meta);
    console.log("Get child token ", child);

    if (child === '0x0000000000000000000000000000000000000000') {

        if (mapping.mintable) {
            const deployedToken = await deployChildMintableERC1155(mapping, meta);
            await new Promise(r => setTimeout(r, 5000));
            await revokeRoleOnPoSChild(meta.MintableChildERC1155Abi, deployedToken, meta);
            mapping = {
                ...mapping,
                child_Token: deployedToken,
                token_type: meta.mintableErc1155TokenType
            }
        } else {
            const deployedToken = await deployPoSERC1155(mapping, meta);
            await new Promise(r => setTimeout(r, 5000));
            await revokeRoleOnPoSChild(meta.ERC1155Abi, deployedToken, meta);
            mapping = {
                ...mapping,
                child_Token: deployedToken,
                token_type: meta.erc1155TokenType
            }
        }

        console.log("final Mapping details", mapping);
        return mapping;

    } else {
        console.log("token already mapped to child", child);
        return;
    }
}

