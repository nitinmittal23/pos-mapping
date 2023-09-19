import { deployERC20 } from "./deploy/erc20";
import { deployERC721 } from "./deploy/erc721";
import { deployERC1155 } from "./deploy/erc1155";

const deployChildToken = async () => {
    try {
        const mapping = {
            // Token address on ethereum
            root_token: "0x51f7f8e6af78d2a11c56b9ee1685deabc3fdc769",
            // Token name only used for ERC20 and ERC721, add '(PoS)' in the end
            name: 'BLUEBERRY (PoS)',
            // Token symbol only used for ERC20 and ERC721
            symbol: 'BLBR',
            // Token decimal only for ERC20
            decimals: 18,
            // Token URI only for ERC1155
            uri: 'polygon.technology',
            // Network on which token needs to be deployed - 'mainnet' or 'testnet'
            network: "testnet",
            // Token is either mintable or nonmintable, can be true or false
            mintable: true,
            // token type can be 'erc20', 'erc721', 'erc1155' -  all small cases
            type: 'erc1155'
        }

        if (mapping.type === 'erc20') {
            return await deployERC20(mapping);
        } else if (mapping.type === 'erc721') {
            return await deployERC721(mapping);
        } else if (mapping.type === 'erc1155') {
            return await deployERC1155(mapping);
        } else {
            console.log("invalid token type");
            return;
        }
    } catch (error) {
        console.log("error in deploying contract", error)
    }
}

deployChildToken();
