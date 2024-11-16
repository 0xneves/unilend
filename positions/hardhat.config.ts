import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";
dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.25",
  networks: {
    unichain: {
      url: `${process.env.UNICHAIN_RPC_URL}`,
      accounts: [`${process.env.DEPLOYER_PRIVATE_KEY}`],
    },
  },
  defaultNetwork: "hardhat",
};

export default config;
