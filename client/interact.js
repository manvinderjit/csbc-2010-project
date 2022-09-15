// Inject environemnt variable in this file
require("dotenv").config("./env");

// Import Web3
const Web3 = require("web3");

// Import BigNumber
const BigNumber = require("bignumber.js");

// Import abi
const abiObject = require("../build/contracts/MovieTicketNFTSwap.json");

// Provide Contract Address
const CONTRACT_ADDRESS="0x63992aC7C4aB8F9C41e18F8e232f084EC5688B9C";

// Create web3 instance
const web3 = new Web3(process.env.URI);

// get accounts from private keys
const accountObj1 = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY_1);
const accountObj2 = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY_2);

// Get contract instance for account 1 (buys Avengers ticket)
const MovieTicketNFTSwapAccount1 = new web3.eth.Contract(
    abiObject.abi,
    CONTRACT_ADDRESS,
    {from: accountObj1.address}
);

// Get contract instance for account 2 (buys StarWars ticket)
const MovieTicketNFTSwapAccount2= new web3.eth.Contract(
    abiObject.abi,
    CONTRACT_ADDRESS,
    {from: accountObj2.address}
);

// movieId is the id of the movie
let _movieIdAvengers = 1; // 1 for Avengers
let _movieIdStarWars = 2; // 2 for Starwars

let movieTicketPriceAvengers = new BigNumber(1000000000000000000) ;    // Ticket price for Avengers
let movieTicketPriceStarWars = new BigNumber(2000000000000000000) ;    // Ticket price for Starwars

module.exports.buyMovieTicketForAccount = function (_accountId, _movieId) {
    try {
        let _movieTicketPrice;
        if(_movieId == 1){
            _movieTicketPrice = movieTicketPriceAvengers;
        }else if (_movieId == 2){
            _movieTicketPrice = movieTicketPriceStarWars;
        }else {
            console.error("Invalid movie Id in client");
        }
        
        let _MovieTicketNFTSwapAccount;
        if(_accountId == 1){
            _MovieTicketNFTSwapAccount = MovieTicketNFTSwapAccount1;
        }else if (_accountId == 2){
            _MovieTicketNFTSwapAccount = MovieTicketNFTSwapAccount2;
        }else {
            console.error("Account Id must be 1 or 2");
        }

        // Use this code to buy Avengers movie ticket for account 1
        _MovieTicketNFTSwapAccount.methods
            .buyMovieTicket(_movieId)
            .estimateGas({value: _movieTicketPrice})
            .then((gas) => {
                _MovieTicketNFTSwapAccount.methods
                .buyMovieTicket(_movieId)
                .send({ gas, value: _movieTicketPrice, });
        });
    } catch (err) {
        console.log(err);
    }    
}

module.exports.getMovieTicketInformation = function (_movieTicketId) {
    try {
        // Use this code to get the information about purchased movie tickets
        MovieTicketNFTSwapAccount1.methods
        .getTicketInformation(_movieTicketId)
        .call()
        .then((result) => {
            console.log("Information for ticket", _movieTicketId," is ", result);
        });
    } catch (err) {
        console.log(err);
    }    
}

module.exports.makeTicketSwappable = function (_movieTicketId){
    try{
        // Use this code to get make a ticket swappable
        MovieTicketNFTSwapAccount2.methods // Called from account 2 as owned by account 2        
        .makeTicketSwapable(_movieTicketId)
        .estimateGas()
        .then((gas) => {
            MovieTicketNFTSwapAccount2.methods
            .makeTicketSwapable(_movieTicketId)
            .send({ gas, });
        });      
    }catch(err) {
        console.log(err);
    }    
}

// Use this code to get make a ticket swappable
module.exports.approveTransfer = function (_movieTicketId){
    try{
        // As the account1 with PRIVATE_KEY_1 has the lower priced token, it will be recipient
        let _recipientAccount = accountObj1.address;        
        // The request will be made by the account owning the higher priced ticket
        MovieTicketNFTSwapAccount2.methods // Called from account 2 as owned by account 2
        .approveTransfer(_recipientAccount, _movieTicketId)        
        .estimateGas()
        .then((gas) => {
            MovieTicketNFTSwapAccount2.methods
            .approveTransfer(_recipientAccount, _movieTicketId)
            .send({ gas, });
        });      
    }catch(err) {
        console.log(err);
    }    
}

// Use this code to get make a ticket swappable
module.exports.findPriceDifference = function (_myMovieTicketId, _otherMovieTicketId){
    try{        
        // The request will be made by the account owning the lower priced ticket
        MovieTicketNFTSwapAccount1.methods
        .findPriceDifference(_myMovieTicketId, _otherMovieTicketId)     
        .call()
        .then((result) => {
            console.log("You have to pay ", result, " extra for ticket swap");
        });
    }catch(err) {
        console.log(err);
    }    
}

// Use this code to swap tickets
module.exports.swapTicketNFTs = function (_myMovieTicketId, _otherMovieTicketId){
    try{
        // The user must pay the price difference calculated above
        let _ticketPriceDifference = new BigNumber(1000000000000000000);
        // As the account2 with PRIVATE_KEY_2 has the lower priced token, it will be recipient
        let _recipientAccount = accountObj2.address;
        // The request will be made by the account owning the lower priced ticket        
        MovieTicketNFTSwapAccount1.methods // Called from account 1 as it owns lower priced ticket
        .swapTicket(_recipientAccount, _myMovieTicketId, _otherMovieTicketId)        
        .estimateGas({value: _ticketPriceDifference})
        .then((gas) => {
            MovieTicketNFTSwapAccount1.methods
            .swapTicket(_recipientAccount, _myMovieTicketId, _otherMovieTicketId)
            .send({ value: _ticketPriceDifference, gas, });
        });      
    }catch(err) {
        console.log(err);
    }    
}

// Use this code to check your Ether balance held in contract
module.exports.getMyEtherBalance = function (){
    try{        
        // The request will be made by the account owning the higher priced ticket
        // as they will receive Ether
        MovieTicketNFTSwapAccount2.methods
        .getMyEtherBalance()     
        .call()
        .then((result) => {
            console.log("You have ", result, " in your contract account!");
        });
    }catch(err) {
        console.log(err);
    }    
}

// Use this code to withdraw your Ether balance held in contract
module.exports.withdrawMyEtherBalance = function (){
    try{        
        // The request will be made by the account owning the higher priced ticket
        // as they will receive Ether
        MovieTicketNFTSwapAccount2.methods
        .withdrawMyEtherBalance()
        .estimateGas()
        .then((gas) => {
            MovieTicketNFTSwapAccount2.methods
            .withdrawMyEtherBalance()
            .send({gas})            
        });
        console.log("You have withdrawn ether in your contract account!");
    }catch(err) {
        console.log(err);
    }    
}

// Use this code to get contract Ether balance
module.exports.getContractEtherBalance = function () {
    try{        
        // The request will be made by the account owning the higher priced ticket
        // as they will receive Ether
        MovieTicketNFTSwapAccount1.methods
        .getContractEtherBalance()     
        .call()
        .then((result) => {
            console.log("Ether balance in contract is:", result);
        });
    }catch(err) {
        console.log(err);
    }  
}

// Shows the balance of the accounts
module.exports.getAccountEtherBalance = async function (){
    let balanceAccount1 = await web3.eth.getBalance(accountObj1.address);
    let balanceAccount2 = await web3.eth.getBalance(accountObj2.address);
    console.log("Account 1 ", accountObj1.address, " balance: ", balanceAccount1);
    console.log("Account 2 ", accountObj2.address, " balance: ", balanceAccount2);
}