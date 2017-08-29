'use strict';

/**
 * Module dependencies.
 */ 

const Web3 = require('web3');
const deasync = require('deasync');
const ZeroClientProvider = require('web3-provider-engine/zero.js');

// let longToken = 10 ** 18;
let web3;
let contractAddress;
let abi;
let Contract;
let contractInstance;
let chirpsDict;
let chirpers;
let count = 1;


/**
 * Get all Chirps from a chirper
 *
 *  @param {String} address
 *
 *  @callback(Array)
 *  @public
 */

function getChirpsByChirper(address, callback) {
  const chirps = [];
  if (chirpers[address] && chirpers[address].length) {
    for (let i = 0; i < chirpers[address].length; i++) {
      const chirpId = chirpers[address][i];
      chirps.push(chirpsDict[chirpId]);
      if (i === chirpers[address].length - 1) {
        callback(chirps);
        break;
      }
    }
  } else {
    callback(chirps);
  }
}

/**
 * Get a raw chirp from an ID
 *
 *
 *  @param {int} id
 *
 *  @return(Array)
 *  @private
 */

const getChirpById = deasync((id, cb) => {
  contractInstance.chirps(count, (err, _chirp) => {
    if (err) cb(err, null);
    cb(null, _chirp);
  });
});

/**
 * Get token balance from an address 
 *
 *
 *  @param {String} address
 *
 *  @return(int)
 *  @public
 */

const tokenBalance = deasync((address, cb) => {
  if (address.substring(0, 2) !== '0x') {
    cb('Address must be a valid ethereum public key.', null);
  }
  contractInstance.balanceOf(address, (err, balance) => {
    if (err) cb(err, null);
    cb(null, balance);
  });
});


/**
 * Get purchasable token supply
 *
 *
 *  @return(int)
 *  @public
 */

const getPurchaseableSupply = deasync((cb) => {
  cb(null, tokenBalance(contractAddress));
});

/**
 * Get a block from a block number
 *
 *  @param {int} blockNum
 *
 *  @return(Object)
 *  @public
 */

const loadBlock = deasync((blockNum, cb) => {
  web3.eth.getBlock(blockNum, (err, block) => {
    if (err) cb(err, null);
    cb(null, block);
  });
});

/**
 * Get an alias from an address
 *
 *  @param {String} address
 *
 *  @return(String)
 *  @public
 */

const getAliasFromAddress = deasync((address, cb) => {
  contractInstance.addressAliases(address, (err, alias) => {
    if (err) cb(err, null);
    cb(null, alias);
  });
});


/**
 *  Load a chirp with replies included
 *
 *  @param {int} id
 *
 *  @return(Object)
 *  @public
 */

function getChirp(id, callback) {
  const replies = [];
  if (chirpsDict[id] && chirpsDict[id].replyIds.length) {
    for (let i = 0; i < chirpsDict[id].replyIds.length; i++) {
      const replyId = chirpsDict[id].replyIds[i];
      replies.push(chirpsDict[replyId]);
      if (i === chirpsDict[id].replyIds.length - 1) {
        chirpsDict[id].replies = replies;
        callback(chirpsDict[id]);
        break;
      }
    }
  } else {
    callback(chirpsDict[id]);
  }
}

/**
 *  Get current Chirp count
 *
 *
 *  @return(int)
 *  @public
 */

function getCount() {
  return count;
}


/**
 * Initialize Watch
 *
 *   - watch blockchain for new contract events
 *   - update chirps when new chirp or vote comes in
 *
 *  @private
 */

function watchEvents() {
  const events = contractInstance.allEvents();
  events.watch((error, result) => {
    if (!error) {
      const id = result.args.id ? parseInt(result.args.id) : null;
      switch (result.event) {
        case 'NewChirp':
          loadChirp(id);
          break;
        case 'Vote':
          loadChirp(id);
          break;
        default:
          null;
      }
      console.log(`Incoming Event: ${result.event}`);
      console.log(`Arguments:${JSON.stringify(result.args)}`);
    } else {
      console.log(error);
    }
  });
}

/**
 * Load Chirps from blockchain
 *
 *  @param {String} rcpUrl
 *  @param {String} _contractAddress
 *  @param {String} _contractAbi
 *
 *  @callback(Object)
 *  @public
 */

function loadChirps(options, callback) {
  if (options.reset) {
    chirpsDict = {};
    count = 1;
  }
  while (true) {
    const _chirp = getChirpById(count);
    const id = _chirp[0].c[0];
    if (id === 0) {
      callback(chirpsDict);
      break;
    }
    const _obj = formChirp(_chirp);
    const parentID = _obj.parentID;
    const chirper = _obj.chirper;
    chirpsDict[id] = _obj;
    if (parentID !== 0) {
      chirpsDict[parentID].replyIds.push(id);
    }

    // Save all chirps by chirper
    if (chirpers[chirper]) chirpers[chirper].push(id);
    else chirpers[chirper] = [id];
    count++;
  }
}

/**
 *  Form a chirp into an object from a raw Array
 *
 *  @param {_chirp} Array
 *
 *  @return(Object)
 *  @private
 */

const formChirp = deasync((_chirp, cb) => {
  const id = _chirp[0].c[0];
  const chirper = _chirp[1];
  const body = _chirp[2];
  const blockNum = _chirp[3].c[0];
  const parentID = _chirp[4].c[0];
  const reward = _chirp[5].c[0];
  const type = _chirp[6].c[0];
  const upvotes = _chirp[7].c[0];
  const downvotes = _chirp[8].c[0];
  const flags = _chirp[9].c[0];
  const _obj = {
    id,
    chirper,
    blockNum,
    body,
    parentID,
    reward,
    type,
    upvotes,
    downvotes,
    flags,
    replyIds: [],
    replies: [],
    images: [],
    timestamp: loadBlock(blockNum).timestamp * 1000,
  };
  cb(null, _obj);
});

/**
 * Initialize the module.
 *
 *   - create web3js client
 *   - setup default middleware
 *   - setup route reflection methods
 *
 *  @param {String} rcpUrl
 *  @param {String} _contractAddress
 *  @param {String} _contractAbi
 *
 *  @callback(Object)
 *  @public
 */

function init(rcpUrl, _contractAddress, _contractAbi, callback) {
  const engine = ZeroClientProvider({
    getAccounts() {},
    rpcUrl: rcpUrl,
  });
  web3 = new Web3(engine);
  contractAddress = _contractAddress;
  abi = _contractAbi;
  Contract = web3.eth.contract(abi);
  contractInstance = Contract.at(contractAddress);
  chirpsDict = {};
  chirpers = {};
  count = 1;
  console.log('[CHIRP] Initialized Successfully.');
  loadChirps({}, (chirps) => {
    if (chirps) console.log(`[CHIRP] Chirps 1 through ${count} Loaded Successfully.`);
    if (callback) callback(chirps);
  });
  watchEvents(function() {
    console.log('[CHIRP] Watching for new events.');
  });
}

/**
 * Expose Functions
 */

module.exports = {
  init,
  loadChirps,
  getChirpsByChirper,
  getChirp,
  getAliasFromAddress,
  tokenBalance,
  getCount,
  getPurchaseableSupply,
};
