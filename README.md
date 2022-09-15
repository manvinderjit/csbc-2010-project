## PRE-REQUISITES

1. Navigate to the client folder and run the following command to install dependencies
``` Javascript
   X:\..module8\client> npm install
```
2. Ensure you have truffle 5.4.29 or install it with the following command.
```Javascript
    npm i -g truffle@5.4.29
```
### Important: It is vital to use version 5.4.29 of truffle or older as the `solidity-coverage` plugin does not work with newer versions due to breaking changes in ganache. More details are available here: https://github.com/sc-forks/solidity-coverage/issues/696

## EXECUTION

1. ## RUN TRUFFLE
We are going to run the truffle network and populate four variables in a `.env` file located in `client` folder. Create it based on `.env.sample`
    1.URI=
    2.PRIVATE_KEY_1=
    3.PRIVATE_KEY_2=
    4.CONTRACT_ADDRESS=

The first step is to start the truffle network. Navigate to the `module 8` assignment folder and run the following command.
``` Javascript
   X:\..module8> truffle develop
```
It will start a network similar to the following
```Javascript
    Truffle Develop started at http://127.0.0.1:8545/
```
Replace the URI variable in `.env` file with the above address.

There will be a list of dummy accounts also generated as following.

```Javascript
Accounts:
(0) 0x2df7e756aa6596246e733a6bca3acf2dc85faf29
(1) 0x8c6537de199215e100aca4fdf34cfefd13153dc2
(2) 0x47043f7e5c07d4a9f4e3b87e0a8f809aba17c10d
(3) 0x2b30da4335f8388fca83ea8e7e2e57a4f225c86d
(4) 0x2b37a54351308d331c954221893ae490ed2f37e3
(5) 0xce87b10ca06d940271158e72cf501cac42547872
(6) 0xc4dd7ad2258ac99ca5f0eaa6cd91c314fde56326
(7) 0xe53e981e0f9776e9e5d24e9d1d8c239805ab8b24
(8) 0xc37e5c605369a2533e9b9af314207d1ebe850301
(9) 0x2141b6c9e37803a0847024d274d577b8b9812717

Private Keys:
(0) 42c18dd649b0f9e03d42d326faa4ef0a8dcd94f71c4576c7e4f987105f8b58c1
(1) 9489250d98837987374370714a54827d0663043b26904d9178eb2eb336a157d4
(2) 377394cb2475f3ed36262156efdcd1218bbb52286689b76ce9062318024e7040
(3) 78ddbb5252f77d2542dd986c866b5a52af38a40e907fc5eaf865839b8837fc26
(4) 288cd73a1a2848dafc252aa43ffb7699cf6d4da165558b8e5bee602c51b831f6
(5) a3036f4733a7fcc0044d0647c0aafd95479b6e9fbcee4071cf09fb5833b2fda9
(6) 8fe8ae4dbdca7c1c54e4fcda1f44d07e9fd5e8b43543692b5b18af403692b2db
(7) 65d507159b45f0686babf3345f9e2e01c9fb8ef9d73d4bac79d709be050f66bf
(8) e2a40e0d0cc12ac0d556d075436bfdaed48e963c18fe136b26d7f99b04b9b0a6
(9) 1f5b8579209d7f87048fa8d7e3ceb530c2bd95467b3e1c7e69c4c15473d980b7
```
Copy the private keys for any two accounts and use them to populate the `PRIVATE_KEY_1` and the `PRIVATE_KEY_2` variables in `.env` file.

