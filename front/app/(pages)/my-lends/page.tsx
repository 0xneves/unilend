"use client";

import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { type LendPosition } from "@/app/types";
import LendCard from "@/components/LendCard";
import { useAccount } from "wagmi";
import { readContract } from "@wagmi/core";
import { UNILEND_ADDRESS } from "@/config/addresses";
import { unilendABI } from "@/config/abis";
import { config } from "@/app/wagmi";
import { Button } from "@/components/ui/button";
import { formatEther } from "viem";
import Link from "next/link";
import { fetchSubgraph } from "@/lib/subgraph";

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
        const QUERY = `
          query Lended($lender: String!) {
            lendCreateds(
              orderBy: time,
              orderDirection: desc,
              first: 1
              where: { lender: $lender }
            ) {
              lender
              price
              time
              tokenId
            }
          }
        `;
        const VARIABLES = {
          lender: address,
        };
        const res = await fetchSubgraph(QUERY, VARIABLES);
        const data = await res.response?.json();

        let formattedPositions: LendPosition[] = [];
        data.data.lendCreateds.forEach(async (position: any) => {
          const result: any = await readContract(config, {
            address: UNILEND_ADDRESS,
            abi: unilendABI,
            functionName: "lends",
            args: [BigInt(position.tokenId)],
          });

          // Only include positions where the current user is the lender and the position is available
          if (result.lender === address && result.isAvailable) {
            formattedPositions.push({
              lender: position.lender,
              tokenId: position.tokenId.toString(),
              price: position.price,
              time: position.time,
              isAvailable: true,
              blockscoutUrl: `https://unichain-sepolia.blockscout.com/address/${UNILEND_ADDRESS}`, // adjust for your network
            });
          }
        });
        setPositions(formattedPositions);
      } catch (error) {
        console.error("Error fetching positions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPositions();
  }, [address]);

  return (
    <div className="container flex flex-col items-center justify-center mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">My Lending Positions</h1>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          {positions.length === 0 && (
            <div className="flex flex-col items-center justify-center">
              <div className="text-center mt-8 text-muted-foreground">
                No lending positions found.
              </div>
              <div className="text-center mt-2 text-muted-foreground">
                Do you want to lend your tokens?
              </div>
              <Button className="mt-4" asChild>
                <Link href="/lend">Lend</Link>
              </Button>
            </div>
          )}
          <ScrollArea className="h-[80vh]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {positions.map((position, index) => (
                <LendCard key={index} position={position} />
              ))}
            </div>
          </ScrollArea>
        </>
      )}
    </div>
  );
}
