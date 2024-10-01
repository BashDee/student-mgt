const express = require('express');
const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

async function main() {
    const ccpPath = path.resolve(__dirname, '../backend/fabric-network/connection.json');
    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

    const caURL = ccp.certificateAuthorities['ca.org1.example.com'].url;
    const ca = new FabricCAServices(caURL);

    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    const userIdentity = await wallet.get('user1');
    if (userIdentity) {
        console.log('An identity for the user "user1" already exists in the wallet');
        return;
    }

    const enrollment = await ca.enroll({ enrollmentID: 'user1', enrollmentSecret: 'user1pw' });
    const x509Identity = {
        credentials: {
            certificate: enrollment.certificate,
            privateKey: enrollment.key.toBytes(),
        },
        mspId: 'Org1MSP',
        type: 'X.509',
    };
    await wallet.put('user1', x509Identity);
    console.log('Successfully enrolled user "user1" and imported it into the wallet');
}


app.get('/query', async (req, res) => {
    try {
        const ccpPath = path.resolve(__dirname, '../backend/fabric-network/connection.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);

        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'student', discovery: { enabled: true, asLocalhost: true } });

        const network = await gateway.getNetwork('mychannel');
        const contract = network.getContract('studentcc');

        const result = await contract.evaluateTransaction('QueryStudent', '123');
        res.send(`Transaction has been evaluated, result is: ${result.toString()}`);

        await gateway.disconnect();
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        res.status(500).send(`Failed to evaluate transaction: ${error}`);
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
