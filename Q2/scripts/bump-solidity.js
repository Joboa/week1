const fs = require("fs");
const solidityRegex = /pragma solidity \^\d+\.\d+\.\d+/

const verifierRegex = /contract Verifier/

// Read file from the directory contracts containing
// HelloWorldVerifier.sol
let content = fs.readFileSync("./contracts/HelloWorldVerifier.sol", { encoding: 'utf-8' });
// The solidity regex above reads the solidity version
// The code line <bumped> replaces the solidity with with ^0.8.0
let bumped = content.replace(solidityRegex, 'pragma solidity ^0.8.0');
// Change the verifier to our compile solidity code,thus the HelloWorldVerifier
bumped = bumped.replace(verifierRegex, 'contract HelloWorldVerifier');
// Create a new file with bumped  in HelloWorldVerifier.sol
fs.writeFileSync("./contracts/HelloWorldVerifier.sol", bumped);

// [assignment] add your own scripts below to modify the other verifier contracts you will build during the assignment

// Multiplier3Verifier.sol
let contentMult = fs.readFileSync("./contracts/Multiplier3Verifier.sol", { encoding: 'utf-8' });
let bumpedMult = contentMult.replace(solidityRegex, 'pragma solidity ^0.8.0');
bumpedMult = bumpedMult.replace(verifierRegex, 'contract Multiplier3Verifier');
fs.writeFileSync("./contracts/Multiplier3Verifier.sol", bumpedMult);


// Multiplier3PlonkVerifier.sol
let contentMultPlonk = fs.readFileSync("./contracts/PlonkVerifier.sol", { encoding: 'utf-8' });
let bumpedMultPlonk = contentMultPlonk.replace(solidityRegex, 'pragma solidity ^0.8.0');
bumpedMultPlonk = bumpedMultPlonk.replace(verifierRegex, 'contract PlonkVerifier');
fs.writeFileSync("./contracts/PlonkVerifier.sol", bumpedMultPlonk);