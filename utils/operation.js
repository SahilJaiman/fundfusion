
import { contractAddress } from "./contract";
import { tezos } from "./tezos";


export const createPostOperation = async (ipfsurl,imgurl,title,desc,type,goal) => {
    try {
        const contractInstance = await tezos.wallet.at(contractAddress);
        const op = await contractInstance.methods.create_post(
            ipfsurl,
            desc,
            goal * 1000000,
            imgurl,
            title,
            type,
        ).send();
        await op.confirmation(1);
    } catch (err) {
        throw err;
    }
};






