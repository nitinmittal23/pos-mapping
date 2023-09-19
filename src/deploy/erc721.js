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

// Deploy POS ERC721
const deployPoSERC721 = async (token, meta) => {
    console.log("1. deploying");
    const ERC721 = await meta.ERC721Contract.deploy({
        data: meta.ERC721Bytecode,
        arguments: [token.name, token.symbol, meta.childChainManagerAddress],
    }).send({
        from: config.DEPLOY_ADMIN_ADDRESS,
        gas: config.GAS.DEPLOYMENT_GAS,
        maxPriorityFeePerGas: config.GAS.GAS_PRICE,
    });
    console.log("2. deployed ERC721: ", ERC721.options.address);
    return ERC721.options.address;
}

// Mintable ERC721
const deployChildMintableERC721 = async (token, meta) => {
    console.log("1. deploying");
    const ERC721 = await meta.MintableChildERC721Contract.deploy({
        data: meta.MintableChildERC721Bytecode,
        arguments: [token.name, token.symbol, meta.childChainManagerAddress],
    }).send({
        from: config.DEPLOY_ADMIN_ADDRESS,
        gas: config.GAS.DEPLOYMENT_GAS,
        maxPriorityFeePerGas: config.GAS.GAS_PRICE,
    });
    console.log("2. deployed Mintable ERC721: ", ERC721.options.address);

    return ERC721.options.address;
}

export const deployERC721 = async (mapping) => {
    console.log("Start deploy");
    const meta = getPoSMeta(mapping.network);

    // Check if token is already mapped or not
    const child = await getPoSChildToken(mapping.root_token, meta);
    console.log("Get child token ", child);

    if (child === '0x0000000000000000000000000000000000000000') {

        if (mapping.mintable) {
            const deployedToken = await deployChildMintableERC721(mapping, meta);
            await new Promise(r => setTimeout(r, 5000));
            await revokeRoleOnPoSChild(meta.MintableChildERC721Abi, deployedToken, meta);
            mapping = {
                ...mapping,
                child_Token: deployedToken,
                token_type: meta.mintableErc721TokenType
            }
        } else {
            const deployedToken = await deployPoSERC721(mapping, meta);
            await new Promise(r => setTimeout(r, 5000));
            await revokeRoleOnPoSChild(meta.ERC721Abi, deployedToken, meta);
            mapping = {
                ...mapping,
                child_Token: deployedToken,
                token_type: meta.erc721TokenType
            }
        }

        console.log("final Mapping details", mapping);
        return mapping;

    } else {
        console.log("token already mapped to child", child);
        return;
    }
}
