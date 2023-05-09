
import { contractAddress } from "./contract";
import { tezos } from "./tezos";


export const createPostOperation = async (ipfsurl, imgurl, title, desc, type, goal,deadline) => {
    try {
        const contractInstance = await tezos.wallet.at(contractAddress);
        const op = await contractInstance.methods.create_post(
            ipfsurl,
            deadline,
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

export const contributeOperation = async (id, amt) => {
    try {
        const contractInstance = await tezos.wallet.at(contractAddress);
        const op = await contractInstance.methods.contribute(
            id
        ).send({
            amount: amt,
            mutez: false,
        }
        );
        await op.confirmation(1);
    } catch (err) {
        throw err;
    }
};

export const withdrawOperation = async (id, amt) => {
    try {
        const contractInstance = await tezos.wallet.at(contractAddress);
        const op = await contractInstance.methods.withdraw(
            amt*1000000,
            id,

        ).send();
        await op.confirmation(1);
    } catch (err) {
        throw err;
    }
};





