//SPDX-Licence-Identifier: MIT
pragma solidity ^0.8.0;

contract Whitelist {
    uint8 public numAddressesWhitelisted;

    uint8 public maxWhitelistedAddresses;

    mapping(address => bool) public whitelistedAddresses;

    constructor(uint8 _maxWhitelistedAddresses) {
        maxWhitelistedAddresses = _maxWhitelistedAddresses;
    }

    function addAddressToWhitelist() public {
        require(
            !whitelistedAddresses[msg.sender],
            "Address is already whitelisted!"
        );
        require(
            numAddressesWhitelisted < maxWhitelistedAddresses,
            "List is already full"
        );
        whitelistedAddresses[msg.sender] = true;
        numAddressesWhitelisted += 1; 
    }
}
