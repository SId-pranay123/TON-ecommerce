import { 
    Address, 
    beginCell, 
    Cell, 
    Contract, 
    contractAddress, 
    ContractProvider, 
    Sender, 
    SendMode,
    TupleItemInt, 
} from '@ton/core';
import { OpCodes } from './utils/opCodes';

export type NftItemConfig = {
    index: number;
    collectionAddress: Address;
    ownerAddress: Address;
    content: Cell;
};


export function nftItemConfigToCell(config: NftItemConfig): Cell {
    return beginCell()
        .storeUint(config.index, 64)
        .storeAddress(config.collectionAddress)
        .storeAddress(config.ownerAddress)
        .storeRef(config.content)
    .endCell();
}


export class NftItem implements Contract{
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new NftItem(address);
    }

    static createFromConfig(config: NftItemConfig, code: Cell, workchain = 0) {
        const data = nftItemConfigToCell(config);
        const init = { code, data };
        return new NftItem(contractAddress(workchain, init), init);
    }


    async sendNftItem(provider: ContractProvider, via: Sender, 
        opts: {
            value: bigint ;
            queryId: number ;
            newOwner : Address ;
        }) 
        {
            await provider.internal(via, {
                value: opts.value,
                sendMode: SendMode.PAY_GAS_SEPARATELY,
                body: beginCell()
                    .storeUint(OpCodes.transferItem, 32)
                    .storeUint(opts.queryId, 64)
                    .storeAddress(opts.newOwner)
                    .endCell()
    
        });
    }
}


// import { 
//     Address, 
//     beginCell, 
//     Cell, 
//     Contract, 
//     contractAddress, 
//     ContractProvider, 
//     Sender, 
//     SendMode,
//     TupleItemInt 
// } from '@ton/core';

// export type NftItemConfig = {
//     index: bigint;
//     collectionAddress: Address;
//     ownerAddress: Address;
//     content: Cell;
// };

// export function nftItemConfigToCell(config: NftItemConfig): Cell {
//     return beginCell()
//         .storeUint(config.index, 64)
//         .storeAddress(config.collectionAddress)
//         .storeAddress(config.ownerAddress)
//         .storeRef(config.content)
//     .endCell();
// }

// export class NftItem implements Contract {
//     constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

//     static createFromAddress(address: Address) {
//         return new NftItem(address);
//     }

//     static createFromConfig(config: NftItemConfig, code: Cell, workchain = 0) {
//         const data = nftItemConfigToCell(config);
//         const init = { code, data };
//         return new NftItem(contractAddress(workchain, init), init);
//     }

//     async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
//         await provider.internal(via, {
//             value,
//             sendMode: SendMode.PAY_GAS_SEPARATELY,
//             body: beginCell().endCell(),
//         });
//     }

//     async sendTransfer(provider: ContractProvider, via: Sender, opts: {
//         value: bigint;
//         queryId: number;
//         newOwnerAddress: Address;
//         responseDestination: Address;
//         forwardAmount: bigint;
//     }) {
//         const transferMessage = beginCell();
//         transferMessage.storeAddress(opts.newOwnerAddress)
//         transferMessage.storeAddress(opts.responseDestination)
//         transferMessage.storeInt(0, 1) // custom_payload, always 0
//         transferMessage.storeCoins(opts.forwardAmount);

//         await provider.internal(via, {
//             value: opts.value,
//             sendMode: SendMode.PAY_GAS_SEPARATELY,
//             body: beginCell()
//                 .storeUint(0x18, 6)
//                 .storeUint(1, 32) // operation
//                 .storeUint(opts.queryId, 64)
//                 .storeRef(transferMessage) // body
//             .endCell()
//         });
//     }

//     async getStaticData(provider: ContractProvider): Promise<{
//         index: bigint;
//         collectionAddress: Address;
//     }> {
//         const staticData = await provider.get('get_static_data', []);
//         const stack = staticData.stack;
//         const index = stack.readBigNumber();
//         const collectionAddress = stack.readAddress();
//         return {
//             index,
//             collectionAddress
//         };
//     }

//     async getNftData(provider: ContractProvider): Promise<{
//         initialized: boolean;
//         index: bigint;
//         collectionAddress: Address;
//         ownerAddress: Address;
//         content: Cell;
//     }> {
//         const nftData = await provider.get('get_nft_data', []);
//         const stack = nftData.stack;
//         const initialized = stack.readBoolean();
//         const index = stack.readBigNumber();
//         const collectionAddress = stack.readAddress();
//         const ownerAddress = stack.readAddress();
//         const content = stack.readCell();
//         return {
//             initialized,
//             index,
//             collectionAddress,
//             ownerAddress,
//             content
//         };
//     }
// }