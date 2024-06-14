// import { NetworkProvider } from '@ton/blueprint';
// import { Address, toNano } from '@ton/core';
// import { NftCollection } from '../wrappers/NftCollection';
// import { NftItem } from "../wrappers/NftItem";
// import { Cell } from '@ton/core';

// const randomSeed= Math.floor(Math.random() * 10000);
// import { SmartContract } from "ton-contract-executor";
// import { debug } from 'console';


// export async function run(provider : NetworkProvider, args: string[] ) {
//     // const ui = provider.ui();

//     // const address = Address.parse(args.length > 0 ? args[0] : await ui.input('NFT address'));

//     // const nftItem = provider.open(NftItem.createFromAddress(address));

//     const hex = "b5ee9c7241020e010001dc000114ff00f4a413f4bcf2c80b01020162020d0202ce030a020120040902cf0c8871c02497c0f83434c0c05c6c2497c0f83e903e900c7e800c5c75c87e800c7e800c1cea6d003c00812ce3850c1b088d148cb1c17cb865407e90350c0408fc00f801b4c7f4cfe08417f30f45148c2eb8c08c0d0d0d4d60840bf2c9a884aeb8c097c12103fcbc20050802ac3210375e3240135135c705f2e191fa4021f001fa40d20031fa0020d749c200f2e2c4820afaf0801ba121945315a0a1de22d70b01c300209206a19136e220c2fff2e1922194102a375be30d0293303234e30d5502f0030607007c821005138d91c85009cf16500bcf16712449145446a0708010c8cb055007cf165005fa0215cb6a12cb1fcb3f226eb39458cf17019132e201c901fb001047006a26f0018210d53276db103744006d71708010c8cb055007cf165005fa0215cb6a12cb1fcb3f226eb39458cf17019132e201c901fb0000727082108b77173505c8cbff5004cf1610248040708010c8cb055007cf165005fa0215cb6a12cb1fcb3f226eb39458cf17019132e201c901fb0000113e910c1c2ebcb853600201200b0c003b3b513434cffe900835d27080269fc07e90350c04090408f80c1c165b5b60001d00f232cfd633c58073c5b3327b55200009a11f9fe00511f236fc"
//     const codeCell = Cell.fromBoc(Buffer.from(hex, "hex"))[0];
//     const dataCell = new Cell()

//     const stateInit = {
//         code: codeCell,
//        data: dataCell
//     }

//     const nftItem = await SmartContract.fromFuncSource( codeCell ,dataCell, {debug: true});

//     const buy = await nftItem.sendNftItem(provider.sender(), {
//         value: toNano('0.01'),
//         queryId: randomSeed,
//         newOwner : provider.sender().address!!
//     })

//     // ui.write(`NFT Item deployed at https://testnet.tonscan.org/address/${nftItem.address}`);
// }


import { Address, toNano } from '@ton/core';
// import { NftDapp } from '../wrappers/NftDapp';
import { NetworkProvider } from '@ton/blueprint';
// import { randomAddress } from '@ton-community/test-utils';
import { NftCollection } from '../wrappers/NftCollection';

export async function run(provider: NetworkProvider, args: string[]) {
    const ui = provider.ui();

    const address = Address.parse(args.length > 0 ? args[0] : await ui.input('Dapp address'));

    const Newaddress = "0QA-FzMaA-57X_OFltGAToORRJweN39pek0jrKYuuQ966JFd";

    const nftDapp = provider.open(NftCollection.createFromAddress(address));

        await nftDapp.sendTransferItemMsg(provider.sender(), {
            fwdAmount: toNano('1.1'),
            queryId: Date.now(),
            newOwner: Address.parse(Newaddress),
            responseAddress: provider.sender().address as Address,
            itemAddress: Address.parse("EQCkHLEJVpuAwZg0d9HzLgCp8QioXbEBGtv3EX88H-Bz9wzv")
        });

    ui.write('Transfered successfully!');
}