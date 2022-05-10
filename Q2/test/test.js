const { expect } = require("chai");
const { ethers } = require("hardhat");
const fs = require("fs");
const { groth16, plonk } = require("snarkjs");

function unstringifyBigInts(o) {
    if ((typeof (o) == "string") && (/^[0-9]+$/.test(o))) {
        return BigInt(o);
    } else if ((typeof (o) == "string") && (/^0x[0-9a-fA-F]+$/.test(o))) {
        return BigInt(o);
    } else if (Array.isArray(o)) {
        return o.map(unstringifyBigInts);
    } else if (typeof o == "object") {
        if (o === null) return null;
        const res = {};
        const keys = Object.keys(o);
        keys.forEach((k) => {
            res[k] = unstringifyBigInts(o[k]);
        });
        return res;
    } else {
        return o;
    }
}

describe("HelloWorld", function () {
    let Verifier;
    let verifier;

    beforeEach(async function () {
        // A ContractFactory is an abstraction used to
        // deploy our new smart contract "HelloWorldVerifier"
        Verifier = await ethers.getContractFactory("HelloWorldVerifier");
        // Calling deploy() starts the deployment
        verifier = await Verifier.deploy();
        await verifier.deployed();
    });

    it("Should return true for correct proof", async function () {
        //[assignment] Add comments to explain what each line is doing

        // The fullProve function takes in the path to the input.json, wasm code and the final zkey
        // It returns two outputs: proof and publicsignals
        // proof returns an object with the keys of the input.json data, the protocol(groth16) and curve(bn128)
        // publicSignals returns the witness, thus the final results
        const { proof, publicSignals } = await groth16.fullProve({ "a": "1", "b": "2" }, "contracts/circuits/HelloWorld/HelloWorld_js/HelloWorld.wasm", "contracts/circuits/HelloWorld/circuit_final.zkey");

        // print the final results(output)
        console.log('1x2 =', publicSignals[0]);

        // convert publicSignals into BigInt by appending "n"
        const editedPublicSignals = unstringifyBigInts(publicSignals);
        // convert proof into BigInt by appending "n"
        const editedProof = unstringifyBigInts(proof);

        // calldata takes in the results of the BigInt form of proof and publicSignals
        // It returns an array of hexadecimals
        const calldata = await groth16.exportSolidityCallData(editedProof, editedPublicSignals);

        // The calldata.replace function converts the results of calldata(hexadecimals) back to the 
        // form in line "46", proof and publicSignals
        // It returns an array of the proof and publicSignals(the last of the array, which is the output)
        const argv = calldata.replace(/["[\]\s]/g, "").split(',').map(x => BigInt(x).toString());

        // get the first 2 data(values) of the array in argv
        const a = [argv[0], argv[1]];
        // get the next four data(values) after array of index 1
        const b = [[argv[2], argv[3]], [argv[4], argv[5]]];
        // get the next two data(values) after array of index 5
        const c = [argv[6], argv[7]];
        // get the last data(values) in the array of argv
        const Input = argv.slice(8);

        // returns a boolean, true if the check is correct
        // the verifier should return "it's ok, thus true"
        expect(await verifier.verifyProof(a, b, c, Input)).to.be.true;
    });
    it("Should return false for invalid proof", async function () {
        // create our own array(thus our results for proof and publicSignals) to do the check

        // first two data(values) of the array
        let a = [0, 0];
        // next four data(values) of the array
        let b = [[0, 0], [0, 0]];
        // next two data(values) of the array
        let c = [0, 0];
        // last value of the array, thus, publicSignals(which is the final output)
        let d = [0]

        // returns boolean, false if the check is incorrect
        expect(await verifier.verifyProof(a, b, c, d)).to.be.false;
    });
});


describe("Multiplier3 with Groth16", function () {
    let Verifier;
    let verifier;


    beforeEach(async function () {
        //[assignment] insert your script here
        Verifier = await ethers.getContractFactory("Multiplier3Verifier");
        verifier = await Verifier.deploy();
        await verifier.deployed();

    });

    it("Should return true for correct proof", async function () {
        //[assignment] insert your script here
        const { proof, publicSignals } = await groth16.fullProve({ "a": "1", "b": "2", "c": "3" }, "contracts/circuits/Multiplier3/Multiplier3_js/Multiplier3.wasm", "contracts/circuits/Multiplier3/circuit_final.zkey");

        console.log('1x2x3=', publicSignals[0]);

        const editedPublicSignals = unstringifyBigInts(publicSignals);
        const editedProof = unstringifyBigInts(proof);
        const calldata = await groth16.exportSolidityCallData(editedProof, editedPublicSignals);

        const argv = calldata.replace(/["[\]\s]/g, "").split(',').map(x => BigInt(x).toString());

        const a = [argv[0], argv[1]];
        const b = [[argv[2], argv[3]], [argv[4], argv[5]]];
        const c = [argv[6], argv[7]];
        const Input = argv.slice(8);

        expect(await verifier.verifyProof(a, b, c, Input)).to.be.true;
    });
    it("Should return false for invalid proof", async function () {
        //[assignment] insert your script here
        let a = [0, 0];
        let b = [[0, 0], [0, 0]];
        let c = [0, 0];
        let d = [0]
        expect(await verifier.verifyProof(a, b, c, d)).to.be.false;
    });
});


describe("Multiplier3 with PLONK", function () {
    let Verifier;
    let verifier;

    beforeEach(async function () {
        //[assignment] insert your script here
        Verifier = await ethers.getContractFactory("PlonkVerifier");
        verifier = await Verifier.deploy();
        await verifier.deployed();
    });

    it("Should return true for correct proof", async function () {
        //[assignment] insert your script here
        const { proof, publicSignals } = await plonk.fullProve(
            { "a": "1", "b": "2", "c": "3" },
            "contracts/circuits/Multiplier3_plonk/Multiplier3_js/Multiplier3.wasm",
            "contracts/circuits/Multiplier3_plonk/circuit_final.zkey"
        );

        console.log('1x2x3=', publicSignals[0]);

        const editedPublicSignals = unstringifyBigInts(publicSignals);
        const editedProof = unstringifyBigInts(proof);
        const calldata = await plonk.exportSolidityCallData(editedProof, editedPublicSignals);
        // console.log(calldata[0])

        const argv = calldata.replace(/["[\]\s]/g, "").split(',').map(x => BigInt(x).toString());
        // console.log(argv)

        const a = [argv[0]];
        const Input = [argv[1]];

        // expect(await verifier.verifyProof(a, Input)).to.be.true;
    });
    it("Should return false for invalid proof", async function () {
        //[assignment] insert your script here
    });
});