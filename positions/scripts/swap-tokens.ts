import { ethers } from "ethers";
import { SwapRouter } from "@uniswap/v3-sdk";
import { TradeType, CurrencyAmount, Percent, Token } from "@uniswap/sdk-core";

const provider = new ethers.providers.JsonRpcProvider(process.env.UNICHAIN_RPC_URL);
const wallet = new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY || "", provider);


const SWAP_ROUTER_ADDRESS = "0xd1AAE39293221B77B0C71fBD6dCb7Ea29Bb5B166"; // Unichain

const Token0 = "0x71Fe7017299ca523d785457242aBD2d79785aEF5";
const Token1 = "0x5Cd38a12a54E2f92d3DC0EE2EB52cE410574aa11";

const poolFee = 3000; // 0.3% fee tier
const amountIn = ethers.utils.parseUnits("100", 18); // Amount of Token0 to swap (1 token)

async function main() {
  try {
    // 1. Approve SwapRouter to spend Token0
    const token0Contract = new ethers.Contract(Token0, ["function approve(address spender, uint256 amount) public returns (bool)"], wallet);
    const tx0 = await token0Contract.approve(SWAP_ROUTER_ADDRESS, amountIn);
    await tx0.wait();
    console.log("Approved Token0 for swapping at tx:", tx0.hash);

    // 2. Create the Swap Parameters
    const swapRouter = new ethers.Contract(
      SWAP_ROUTER_ADDRESS,
      [
        "function exactInputSingle((address tokenIn, address tokenOut, uint24 fee, address recipient, uint256 amountIn, uint256 amountOutMinimum, uint160 sqrtPriceLimitX96)) external payable returns (uint256 amountOut)"
      ],
      wallet
    );

    const amountOutMinimum = 0; // Accept any amount of Token1 (for simplicity)
    const sqrtPriceLimitX96 = 0; // No price limit for the swap

    // 3. Execute the Swap
    const tx1 = await swapRouter.exactInputSingle({
      tokenIn: Token0,
      tokenOut: Token1,
      fee: poolFee,
      recipient: wallet.address,
      amountIn,
      amountOutMinimum,
      sqrtPriceLimitX96
    });
    await tx1.wait();
    console.log("Swap complete. Transaction receipt:", tx1.hash);
  } catch (error) {
    console.error("Error during the swap:", error);
  }
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });