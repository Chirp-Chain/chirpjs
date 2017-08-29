# ChirpJS

*A web3js wrapper for accessing Chirp content on the ethereum blockchain*

[![NPM version](https://badge.fury.io/js/chirpjs.svg)](https://badge.fury.io/js/chirpjs)
[![Build Status](https://travis-ci.org/Chirp-Chain/chirpjs.svg?branch=master)](https://travis-ci.org/Chirp-Chain/chirpjs)

[![NPM](https://nodei.co/npm/chirpjs.png)](https://nodei.co/npm/chirpjs/)

## Installation
```javascript
npm install chirpjs --save 
```
   
## Initialization
 ```javascript
const Chirp = require('chirpjs');

const rpcUrl = "https://rcp.infura.io/ajdij1ij21io3";
const contractAddress = "0x0....";
const contractAbi = [];

Chirp.initialize(rcpUrl, contractAddress, contractAbi, function(chirps) {
	console.log(chirps); // {1:{chirp 1...}, 2: { chirp...1},...} 
});
```

## Functions

- **loadChirps(callback)**: Loads all chirps into an object.
```javascript
Chirp.loadChirps(function(chirps) {
	console.log(chirps); // {1:{chirp 1...}, 2: { chirp...1},...} 
});
```

- **getChirp(id, callback)**: Load a chirp by ID with replies included.
```javascript
Chirp.getChirp(id, function(chirp) {
	console.log(chirp); // {id: 1, body: "[body]", replies: [{chirp}, {chirp}..]} 
});
```

- **getChirpsByChirper(address, callback)**: Returns all chirps an address chirped.
```javascript
Chirp.getChirpsByChirper(address, function(chirps) {
	console.log(chirps); // {1:{chirp 1...}, 2: { chirp...1},...} 
});
```

- **getAliasFromAddress(address, callback)**: Returns an address's alias.
```javascript
Chirp.getAliasFromAddress(address, function(alias) {
	console.log(alias); // "[alias]" or "" if alias doesn't exist.
});
```

- **getAliasFromAddress(address, callback)**: Returns an address's Chirp token balance.
```javascript
Chirp.tokenBalance(address, function(balance) {
	console.log(balance); // 1000
});
```

- **getCount()**: Returns number of Chirps on the blockchain.
```javascript
let chirpCount = Chirp.getCount();
console.log(chirpCount); // 500
```

- **getPurchaseableSupply()**: Returns number of tokens available for purchase from the Chirp contract.
```javascript
let purchaseableSupply = Chirp.getPurchaseableSupply();
console.log(purchaseableSupply); // 100000
```
