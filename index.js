import { Web3 } from "web3";
import chalk from "chalk";
import PromptSync from "prompt-sync";

const prompt = PromptSync();

// ==================================================
const account = {
    "refreshToken": "AMfxxxxxxxxxxxxxxxxxxxx", // ISI DISINI
    "privateKey": "0xxxxxxxxxxxxxxxxxxxxxx" // ISI DISINI
}
// ==================================================

const getToken = async (refToken) => {
    const url = 'https://securetoken.googleapis.com/v1/token?key=AIzaSyDipzN0VRfTPnMGhQ5PSzO27Cxm3DohJGY'

    const headers = { 
        'accept': '*/*', 
        'accept-language': 'en,en-US;q=0.9,id;q=0.8', 
        'content-type': 'application/x-www-form-urlencoded', 
        'dnt': '1', 
        'origin': 'https://hanafuda.hana.network', 
        'priority': 'u=1, i', 
        'referer': 'https://hanafuda.hana.network/', 
        'sec-ch-ua': '"Chromium";v="134", "Not:A-Brand";v="24", "Google Chrome";v="134"', 
        'sec-ch-ua-mobile': '?0', 
        'sec-ch-ua-platform': '"Windows"', 
        'sec-fetch-dest': 'empty', 
        'sec-fetch-mode': 'cors', 
        'sec-fetch-site': 'cross-site', 
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36'
    }

    const payload = `grant_type=refresh_token&refresh_token=${refToken}`

    while(true) {
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: headers,
                body: payload
            })
            
            if(!response.ok) {
                throw new Error(`${response.status} ${response.statusText}`)
            }
    
            return await response.json()
        } catch (err) {
            console.log(chalk.red(`❌ Error get token: ${err.message}`));
            await new Promise(resolve => setTimeout(resolve, 2000)) // blocking/pause for 2 seconds
        }
    }
}

const getUser = async (token) => {
    const url = 'https://hanafuda-backend-app-520478841386.us-central1.run.app/graphql'

    const headers = {
        'accept': 'application/graphql-response+json, application/json',
        'accept-language': 'en,en-US;q=0.9,id;q=0.8',
        'authorization': `Bearer ${token}`,
        'content-type': 'application/json',
        'dnt': '1',
        'origin': 'https://hanafuda.hana.network',
        'priority': 'u=1, i',
        'referer': 'https://hanafuda.hana.network/',
        'sec-ch-ua': '"Chromium";v="134", "Not:A-Brand";v="24", "Google Chrome";v="134"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'cross-site',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36'
    }

    const payload = JSON.stringify({
        query: `query CurrentUserStatus {
            currentUser {
                depositCount
                totalPoint
                evmAddress {
                    userId
                    address
                }
                inviter {
                    id
                    name
                }
            }
        }`,
        variables: {}
    })

    while(true) {
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: headers,
                body: payload
            })
    
            if(!response.ok) {
                throw new Error(`${response.status} ${response.statusText}`)
            }
    
            return await response.json()
        } catch (err) {
            console.log(chalk.red(`❌ Error getting user: ${err.message}`));
            await new Promise(resolve => setTimeout(resolve, 2000)) // blocking/pause for 2 seconds
        }
    }
}

const syncTx = async (token, chainId, txHash) => {
    const url = 'https://hanafuda-backend-app-520478841386.us-central1.run.app/graphql'

    const headers = {
        'accept': 'application/graphql-response+json, application/json',
        'accept-language': 'en,en-US;q=0.9,id;q=0.8',
        'authorization': `Bearer ${token}`,
        'content-type': 'application/json',
        'dnt': '1',
        'origin': 'https://hanafuda.hana.network',
        'priority': 'u=1, i',
        'referer': 'https://hanafuda.hana.network/',
        'sec-ch-ua': '"Chromium";v="134", "Not:A-Brand";v="24", "Google Chrome";v="134"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'cross-site',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36'
    }

    
    const payload = JSON.stringify({
        query: `mutation SyncEthereumTx($chainId: Int!, $txHash: String!) {
            syncEthereumTx(chainId: $chainId, txHash: $txHash)
        }`,
        variables: {
            "chainId":chainId,
            "txHash":txHash
        }
    })

    while(true) {
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: headers,
                body: payload
            })
    
            if(!response.ok) {
                throw new Error(`${response.status} ${response.statusText}`)
            }
    
            return await response.json()
        } catch (err) {
            console.log(chalk.red(`❌ Error getting sync the transaction, ${err.message}`));
            await new Promise(resolve => setTimeout(resolve, 2000)) // blocking/pause for 2 seconds
        }
    }
}

