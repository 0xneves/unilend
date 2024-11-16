import { ethers } from "ethers";
import { TickMath } from "@uniswap/v3-sdk";

const provider = new ethers.providers.JsonRpcProvider(process.env.UNICHAIN_RPC_URL);
const wallet = new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY || "", provider);

const NONFUNGIBLE_POSITION_MANAGER_ADDRESS = "0xB7F724d6dDDFd008eFf5cc2834edDE5F9eF0d075"; // Unichain
const Token0 = "0x71Fe7017299ca523d785457242aBD2d79785aEF5";
const Token1 = "0x5Cd38a12a54E2f92d3DC0EE2EB52cE410574aa11";

const positionManager = new ethers.Contract(
  NONFUNGIBLE_POSITION_MANAGER_ADDRESS,
  [
    "function createAndInitializePoolIfNecessary(address token0, address token1, uint24 fee, uint160 sqrtPriceX96) external returns (address)",
    "function mint((address token0, address token1, uint24 fee, int24 tickLower, int24 tickUpper, uint256 amount0Desired, uint256 amount1Desired, uint256 amount0Min, uint256 amount1Min, address recipient, uint256 deadline)) external returns (uint256 tokenId, uint128 liquidity, uint256 amount0, uint256 amount1)"
  ],
  wallet
);

const fee = 3000; // 0.3% fee tier
const sqrtPriceX96 = TickMath.getSqrtRatioAtTick(0).toString(); // Initialize price at 1:1 for simplicity

const amount0 = ethers.utils.parseUnits("4000", 18); // 20,000 Token A
const amount1 = ethers.utils.parseUnits("4000", 18); // 20,000 Token B

async function main() {
  try {
    // 1. Approve Token A and Token B
    const tokenAContract = new ethers.Contract(Token0, ["function approve(address spender, uint256 amount) public returns (bool)"], wallet);
    const tokenBContract = new ethers.Contract(Token1, ["function approve(address spender, uint256 amount) public returns (bool)"], wallet);

    const tx0 = await tokenAContract.approve(NONFUNGIBLE_POSITION_MANAGER_ADDRESS, amount0);
    await tx0.wait();
    const tx1 = await tokenBContract.approve(NONFUNGIBLE_POSITION_MANAGER_ADDRESS, amount1);
    await tx1.wait();
    console.log("Approved Token A and Token B for spending.");

    // 2. Create and Initialize Pool if Necessary
    // const tx2 = await positionManager.createAndInitializePoolIfNecessary(Token1, Token0, fee, sqrtPriceX96);
    // await tx2.wait();
    // console.log("Pool tx :", tx2.hash);

    // 3. Mint a New Position and Provide Liquidity
    const deadline = Math.floor(Date.now() / 1000) + 60 * 10; // 10-minute deadline
    const tickLower = -600; // Adjust ticks based on range you want
    const tickUpper = 600;

    const tx = await positionManager.mint({
      token0: Token1,
      token1: Token0,
      fee,
      tickLower,
      tickUpper,
      amount0Desired: amount0,
      amount1Desired: amount1,
      amount0Min: 0,
      amount1Min: 0,
      recipient: wallet.address,
      deadline
    });

    await tx.wait();
    console.log("Liquidity provided. Transaction receipt:", tx.hash);
  } catch (error) {
    console.error("Error:", error);
  }
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });