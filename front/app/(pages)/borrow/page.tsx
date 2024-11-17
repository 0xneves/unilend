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
import { fetchSubgraph } from "@/lib/subgraph";

export default function Borrow() {
  const [positions, setPositions] = useState<LendPosition[]>([]);
  const [loading, setLoading] = useState(true);
  const { address } = useAccount();

  const fetchPositions = async () => {
    if (!address) {
      console.error("No address");
      // setLoading(false);
      return;
    }

    try {
      const QUERY = `
        query Lended($lender: String!) {
          lendCreateds(
            orderBy: time,
            orderDirection: desc,
            first: 1
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
      data.data.lendCreateds.forEach(async (lendPosition: any) => {
        const result: any = await readContract(config, {
          address: UNILEND_ADDRESS,
          abi: unilendABI,
          functionName: "lends",
          args: [BigInt(lendPosition.tokenId)],
        });

        // Only include positions where the current user is the lender and the position is available
        if (result.lender !== address && result.isAvailable) {
          formattedPositions.push({
            lender: lendPosition.lender,
            tokenId: lendPosition.tokenId.toString(),
            price: lendPosition.price,
            time: lendPosition.time,
            isAvailable: lendPosition.isAvailable,
            blockscoutUrl: `https://unichain-sepolia.blockscout.com/address/${UNILEND_ADDRESS}`,
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
        toast.success("Successfully borrowed position!", {
          description: `Tx hash: ${borrowTx}, copied to clipboard`,
          duration: 10000,
        });
        // copy to clipboard
        navigator.clipboard.writeText(borrowTx);
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

  return (
    <div className="container flex flex-col items-center justify-center mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Borrow Position</h1>

      {loading ? (
        <div>Loading positions...</div>
      ) : positions.length === 0 ? (
        <div>No positions available for borrowing</div>
      ) : (
        <Card>
          <CardContent className="flex flex-col gap-4 w-[400px]">
            <div className="grid gap-4">
              {positions.map((position) => (
                <Card key={position.tokenId}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p>Token ID: {position.tokenId}</p>
                        <p>Price: {formatEther(position.price)} ETH</p>
                        <p>Duration: {position.time} seconds</p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button
                          onClick={() =>
                            handleBorrow(position.tokenId, position.price)
                          }
                        >
                          Borrow
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