(async () => {
    let rpc_url = ""
    let currency_symbol = ""
    let sc_address = ""
    let data = ""
    let block_explorer = ""

    console.log(`🌼 Hanafuda Auto Deposit Bot 🌼\n`)

    console.log(`[1] Polygon\n[2] Base\n[3] OP Mainnet\n[4] Exit`)
    let pilihan = prompt('↪ Masukkan pilihan anda: ')

    if (pilihan == 1) {
        rpc_url = "https://polygon-rpc.com"
        currency_symbol = "POL"
        sc_address = "0xc5bf05cd32a14bffb705fb37a9d218895187376c" // SC Hana Polygon
        data = "0xf6326fb3" // Data depositETH()
        block_explorer = "https://polygonscan.com"
    } else if (pilihan == 2) {
        rpc_url = "https://base-rpc.publicnode.com"
        currency_symbol = "ETH"
        sc_address = "0xc5bf05cd32a14bffb705fb37a9d218895187376c" // SC Hana Base
        data = "0xf6326fb3" // Data depositETH()
        block_explorer = "https://basescan.org"
    } else if (pilihan == 3) {
        rpc_url = "https://mainnet.optimism.io"
        currency_symbol = "ETH"
        sc_address = "0xc5bf05cd32a14bffb705fb37a9d218895187376c" // SC Hana Base
        data = "0xf6326fb3" // Data depositETH()
        block_explorer = "https://optimistic.etherscan.io"
    } else if (pilihan == 4) {
        console.log(chalk.red('❌ Anda Keluar!'))
        process.exit()
    } else {
        console.log(chalk.red('❌ Tidak tersedia')) 
        process.exit()
    }

    let amount = prompt(`↪ Amount deposit per transaksi (e.g. 0.00000001) ${currency_symbol}: `)
    if (amount > 0 && amount < 9999999) {
        console.log()
        amount = amount
    } else {
        console.log(chalk.red('❌ Amount deposit invalid')) 
        process.exit()
    }

    // connect to RPC
    while(true) {
        try {
            const web3 = new Web3(rpc_url)
            const chainId = web3.utils.toNumber(await web3.eth.getChainId())
    
            while(true) {
                // get token hanafuda
                const tokens = await getToken(account.refreshToken)
                const token = tokens.access_token
        
                // setupwallet
                const user = web3.eth.accounts.privateKeyToAccount(account.privateKey);
                const balanceAcc = await web3.eth.getBalance(user.address)
                const saldo = web3.utils.fromWei(balanceAcc, 'ether')
        
                // get infouser
                const info = await getUser(token) 
                const poinuser = info.data.currentUser.totalPoint
                const numberdeposit = info.data.currentUser.depositCount
                
                // print
                console.log(`🔑 EVM address: ${chalk.green(`${String(user.address).slice(0,0)}XXXXX`)}\n💵 Saldo: ${chalk.yellow(`${saldo} ${currency_symbol}`)}\n🏦 Jumlah deposit: ${chalk.yellow(numberdeposit)}`)
        
                // deposit
                try {
                    // estimasi gas dari address dengan sc dengan data dan value
                    const estGas = await web3.eth.estimateGas({
                        form: user.address,
                        to: sc_address,
                        value: web3.utils.toWei(`${amount}`, 'ether'),
                        data: data
                    })
        
                    // get gas price
                    const gasPrice = await web3.eth.getGasPrice()
                    const estTxFee = web3.utils.fromWei(estGas, 'Gwei')*web3.utils.fromWei(gasPrice, "Gwei")
        
                    if (estTxFee <= Number(saldo) && Number(saldo) >= amount) {
                        console.log("✅ Saldo mencukupi, transaksi diproses...")
                        console.log(`🔥 Sedang melakukan deposit ${chalk.yellow(`${amount} ${currency_symbol}`)}`)
        
                        // get fee data terkini
                        const feeData = await web3.eth.calculateFeeData();
        
                        // raw tx
                        const transaction = {
                            from: user.address,
                            to: sc_address,
                            value: web3.utils.toWei(`${amount}`, 'ether'),
                            gasprice: estGas,
                            maxFeePerGas: feeData.maxFeePerGas,
                            maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
                            nonce: await web3.eth.getTransactionCount(user.address),
                            data: data
                        };
                        
                        // sign tx
                        const signedTransaction = await web3.eth.accounts.signTransaction(
                            transaction,
                            account.privateKey,
                        );
                        
                        // send sign tx
                        const receipt = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);
                        console.log(`🧾 Transaction hash: ${chalk.green(`${block_explorer}/tx/${receipt.transactionHash}`)}`);
                        console.log(`💸 Transaction fee: ${chalk.yellow(`${web3.utils.fromWei(receipt.effectiveGasPrice*receipt.gasUsed, 'ether')} ${currency_symbol}`)}`)
                        
                        // sinkronisasi
                        console.log("🔄 Sinkronisasi transaksi...")
                        const sync = await syncTx(token, chainId,receipt.transactionHash)
                        let statustx = (sync.data?.syncEthereumTx == true) ? chalk.green('✅') : chalk.red('❌')
                        console.log(`📢 Status sinkronisasi: ${statustx}`)
        
                        // Print hash
                        process.stdout.write(`\n⏳ Delay 10 detik`);
                        await new Promise(resolve => setTimeout(resolve, 10000)) // Delay 10 detik
                        process.stdout.clearLine();
                        process.stdout.cursorTo(0);
                    } else {
                        console.log(`${chalk.red(`❌ Saldo tidak mencukupi, silakan isi terlebih dahulu!`)}`)
                        process.exit()
                    }
                } catch (err) {
                    console.log(chalk.red(`❌ Error to send TX: ${err.message}\n`));
                }
            }
        } catch (err) {
            console.log(`${chalk.red('❌ Gagal terkoneksi ke RPC, mencoba lagi...')}`)
            await new Promise(resolve => setTimeout(resolve, 2000)) // blocking/pause for 2 seconds
        }
    }
})();

