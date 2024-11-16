"use client";

import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { type BorrowPosition } from "@/app/types";
import BorrowCard from "@/components/BorrowCard";
import { useAccount } from "wagmi";
import { readContract, writeContract } from "@wagmi/core";
import { unilendABI } from "@/config/abis";
import { UNILEND_ADDRESS } from "@/config/addresses";
import { config } from "@/app/wagmi";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";

export default function MyBorrows() {
  const [positions, setPositions] = useState<BorrowPosition[]>([]);
  const [loading, setLoading] = useState(true);
  const { address } = useAccount();
  const fetchPositions = async () => {
    try {
      // Implement a get with graphql to get all tokenIds
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

  useEffect(() => {
    if (address) {
      fetchPositions();
    }
  }, [address]);

  const handleCollect = async (tokenId: string) => {
    try {
      const collectTx = await writeContract(config, {
        address: UNILEND_ADDRESS,
        abi: unilendABI,
        functionName: "collect",
        args: [BigInt(tokenId)],
      });

      if (collectTx) {
        toast.success("Successfully collected position!", {
          description: `Tx hash: ${collectTx}, copied to clipboard`,
        });
        // copy to clipboard
        navigator.clipboard.writeText(collectTx);
        fetchPositions(); // Refresh the list
      }
    } catch (error) {
      console.error("Error collecting position:", error);
      toast.error("Failed to collect position");
    }
  };

  return (
    <div className="container flex flex-col items-center justify-center mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">My Borrowed Positions</h1>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          {positions.length === 0 && (
            <div className="flex flex-col items-center justify-center">
              <div className="text-center mt-8 text-muted-foreground">
                No borrowing positions found.
              </div>
              <div className="text-center mt-2 text-muted-foreground">
                Do you want to borrow some tokens?
              </div>
              <Button className="mt-4" asChild>
                <Link href="/borrow">Borrow</Link>
              </Button>
            </div>
          )}
          <ScrollArea className="h-[80vh]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {positions.map((position, index) => (
                <BorrowCard
                  key={index}
                  position={position}
                  handleCollect={handleCollect}
                />
              ))}
            </div>
          </ScrollArea>
        </>
      )}
    </div>
  );
}
