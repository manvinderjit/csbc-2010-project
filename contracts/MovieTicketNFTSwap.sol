// SPDX-License-Identifier: MIT

// specifies solidity version required
pragma solidity ^0.8.13;

// @dev import dependencies
import "./ERC721.sol";

/** @title Module 8: Final Coding Assignment */
/// @author Manvinderjit Rupal
/// @notice The contract allows two NFT movie tickets of different properties or values to be swapped with ether exchange.
///         They are based on ERC721 standard with the OpenZepplin one being used in the contract

/// @dev MovieTicketNFTSwap contract definition starts here
contract MovieTicketNFTSwap is ERC721 {
    
    /// @dev state variable declaration
    ///      movieTitles mapping stores the titles of movies to an integer index
    ///      movieTicketPrices mapping stores the corresponding prices of movies to an integer index
    ///      userEtherBalances mapping stores the amount of ether owed to each user address
    ///      counterTicketId parameter is used as an index for each minted ticket
    mapping(uint256 => string) public movieTitles;
    mapping(uint256 => uint256) public movieTicketPrices;    
    mapping(address => uint256) userEtherBalances;
    uint256 counterTicketId = 1;
    ///      Information for each movie ticket is stored as a custom struct
    struct MovieTicket {
        uint256 ticketId;                   /// index of each ticket, is unique
        string movieTitle;                  /// title of movie
        uint256 ticketPriceInWei;           /// price in Wei paid for ticket
        address ticketOwner;                /// owner address for the ticket
        uint256 validTillBlock;             /// the block till which the ticket is valid, used instead of block.timestamp
        bool isSwappable;                   /// stores if the ticket is swappable or not, default is false 
    }   
    ///      movieTickets array is of MovieTicket type and stores the information of movies tickets
    MovieTicket[] public movieTickets;

    /// @dev event declaration
    event BoughtTickets(address, uint256);                      // Emitted when ticket bought successfully
    event SwappedTickets(address, uint256, address, uint256);   // Emitted when ticket swapped successfully
    event WithdrawBalance(address, uint256);                    // Emitted when funds withdrawn successfully

    ///@dev constructor initialization
    constructor() payable ERC721("MovieTicket", "MTKT") {                          
        movieTitles[1] = "Avengers";                            // Name for first movie initialized as Avengers
        movieTitles[2] = "Starwars";                            // Name for second movie initialized asStarwars
        movieTicketPrices[1] = 1000000000000000000;             // Ticket price for Avengers, = 1e18 = 1 ether
        movieTicketPrices[2] = 2000000000000000000;             // Ticket price for Starwars  = 2e18 = 2 ether
    }

    /// @dev checkTicketValidity modifier ensures that the ticket is valid for at least two more blocks
    /// @param _ticketId Denotes the index of the movie ticket NFT to be checked for validity
    /// @notice ensures that the movie ticket is valid, not expired
    modifier checkTicketValidity (uint256 _ticketId) {
        require(movieTickets[_ticketId-1].validTillBlock > block.number + 2, "1"); // Error: Expired or about to expire tickets can not be swapped
        _;
    }

    /// @dev checkSwappabilityOfTickets modifier implements the design choice: a movie ticket can only be exchanged with an equal or higher priced ticket
    /// @param _myTicketId Denotes the index of the movie ticket of the requesting account
    /// @param _otherTicketID Denotes the index of the higher priced movie ticket that a ticket will be exchanged with
    /// @notice ensures that the two supplied tickets are eligible for swap    
    modifier checkSwappabilityOfTickets (uint256 _myTicketId, uint256 _otherTicketID) {        
        // Only user with a lower ticket value can initiate transfer to avoid complications
        require(movieTickets[_myTicketId-1].ticketPriceInWei <= movieTickets[_otherTicketID-1].ticketPriceInWei, "2"); // Error: Can only swap with a higher or equal priced ticket!
        _;
    }

    /// @dev buyMovieTicket function allows users to mint a movie ticket    
    /// @param _movieId denotes the index of the movie (movieId) for which the ticket must be bought/minted
    /// @notice allows users to buy a ticket as an NFT    
    function buyMovieTicket ( uint8 _movieId ) public payable {
        /// ensures that the movieId must be valid, 1 for Avengers, 2 for Starwars
        require(_movieId > 0 && _movieId <= 2, "3"); // Error: Movie id must be valid
        /// ensures that the value of ether sent must be equal to the ticket price declared
        require(msg.value == movieTicketPrices[_movieId], "4"); // Error: Please pay correct amount for ticket
        /// creates a new object of MovieTicket type
        MovieTicket memory _movieTicket = MovieTicket ({
            ticketId : counterTicketId,
            movieTitle : movieTitles[_movieId],
            ticketPriceInWei: movieTicketPrices[_movieId],
            ticketOwner: payable(msg.sender),            
            validTillBlock: (block.number + 10), //Instead of using timestamp, assuming the number of blocks till which ticket is valid
            isSwappable: false            
        });
        /// object is pushed to movie tickets array
        movieTickets.push(_movieTicket);
        /// the movie ticket is minted with ERC721 _safeMint function
        _safeMint(msg.sender, counterTicketId);
        /// event BoughtTickets emitted
        emit BoughtTickets(msg.sender, counterTicketId);
        /// counter increemented to store the index of next ticket
        counterTicketId++;
    }             

    /// @dev makeTicketSwapable function allows an account address to make a ticket they own available for swapping with a lower-priced ticket    
    /// @param _tokenId the index of the ticket that the owner wishes to list for swapping
    /// @notice allows an owner to list their ticket for swapping with lower priced tickets
    function makeTicketSwapable(uint256 _tokenId) public {
        require(msg.sender == movieTickets[_tokenId-1].ticketOwner, "5"); //Error: Only ticket owner can list token for swapping!
        movieTickets[_tokenId-1].isSwappable = true;
    }

    /// @dev findPriceDifference allows a user to check how much money they have to pay with for swapping with a higher priced ticket
    /// guarded by:
    ///      checkSwappabilityOfTickets modifer
    /// @param _myTokenId the index of the lower priced ticket that an account wants to sell
    /// @param _otherTokenID the index of the higher priced ticket that the account wants to exchange the lower priced ticket for
    /// @return (uint256) returns the price difference of the two tickets
    /// @notice allows a user to find how much they have to pay to exchange their ticket with another, higher priced ticket
    function findPriceDifference (uint256 _myTokenId, uint256 _otherTokenID) external view 
        checkSwappabilityOfTickets(_myTokenId, _otherTokenID) 
    returns (uint256) {
        return (movieTickets[_otherTokenID-1].ticketPriceInWei - movieTickets[_myTokenId-1].ticketPriceInWei);
    }

    /// @dev approveTransfer function enables the account with higher-priced ticket to allow another account having a lower-priced ticket to initiate a swap
    ///      uses the approve method of Open Zepplin ERC721 standard
    /// @param _recipient the address of the account owning the lower priced ticket
    /// @param _tokenId the index of higher priced ticket owned by the account calling this function (approving trade)
    /// @notice the owner of higher priced ticket approves a trade request from the account having a lower priced ticket
    function approveTransfer (address _recipient, uint256 _tokenId) public {        
        // ensures that the ticket is swappable
        require(movieTickets[_tokenId-1].isSwappable, "6"); // Error: The ticket should be listed for swapping
        approve(_recipient, _tokenId);
    }

    /// @dev function swapTicket changes the ticketOwner of the supplied tickets
    /// guarded by:
    ///      checkTicketValidity
    ///      checkSwappabilityOfTickets
    /// @param _recipient denotes owner account address of the higher priced ticket
    /// @param _myTokenId denotes the index of the lower priced ticket, owned by request initiator account
    /// @param _otherTokenID denotes the index of the higher priced ticket, owned by the _recipient account
    /// @notice allows the owners of two tickets to swap them
    function swapTicket (address _recipient, uint256 _myTokenId, uint256 _otherTokenID) public payable 
        checkTicketValidity (_myTokenId)
        checkTicketValidity(_otherTokenID)
        checkSwappabilityOfTickets(_myTokenId, _otherTokenID)
    {                
        // Payment of the price difference must be provided by lower-priced ticket
        require(msg.value == movieTickets[_otherTokenID-1].ticketPriceInWei - movieTickets[_myTokenId-1].ticketPriceInWei, "7"); // Error: Please provide right payment for transfer
        
        // Transfer sender ticket to receiver
        transferFrom(msg.sender, _recipient, _myTokenId);     
        movieTickets[_myTokenId-1].ticketOwner = _recipient;
        // Transfer receiver ticket to sender
        transferFrom(_recipient, msg.sender, _otherTokenID);
        movieTickets[_otherTokenID-1].ticketOwner = msg.sender;
        // Add the ether value to the recipient's balance
        userEtherBalances[_recipient] += msg.value;
        // Set isSwappable attribute of tickets false
        movieTickets[_myTokenId-1].isSwappable = false;
        movieTickets[_otherTokenID-1].isSwappable = false;
        // emit the SwappedTickets event
        emit SwappedTickets(msg.sender, _myTokenId, _recipient, _otherTokenID);
    }
    
    /// @dev withdrawMyEtherBalance function allows a request sending account to withdraw their ether balance
    /// emits the WithdrawBalance event on successful withdrawal
    /// @notice allows a user who has some balance in their account to withdraw it
    function withdrawMyEtherBalance () external payable {
        // Ensures that the user is owed some ether
        require(userEtherBalances[msg.sender] > 0, "8"); // Error: Nothing to withdraw
        // Set user balance to zero
        uint256 _userEtherBalance = userEtherBalances[msg.sender];
        userEtherBalances[msg.sender] = 0;
        // Transfer balance to user
        (bool sent, ) = (msg.sender).call{value: _userEtherBalance, gas:2300 }("");
        require(sent, "9"); // Error: Failed to send Ether
        // Emit the withdrawl event
        emit WithdrawBalance(msg.sender, _userEtherBalance);
    }
    
    /// @dev getTicketInformation function provides the information for a given ticket index
    /// @param _ticketIndex the index of the ticket for which information is being requested
    /// @return an object of MovieTicket type having the information for the given ticket index
    /// @notice provides all information about the ticket 
    function getTicketInformation (uint256 _ticketIndex) public view returns (MovieTicket memory) {         
         return movieTickets[_ticketIndex-1];
    }

    /// @dev getContractEtherBalance function returns the Ether balance of the contract
    /// @return (uint256) ether in wei held in the contract address
    /// @notice provides how much ether is in the contract account
    function getContractEtherBalance () public view returns (uint256) {
        return address(this).balance;
    }

    /// @dev getMyEtherBalance function returns the balance of msg.sender owed by the contract 
    /// @return (uint256) ether in wei owed to msg.send by the contract address
    /// @notice shows how much ether an owner has in the contract
    function getMyEtherBalance () public view returns (uint256) {
        return userEtherBalances[msg.sender];
    }
} /// @dev movieTicketNFT contract definition ends here