/*
1. RPC
2. Currency
3. Smart contract
4. Data
5. Amount (input)
5. Block explorer
*/

// // get RPC info
// await web3.eth.getBlockNumber().then((blocknum) => console.log("Block number:", blocknum)).catch(err => console.log(err));
// await web3.eth.getChainId().then((chainId) => console.log(`Chain Id:`, chainId)).catch(err => console.log(err));
// await web3.eth.getGasPrice().then((gasprice) => console.log("Gas price:", web3.utils.fromWei(gasprice, 'Gwei'))).catch(err => console.log(err));

// // get address balance
// await web3.eth.getBalance('0xxxx').then((bal) => console.log(`Balance: ${Number(web3.utils.fromWei(bal, 'ether'))} POL`));
// // get address nonce/total tx
// await web3.eth.getTransactionCount('0xxx').then((totalTx) => console.log(`Total TX: ${web3.utils.toNumber(totalTx)}`))

// // the private key must start with the "0x" prefix
// const account = web3.eth.accounts.privateKeyToAccount('0xxx');
// // console.log(account.address);
// // console.log(account.privateKey);

// // you can find the complete ABI on etherscan.io
// const ABI = [
//     { 
//         "inputs": [], 
//         "name": "depositETH", 
//         "outputs": [], 
//         "payable": true, 
//         "stateMutability": "payable", 
//         "type": "function" 
//     }
// ]

// // instantiate the smart contract
// const hanaContract = new web3.eth.Contract(ABI, address);