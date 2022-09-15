const MovieTicketNFTSwap = artifacts.require("./MovieTicketNFTSwap.sol");

contract("MovieTicketNFTSwap test", async accounts => {

    let _instance;
    const _movieId1 = 1;
    const _movieId2 = 2;    

    beforeEach( async () => {
        _instance = await MovieTicketNFTSwap.deployed();
    })

    it("should initialize movie titles and prices properly", async () => {
    
        const _movieTitle1 = await _instance.movieTitles.call([1]);
        const _movieTitle2 = await _instance.movieTitles.call([2]);
        const _movieTicketPrices1 = await _instance.movieTicketPrices.call([1]);
        const _movieTicketPrices2 = await _instance.movieTicketPrices.call([2]);
        assert.equal(_movieTitle1.valueOf(), "Avengers");
        assert.equal(_movieTitle2.valueOf(), "Starwars");
        assert.equal(_movieTicketPrices1.valueOf(), 1000000000000000000 );
        assert.equal(_movieTicketPrices2.valueOf(), 2000000000000000000 );
    });

    it("should be able to buy movie tickets", async () => {    
        await _instance.buyMovieTicket(_movieId1, {from: accounts[0], value:1000000000000000000});        
        const _ticket = await _instance.movieTickets.call([0]);        
        const _deployBlock = await web3.eth.getBlock("latest");        
        assert.equal(_ticket.ticketId, 1);
        assert.equal(_ticket.movieTitle, "Avengers");
        assert.equal(_ticket.ticketPriceInWei, "1000000000000000000");
        assert.equal(_ticket.ticketOwner, accounts[0]);
        assert.equal(_ticket.validTillBlock, _deployBlock.number + 10);
        assert.equal(_ticket.isSwappable, false);
    });

    it("should be able to approve ticket swap", async () => {
        await _instance.buyMovieTicket(_movieId1, {from: accounts[0], value:1000000000000000000});        
        const _ticketAccount1 = await _instance.movieTickets.call([1]);
        await _instance.buyMovieTicket(_movieId2, {from: accounts[1], value:2000000000000000000});        
        const _ticketAccount2 = await _instance.movieTickets.call([2]);
        await _instance.makeTicketSwapable(_ticketAccount2.ticketId, {from: accounts[1]});        
        const _ticketIsSwappable = await _instance.movieTickets.call([2]);
        assert.equal(_ticketIsSwappable.isSwappable, true);
    });

    it("should be able to swap tickets", async () => {               
        await _instance.buyMovieTicket(_movieId1, {from: accounts[0], value:1000000000000000000});        
        const _ticketAccount1 = await _instance.movieTickets.call([3]);
        await _instance.buyMovieTicket(_movieId2, {from: accounts[1], value:2000000000000000000});        
        const _ticketAccount2 = await _instance.movieTickets.call([4]);
        await _instance.makeTicketSwapable(_ticketAccount2.ticketId, {from: accounts[1]});
        await _instance.approveTransfer(accounts[0], _ticketAccount2.ticketId, {from: accounts[1]});
        const _priceDifference = await _instance.findPriceDifference(_ticketAccount1.ticketId, _ticketAccount2.ticketId, {from: accounts[0]});
        await _instance.swapTicket(accounts[1], _ticketAccount1.ticketId, _ticketAccount2.ticketId, {from: accounts[0], value:_priceDifference});
        const _newTicketAccount1 = await _instance.movieTickets.call([3]);
        const _newTicketAccount2 = await _instance.movieTickets.call([4]);
        assert.equal(_newTicketAccount1.ticketOwner, accounts[1]);
        assert.equal(_newTicketAccount2.ticketOwner, accounts[0]);
    });

    it("should be able to withdraw ether balance", async () => {   
        await _instance.buyMovieTicket(_movieId1, {from: accounts[0], value:1000000000000000000});        
        const _ticketAccount1 = await _instance.movieTickets.call([5]);
        await _instance.buyMovieTicket(_movieId2, {from: accounts[1], value:2000000000000000000});        
        const _ticketAccount2 = await _instance.movieTickets.call([6]);
        await _instance.makeTicketSwapable(_ticketAccount2.ticketId, {from: accounts[1]});
        await _instance.approveTransfer(accounts[0], _ticketAccount2.ticketId, {from: accounts[1]});
        const _priceDifference = await _instance.findPriceDifference(_ticketAccount1.ticketId, _ticketAccount2.ticketId, {from: accounts[0]});
        await _instance.swapTicket(accounts[1], _ticketAccount1.ticketId, _ticketAccount2.ticketId, {from: accounts[0], value:_priceDifference}); 
        await _instance.withdrawMyEtherBalance ({from: accounts[1]});
        const _myNewEtherBalanceInContract = await _instance.balanceOf(accounts[1]);
        assert(_myNewEtherBalanceInContract, 0);
       
    });       

    it("should be able to get my Ether balance held in contract", async () => {
   
        await _instance.buyMovieTicket(_movieId1, {from: accounts[0], value:1000000000000000000});        
        const _ticketAccount1 = await _instance.movieTickets.call([7]);
        await _instance.buyMovieTicket(_movieId2, {from: accounts[1], value:2000000000000000000});        
        const _ticketAccount2 = await _instance.movieTickets.call([8]);
        await _instance.makeTicketSwapable(_ticketAccount2.ticketId, {from: accounts[1]});        
        const _priceDifference = await _instance.findPriceDifference(_ticketAccount1.ticketId, _ticketAccount2.ticketId, {from: accounts[0]});
        await _instance.approveTransfer(accounts[0], _ticketAccount2.ticketId, {from: accounts[1]});
        await _instance.swapTicket(accounts[1], _ticketAccount1.ticketId, _ticketAccount2.ticketId, {from: accounts[0], value:_priceDifference});    
        let _myEtherBalance = await _instance.getMyEtherBalance({from: accounts[1]});        
        assert.equal(_myEtherBalance.toString(), _priceDifference);
    });

    it("should be able to get ticket information", async () => {
          
        await _instance.buyMovieTicket(_movieId1, {from: accounts[0], value:1000000000000000000});
        const _ticket = await _instance.movieTickets.call([9]);        
        const _ticketInformation = await _instance.getTicketInformation(_ticket.ticketId);
        assert.equal(_ticketInformation.ticketId, _ticket.ticketId);        
    });
        
    
    it("should be able to get contract Ether balance", async () => {
        let _contractEtherBalance = await _instance.getContractEtherBalance();
        assert(_contractEtherBalance >=0);
    });

    it("should not be able to buy movie tickets: invalid payment", async () => {    
        let erroredOut = false;
        try{
            await _instance.buyMovieTicket(_movieId1, {from: accounts[0], value:3000000000000000000});
        }catch (error) {
            erroredOut = true;
        }
        assert.equal(erroredOut, true, "Invalid Payment");        
    });

    it("should not be able to buy movie tickets: invalid movie ID", async () => {    
        let erroredOut = false;
        try{
            await _instance.buyMovieTicket(99, {from: accounts[0], value:3000000000000000000});
        }catch (error) {
            erroredOut = true;
        }
        assert.equal(erroredOut, true, "Invalid movie Id");        
    });

    it("should not be able to approve movie tickets transfer: don't own ticket", async () => {    
        let erroredOut = false;
        try{
            await _instance.approveTransfer(accounts[0], _ticketAccount2.ticketId, {from: accounts[4]});            
        }catch (error) {
            erroredOut = true;
        }
        assert.equal(erroredOut, true);        
    });

    it("should not be able to swap movie tickets: Other ticket should be swappable", async () => {    
        let erroredOut = false;
        try{
            await _instance.buyMovieTicket(_movieId1, {from: accounts[0], value:1000000000000000000});        
            const _ticketAccount1 = await _instance.movieTickets.call([10]);
            await _instance.buyMovieTicket(_movieId2, {from: accounts[1], value:2000000000000000000});        
            const _ticketAccount2 = await _instance.movieTickets.call([11]);            
            await _instance.approveTransfer(accounts[0], _ticketAccount2.ticketId, {from: accounts[1]});            
        }catch (error) {
            erroredOut = true;
        }
        assert.equal(erroredOut, true);        
    });

    it("should not be able to swap movie tickets: Incorrect Payment provided", async () => {    
        let erroredOut = false;
        try{
            await _instance.buyMovieTicket(_movieId1, {from: accounts[0], value:1000000000000000000});        
            const _ticketAccount1 = await _instance.movieTickets.call([12]);
            await _instance.buyMovieTicket(_movieId2, {from: accounts[1], value:2000000000000000000});        
            const _ticketAccount2 = await _instance.movieTickets.call([13]);
            await _instance.makeTicketSwapable(_ticketAccount2.ticketId, {from: accounts[1]});
            await _instance.approveTransfer(accounts[0], _ticketAccount2.ticketId, {from: accounts[1]});
            const _priceDifference = await _instance.findPriceDifference(_ticketAccount1.ticketId, _ticketAccount2.ticketId, {from: accounts[0]});
            await _instance.swapTicket(accounts[1], _ticketAccount1.ticketId, _ticketAccount2.ticketId, {from: accounts[0], value:_priceDifference/2});            
        }catch (error) {
            erroredOut = true;
        }
        assert.equal(erroredOut, true);        
    });

    
    it("should not be able to swap movie tickets: Can't swap with lower priced ticket", async () => {    
        let erroredOut = false;
        try{
            await _instance.buyMovieTicket(_movieId2, {from: accounts[0], value:2000000000000000000});        
            const _ticketAccount1 = await _instance.movieTickets.call([14]);
            await _instance.buyMovieTicket(_movieId1, {from: accounts[1], value:1000000000000000000});        
            const _ticketAccount2 = await _instance.movieTickets.call([15]);
            await _instance.makeTicketSwapable(_ticketAccount2.ticketId, {from: accounts[1]});
            await _instance.approveTransfer(accounts[0], _ticketAccount2.ticketId, {from: accounts[1]});
            const _priceDifference = await _instance.findPriceDifference(_ticketAccount1.ticketId, _ticketAccount2.ticketId, {from: accounts[0]});
            await _instance.swapTicket(accounts[1], _ticketAccount1.ticketId, _ticketAccount2.ticketId, {from: accounts[0], value:_priceDifference});            
        }catch (error) {
            erroredOut = true;
        }
        assert.equal(erroredOut, true);        
    });
       
    it("should not be able to make ticket swap", async () => {   
        let erroredOut = false;
        try{
            const _ticketAccount2 = await _instance.movieTickets.call([2]);
            await _instance.makeTicketSwapable(_ticketAccount2.ticketId, {from: accounts[3]});            
        }catch (error) {
            erroredOut = true;
        }
        assert.equal(erroredOut, true);
    });

    it("should not be able to withdraw ether balance", async () => {   
        let erroredOut = false;
        try{
            await _instance.withdrawMyEtherBalance ({from: accounts[2]});
        }catch (error) {
            erroredOut = true;
        }
        assert.equal(erroredOut, true);
    });

    it("should not be able to get ether balance", async () => {   
        let erroredOut = false;
        try{
            await _instance.getMyEtherBalance ({from: 0x2dF7e756aA6596246e733A6bCA3AcF2Dc85faf29});
        }catch (error) {
            erroredOut = true;
        }
        assert.equal(erroredOut, true);
    });

    it("should not be able to swap movie tickets: Expired ticket", async () => {    
        let erroredOut = false;
        try{            
            const _ticketAccount1 = await _instance.movieTickets.call([1]);            
            const _ticketAccount2 = await _instance.movieTickets.call([15]);            
            await _instance.makeTicketSwapable(_ticketAccount2.ticketId, {from: accounts[1]});
            await _instance.approveTransfer(accounts[0], _ticketAccount2.ticketId, {from: accounts[1]});
            const _priceDifference = await _instance.findPriceDifference(_ticketAccount1.ticketId, _ticketAccount2.ticketId, {from: accounts[0]});
            await _instance.swapTicket(accounts[1], _ticketAccount1.ticketId, _ticketAccount2.ticketId, {from: accounts[0], value:_priceDifference});            
        }catch (error) {
            erroredOut = true;
        }
        assert.equal(erroredOut, true);        
    });
});