Next run the following command 
```Javascript
    truffle(develop)> migrate
```
It will generate an output as follows 
```Javascript
    2_deploy_contracts.js
    =====================
    Replacing 'MovieTicketNFTSwap'
    ------------------------------
    > transaction hash:    0x83a95af9507ed4d9e9110c05282a25db72612002251db8cd1b109ac4b40d5baa
    > Blocks: 0            Seconds: 0
    > contract address:    0x63992aC7C4aB8F9C41e18F8e232f084EC5688B9C
    > block number:        3
    > block timestamp:     1648885608
    > account:             0x2dF7e756aA6596246e733A6bCA3AcF2Dc85faf29
    > balance:             99.991651922
    > gas used:            3882672 (0x3b3eb0)
    > gas price:           2 gwei
    > value sent:          0 ETH
    > total cost:          0.007765344 ETH
```
Copy the contract address from here and assign it to the `CONTRACT_ADDRESS` variable in `.env` file.

2. ## OPEN NEW TERMINAL
Leave the previous terminal with truffle running. Open a new terminal window and navigate to the `client` folder located in the `module 8` assignment folder

The `interact.js` script is employed for interacting with all the functions of the contract.

__For ease of use, the scripts have been enclosed in functions. Run the following javascript commands depending on the operation to be performed__

3. ### BUYING FIRST TICKET
Run the following command to buy an Avengers movie ticket for account 1
``` Javascript
    node -e "require('./interact.js').buyMovieTicketForAccount(1, 1)"
```

Run the following command to check the ticket information. Since it is the first ticket purchased, its ticketId is 1
```Javascript
    node -e "require('./interact.js').getMovieTicketInformation(1)"
```
We will have information as below 

```Javascript
    Information for ticket 1  is  [
    '1',
    'Avengers',
    '1000000000000000000',
    '0x2dF7e756aA6596246e733A6bCA3AcF2Dc85faf29',
    '15',
    false,
    ticketId: '1',
    movieTitle: 'Avengers',
    ticketPriceInWei: '1000000000000000000',
    ticketOwner: '0x2dF7e756aA6596246e733A6bCA3AcF2Dc85faf29',
    validTillBlock: '15',
    isSwappable: false
    ]
```
We can see that the `ticketOwner` will be the account with private key `PRIVATE_KEY_1` in `.env` file, [0] in the shown the truffle `develop` network 


4. ### BUYING SECOND TICKET
Run the following command to buy a StarWars movie ticket for account 2
``` Javascript
    node -e "require('./interact.js').buyMovieTicketForAccount(2, 2)"
```

Run the following command to check the ticket information. Since it is the second ticket purchased, its ticketId is 2
```Javascript
    node -e "require('./interact.js').getMovieTicketInformation(2)"
```

We will have information as below 
```Javascript
    Information for ticket 2  is  [
    '2',
    'Starwars',
    '2000000000000000000',
    '0x8C6537De199215E100Aca4FdF34cFEfD13153dc2',
    '16',
    false,
    ticketId: '2',
    movieTitle: 'Starwars',
    ticketPriceInWei: '2000000000000000000',
    ticketOwner: '0x8C6537De199215E100Aca4FdF34cFEfD13153dc2',
    validTillBlock: '16',
    isSwappable: false
    ]
```
We can see that the `ticketOwner` will be the account with private key `PRIVATE_KEY_2` in `.env` file, [1] in the shown the truffle `develop` network 

We can check the contrat balance with the following command.
```Javascript
    node -e "require('./interact.js').getContractEtherBalance()"    
```
It will now be `3000000000000000000`
```Javascript
    Ether balance in contract is: 3000000000000000000
```

5. ### MAKE TICKET SWAPPABLE
The next step for a user is to make their ticket swappable. As the design choice assumes that only a user with the lower priced ticket can initiate transfer and the user with the higher price ticket can make their ticket swappable, we will make `ticket 2` swappable here.
```Javascript
    node -e "require('./interact.js').makeTicketSwappable(2)"
```
Let's again check `ticket 2` information with the following command
```Javascript
    node -e "require('./interact.js').getMovieTicketInformation(2)"
```
We will see that `isSwappable` will now be set to true
```Javascript
    Information for ticket 2  is  [
    '2',
    'Starwars',
    '2000000000000000000',
    '0x8C6537De199215E100Aca4FdF34cFEfD13153dc2',
    '16',
    true,
    ticketId: '2',
    movieTitle: 'Starwars',
    ticketPriceInWei: '2000000000000000000',
    ticketOwner: '0x8C6537De199215E100Aca4FdF34cFEfD13153dc2',
    validTillBlock: '16',
    isSwappable: true
    ]
```
#### Note: It is not necessary to make lower priced ticket swappable.

