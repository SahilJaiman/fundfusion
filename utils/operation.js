
import { contractAddress } from "./contract";
import { tezos } from "./tezos";


export const  createPostOperation = async (ipfsurl,imgurl,title,type,goal) => {
    try {
        const contractInstance = await tezos.wallet.at(contractAddress);
        const op = await contractInstance.methods.create_post(
            type,
            goal * 1000000,
            ipfsurl,
            imgurl,
            title,         
        ).send();
        await op.confirmation(1);
    } catch (err) {
        throw err;
    }
};



export const placeBetOperation = async (id,team,amt ) => {
    try {
        const contractInstance = await tezos.wallet.at(contractAddress);
        const op = await contractInstance.methods.placeBet(
                team,
                id
        ).send({
            amount: amt,
            mutez:false,
        });
        await op.confirmation(1);
    } catch (err) {
        throw err;
    }
};


