"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { toast } from "sonner";
import { useAccount } from "wagmi";
import { parseEther } from "viem";
import { UNILEND_ADDRESS, UNISWAP_NFT_ADDRESS } from "@/config/addresses";
import { unilendABI } from "@/config/abis";
import { readContract, writeContract } from "@wagmi/core";
import { config } from "@/app/wagmi";

export default function Lend() {
  const [tokenId, setTokenId] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [nftFound, setNftFound] = useState(false);
  const { address } = useAccount();

  // Modify the useReadContract hook to handle BigInt serialization
  const checkOwnership = async () => {
    const ownerAddress = await readContract(config, {
      address: UNISWAP_NFT_ADDRESS,
      abi: [
        {
          name: "ownerOf",
          type: "function",
          inputs: [{ name: "tokenId", type: "uint256" }],
          outputs: [{ name: "", type: "address" }],
          stateMutability: "view",
        },
      ],
      functionName: "ownerOf",
      args: [tokenId ? BigInt(tokenId) : BigInt(0)],
    });

    return ownerAddress;
  };

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const ownerAddress = await checkOwnership();

      if (!ownerAddress) {
        throw new Error("NFT not found");
      }
      if (ownerAddress === address) {
        setNftFound(true);
        toast.success("NFT found! You can now set lending parameters.");
      } else {
        toast.error("You don't own this NFT");
        setNftFound(false);
      }
    } catch (error) {
      console.error("Error searching for token:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "NFT not found or error occurred"
      );
      setNftFound(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLend = async () => {
    try {
      setIsLoading(true);

      // First approve the NFT
      const approvalHash = await writeContract(config, {
        address: UNISWAP_NFT_ADDRESS,
        abi: [
          {
            name: "approve",
            type: "function",
            inputs: [
              { name: "to", type: "address" },
              { name: "tokenId", type: "uint256" },
            ],
            outputs: [],
            stateMutability: "nonpayable",
          },
        ],
        functionName: "approve",
        args: [UNILEND_ADDRESS, BigInt(tokenId)],
      });

      if (!approvalHash) throw new Error("Approval failed");

      // Then create the lending position
      const lendHash = await writeContract(config, {
        address: UNILEND_ADDRESS,
        abi: unilendABI,
        functionName: "lend",
        args: [BigInt(tokenId), parseEther(price), BigInt(duration)],
      });

      if (!lendHash) throw new Error("Lending failed");

      toast.success("Position successfully listed for lending!", {
        description: `Tx hash: ${lendHash}, copied to clipboard`,
        duration: 10000,
      });
      // copy to clipboard
      navigator.clipboard.writeText(lendHash);
    } catch (error) {
      console.error("Error lending position:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to lend position"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container flex flex-col items-center justify-center mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Lend Position</h1>

      <Card>
        <CardContent className="flex flex-col gap-4 w-[400px]">
          {/* Search section */}
          <div className="flex gap-4 justify-center items-center mt-4">
            <Input
              placeholder="Enter token ID"
              value={tokenId}
              onChange={(e) => {
                setTokenId(e.target.value);
                setNftFound(false);
              }}
            />
            <Button onClick={handleSearch} disabled={isLoading || !tokenId}>
              {isLoading ? "Searching..." : "Search"}
            </Button>
          </div>
        </CardContent>
      </Card>
      {nftFound && (
        <Card className="w-[400px] mt-8">
          <CardContent>
            {/* Lending parameters section - only shown if NFT is found */}

            <div className="flex flex-col gap-4 mt-4">
              <Input
                placeholder="Enter price (in ETH)"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
              <Input
                placeholder="Enter duration (in seconds)"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
              <Button
                onClick={handleLend}
                disabled={isLoading || !price || !duration}
              >
                {isLoading ? "Processing..." : "Lend Position"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