6. ### APPROVING TRANSFER
Assume the owner of ticket with index `1` offers to swap it with ticket `2`. The account with the higher priced ticket must approve transfer from the account with the lower priced ticket account. 

We will provide two arguments
    1. The account that will be initiating the transfer, account with `PRIVATE_KEY_1` in the `.env` file
    2. The ticket for whom the transfer is being approved

The request will be made by the account owning the higher priced ticket
```Javascript
    node -e "require('./interact.js').approveTransfer(2)"
```

7. ### FINDING PRICE DIFFERENCE
As the lower priced account will initiate the transfer, they will have to provide the difference between the cost of the two tickets. The following command can be used to find the difference between the prices
```Javascript
    node -e "require('./interact.js').findPriceDifference(1,2)"
```
The amount will be reflected as following
```Javascript
    You have to pay  1000000000000000000  extra for ticket swap
```

8. ### PERFORMING SWAP
The next step is to peform the swap. If you want to check the Ether balance of the accounts, use the following command
```Javascript
    node -e "require('./interact.js').getAccountEtherBalance()"
```
It will show balances of accounts with `PRIVATE_KEY_1` and `PRIVATE_KEY_2` defined in the `.env` file
```Javascript
    Account 1  0x2dF7e756aA6596246e733A6bCA3AcF2Dc85faf29  balance:  98991181444000000000
    Account 2  0x8C6537De199215E100Aca4FdF34cFEfD13153dc2  balance:  97999424726000000000
```
We will have to pass two parameters
    1. The ticketId of the lower priced ticket held by the requesting account
    2. The ticketId of the higher priced ticket to be swapped with

    #### NOTE: Recipient address is not required as it is hardcoded into front-end in `interact.js` for this example

The command will be
``` Javascript
    node -e "require('./interact.js').swapTicketNFTs(1,2)"
```

Let use confirm the transfer by checking the information of tickets using the following commands
```Javascript
    node -e "require('./interact.js').getMovieTicketInformation(1)"
```
```Javascript
    Information for ticket 1  is  [
    '1',
    'Avengers',
    '1000000000000000000',
    '0x8C6537De199215E100Aca4FdF34cFEfD13153dc2',
    '15',
    false,
    ticketId: '1',
    movieTitle: 'Avengers',
    ticketPriceInWei: '1000000000000000000',
    ticketOwner: '0x8C6537De199215E100Aca4FdF34cFEfD13153dc2',
    validTillBlock: '15',
    isSwappable: false
    ]
```
We will see that the `ticketOwner` changed from `0x2dF7e756aA6596246e733A6bCA3AcF2Dc85faf29` to `0x8C6537De199215E100Aca4FdF34cFEfD13153dc2`

Similarly, let use use get information for second account
```Javascript
    node -e "require('./interact.js').getMovieTicketInformation(2)"
```
```Javascript
    Information for ticket 2  is  [
    '2',
    'Starwars',
    '2000000000000000000',
    '0x2dF7e756aA6596246e733A6bCA3AcF2Dc85faf29',
    '16',
    false,
    ticketId: '2',
    movieTitle: 'Starwars',
    ticketPriceInWei: '2000000000000000000',
    ticketOwner: '0x2dF7e756aA6596246e733A6bCA3AcF2Dc85faf29',
    validTillBlock: '16',
    isSwappable: false
    ]
```
The `ticketOwner` is interchanged here as well.

Therefore, the swap has been completed successfully

