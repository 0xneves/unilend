import { ethers } from "hardhat";

async function main() {
    const FactoryToken0 = await ethers.getContractFactory("Token0");
    const Token0 = await FactoryToken0.deploy();
    await Token0.deployed();
    
    console.log("Token0 deployed to:", Token0.address);

    const FactoryToken1 = await ethers.getContractFactory("Token1");
    const Token1 = await FactoryToken1.deploy();
    await Token1.deployed();
    
    console.log("Token1 deployed to:", Token1.address);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });