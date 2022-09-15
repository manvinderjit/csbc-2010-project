const MovieTicketNFTSwap = artifacts.require("./MovieTicketNFTSwap.sol");
  module.exports = function (deployer) {
    deployer.deploy(MovieTicketNFTSwap);
};