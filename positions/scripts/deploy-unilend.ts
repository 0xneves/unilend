import { ethers } from "hardhat";

async function main() {
    const NONFUNGIBLE_POSITION_MANAGER_ADDRESS = "0xB7F724d6dDDFd008eFf5cc2834edDE5F9eF0d075";
    const Factory = await ethers.getContractFactory("Unilend");
    const Unilend = await Factory.deploy(NONFUNGIBLE_POSITION_MANAGER_ADDRESS);
    await Unilend.deployed();
    
    console.log("Unilend deployed to:", Unilend.address);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });