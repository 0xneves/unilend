"use client";

import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { type LendPosition } from "@/app/types";
import PositionCard from "@/components/PositionCard";
import { useAccount } from "wagmi";
import { readContract } from "@wagmi/core";
import { UNILEND_ADDRESS } from "@/config/addresses";
import { unilendABI } from "@/config/abis";
import { config } from "@/app/wagmi";

export default function MyLends() {
  const [positions, setPositions] = useState<LendPosition[]>([]);
  const [loading, setLoading] = useState(true);
  const { address } = useAccount();

  useEffect(() => {
    const fetchPositions = async () => {
      if (!address) {
        setLoading(false);
        return;
      }

      try {
        const lendPosition: any = await readContract(config, {
          address: UNILEND_ADDRESS,
          abi: unilendABI,
          functionName: "lends",
          args: [BigInt(11741)], // You'll need to know which tokenIds to check
        });

        // Convert contract data to your LendPosition type
        if (lendPosition && lendPosition.lender === address) {
          const position: LendPosition = {
            lender: lendPosition.lender,
            tokenId: lendPosition.tokenId.toString(),
            price: lendPosition.price,
            time: lendPosition.time,
            isAvailable: lendPosition.isAvailable,
            blockscoutUrl: `https://unichain-sepolia.blockscout.com/address/${UNILEND_ADDRESS}`, // adjust for your network
          };
          setPositions([position]);
        }
      } catch (error) {
        console.error("Error fetching positions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPositions();
  }, [address]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">My Lending Positions</h1>

      <ScrollArea className="h-[80vh]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {positions.map((position, index) => (
            <PositionCard key={index} position={position} />
          ))}
        </div>
      </ScrollArea>

      {positions.length === 0 && (
        <div className="text-center mt-8 text-muted-foreground">
          No lending positions found.
        </div>
      )}
    </div>
  );
}
