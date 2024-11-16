"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAccount } from "wagmi";
import { readContract, writeContract } from "@wagmi/core";
import { UNILEND_ADDRESS } from "@/config/addresses";
import { unilendABI } from "@/config/abis";
import { config } from "@/app/wagmi";
import { toast } from "sonner";
import { formatEther } from "viem";
import { LendPosition } from "@/app/types";

export default function Borrow() {
  const [positions, setPositions] = useState<LendPosition[]>([]);
  const [loading, setLoading] = useState(true);
  const { address } = useAccount();

  const fetchPositions = async () => {
    if (!address) {
      console.log("No address");
      // setLoading(false);
      return;
    }

    try {
      const positions: LendPosition[] = [];
      // Check positions from 11741 to 11751
      for (let i = 11741; i <= 11751; i++) {
        console.log("Fetching position", i);
        const lendPosition: any = await readContract(config, {
          address: UNILEND_ADDRESS,
          abi: unilendABI,
          functionName: "lends",
          args: [BigInt(i)],
        });
        console.log("Lend position", lendPosition);
        // Only add position if it exists and belongs to the current user
        if (
          lendPosition &&
          lendPosition.lender !== address &&
          lendPosition.isAvailable
        ) {
          positions.push({
            lender: lendPosition.lender,
            tokenId: lendPosition.tokenId.toString(),
            price: lendPosition.price,
            time: lendPosition.time,
            isAvailable: lendPosition.isAvailable,
            blockscoutUrl: `https://unichain-sepolia.blockscout.com/address/${UNILEND_ADDRESS}`,
          });
        }
      }
      setPositions(positions);
    } catch (error) {
      console.error("Error fetching positions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBorrow = async (tokenId: string, price: bigint) => {
    try {
      const borrowTx = await writeContract(config, {
        address: UNILEND_ADDRESS,
        abi: unilendABI,
        functionName: "borrow",
        args: [BigInt(tokenId)],
        value: price,
      });

      if (borrowTx) {
        toast.success("Successfully borrowed position!");
        fetchPositions(); // Refresh the list
      }
    } catch (error) {
      console.error("Error borrowing position:", error);
      toast.error("Failed to borrow position");
    }
  };

  useEffect(() => {
    fetchPositions();
  }, [address]);

  if (loading) {
    return <div>Loading positions...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Available Positions</CardTitle>
        </CardHeader>
        <CardContent>
          
          <div className="grid gap-4">
            {positions.length === 0 ? (
              <div>No positions available for borrowing</div>
            ) : (
              positions.map((position) => (
                <Card key={position.tokenId}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p>Token ID: {position.tokenId}</p>
                        <p>Price: {formatEther(position.price)} ETH</p>
                        <p>Lender: {position.lender}</p>
                      </div>
                      <Button
                        onClick={() =>
                          handleBorrow(position.tokenId, position.price)
                        }
                      >
                        Borrow
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
