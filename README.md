# ChirpJS

*A web3js wrapper for accessing Chirp content on the ethereum blockchain*

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


## License

(The MIT License)

Copyright (c) 2017 Chirp

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
