"use client";

import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { type BorrowPosition } from "@/app/types";
import PositionCard from "@/components/PositionCard";
import { useAccount } from "wagmi";
import { readContract } from "@wagmi/core";
import { unilendABI } from "@/config/abis";
import { UNILEND_ADDRESS } from "@/config/addresses";
import { config } from "@/app/wagmi";
export default function MyBorrows() {
  const [positions, setPositions] = useState<BorrowPosition[]>([]);
  const [loading, setLoading] = useState(true);
  const { address } = useAccount();

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        // Assuming you have a way to get the list of all tokenIds
        // You might need to implement this based on your requirements
        const tokenIds = ["11741"]; // Replace with actual token IDs

        const borrowPromises = tokenIds.map(async (tokenId) => {
          const result: any = await readContract(config, {
            address: UNILEND_ADDRESS,
            abi: unilendABI,
            functionName: "borrows",
            args: [BigInt(tokenId)],
          });

          // Only include positions where the current user is the borrower and the position is active
          if (
            result.borrower.toLowerCase() === address?.toLowerCase() &&
            result.isActive
          ) {
            return {
              lender: result.lender,
              borrower: result.borrower,
              tokenId: tokenId,
              price: result.price,
              deadline: Number(result.deadline),
              isActive: result.isActive,
              blockscoutUrl: `https://blockscan.com/address/${result.lender}`,
            };
          }
          return null;
        });

        const fetchedPositions = (await Promise.all(borrowPromises)).filter(
          (position): position is BorrowPosition => position !== null
        );

        setPositions(fetchedPositions);
      } catch (error) {
        console.error("Error fetching positions:", error);
      } finally {
        setLoading(false);
      }
    };

    if (address) {
      fetchPositions();
    }
  }, [address]);

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">My Borrowed Positions</h1>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <ScrollArea className="h-[80vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {positions.length === 0 && (
              <div className="text-center mt-8 text-muted-foreground">
                No borrowing positions found.
              </div>
            )}
            {positions.map((position, index) => (
              <PositionCard key={index} position={position} />
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