9. ### WITHDRAWING ETHER
 While the swap is complete, the recipient, account with `PRIVATE_KEY_2`, has yet to obtain their Ether. It is stored in the contract at the moment. We can check it using the following command.
```Javascript
    node -e "require('./interact.js').getContractEtherBalance()"    
```
It will now be `4000000000000000000`
```Javascript
    Ether balance in contract is: 4000000000000000000
```
And the user's balance in contract can be checked with
```Javascript
    node -e "require('./interact.js').getMyEtherBalance()"
```
It will return the balance as follows
```Javascript
    You have  1000000000000000000  in your contract account!
```
#### NOTE: Recipient address is not required as it is hardcoded into front-end in `interact.js` for this example

Before we withdraw, let use check how much Ether the account has in its address right now with the following command
```Javascript
    node -e "require('./interact.js').getAccountEtherBalance()"
```
It will show balances of accounts with `PRIVATE_KEY_1` and `PRIVATE_KEY_2` defined in the `.env` file
```Javascript
    Account 1  0x2dF7e756aA6596246e733A6bCA3AcF2Dc85faf29  balance:  97990984530000000000
    Account 2  0x8C6537De199215E100Aca4FdF34cFEfD13153dc2  balance:  97999424726000000000
```
As the higher priced ticket was owned by Account 2, we are concerned with its balance `97999424726000000000`.

Let use withdraw the Ether using the following command
```Javascript
    node -e "require('./interact.js').withdrawMyEtherBalance()"
```
We can again check how much Ether the account has in its address right now with the following command
```Javascript
    node -e "require('./interact.js').getAccountEtherBalance()"
```
``` Javascript
    Account 1  0x2dF7e756aA6596246e733A6bCA3AcF2Dc85faf29  balance:  97990984530000000000
    Account 2  0x8C6537De199215E100Aca4FdF34cFEfD13153dc2  balance:  98999379664000000000
```
We can see that the balance of Account 2 has increased to `98999379664000000000` from `97999424726000000000`

If they check their Ether balance in contract with the following command
```Javascript
    node -e "require('./interact.js').getMyEtherBalance()"  
```
it will be zero
```Javascript
    You have  0  in your contract account!
```
To check the Ether held in contract, use the following command
```Javascript
    node -e "require('./interact.js').getContractEtherBalance()"    
```
It will now be `3000000000000000000`
```Javascript
    Ether balance in contract is: 3000000000000000000
```

10. ## TESTING

To run tests, execute the following command from the terminal by navigating to the `module 8` assignment folder. 
```Javascript
    truffle test
```
#### Note: If running in truffle environment, just run the `test` command in the CLI.

## Test Coverage
To check the test coverage, navigate to the `coverage` folder and open the `index.html` file in the browser. The assignment has been completely implemented in `MovieTicketNFTSwap.sol` file with the rest being imported from ERC721 OpenZepplin standard.

The test coverage for `MovieTicketNFTSwap.sol` is as follows.    
	Statements  100% 	36/36 	
    Branches    94.44% 	17/18 	
    Functions:  100% 	12/12 	
    Lines:      100% 	39/39

#### Note: The only branch not test is the following require statement in the `withdrawMyEtherBalance` function. A negative case for the same can't be tested because of various validations implemented in the function, the `MovieTicketNFTSwap.sol`, and the `ERC721.sol` OpenZepplin contract libraries.

```Javascript
    (bool sent, ) = (msg.sender).call{value: _userEtherBalance, gas:2300 }("");
    require(sent, "Failed to send Ether");
```

## ERROR CODE INDEX
```Javascript
    Error Code	    Error Message
    1	            Expired or about to expire tickets can not be swapped
    2	            Can only swap with a higher or equal priced ticket!
    3	            Movie id must be valid
    4	            Please pay correct amount for ticket
    5	            Only ticket owner can list token for swapping!
    6	            The ticket should be listed for swapping
    7	            Please provide right payment for transfer
    8	            Nothing to withdraw
    9	            Failed to send Ether
```