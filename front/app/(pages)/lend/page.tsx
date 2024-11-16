"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { toast } from "sonner";
import { useAccount, useWriteContract, useReadContract } from "wagmi";
import { parseEther } from "viem";
import { UNILEND_ADDRESS, UNISWAP_NFT_ADDRESS } from "@/config/addresses";
import { unilendABI } from "@/config/abis";

export default function Lend() {
  const [tokenId, setTokenId] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [nftFound, setNftFound] = useState(false);
  const { address } = useAccount();

  // Add contract read for NFT ownership verification
  const { data: isOwner, refetch: checkOwnership } = useReadContract({
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
    args: tokenId ? [BigInt(tokenId)] : undefined,
    enabled: false,
  });

  // Approve NFT
  const { write: approveNFT } = useWriteContract({
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
  });

  // Create lend position
  const { write: createLend } = useWriteContract({
    address: UNILEND_ADDRESS,
    abi: unilendABI,
    functionName: "lend",
  });

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const { data } = await checkOwnership();
      if (data === address) {
        setNftFound(true);
        toast.success("NFT found! You can now set lending parameters.");
      } else {
        toast.error("You don't own this NFT");
        setNftFound(false);
      }
    } catch (error) {
      console.error("Error searching for token:", error);
      toast.error("NFT not found or error occurred");
      setNftFound(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLend = async () => {
    try {
      setIsLoading(true);

      // First approve the NFT
      await approveNFT({
        args: [UNILEND_ADDRESS, BigInt(tokenId)],
      });

      // Then create the lend
      await createLend({
        args: [BigInt(tokenId), parseEther(price), BigInt(duration)],
      });

      toast.success("Position successfully listed for lending!");
    } catch (error) {
      console.error("Error lending position:", error);
      toast.error("Failed to lend position");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Lend Position</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            {/* Search section */}
            <div className="flex gap-4">
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

            {/* Lending parameters section - only shown if NFT is found */}
            {nftFound && (
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
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
