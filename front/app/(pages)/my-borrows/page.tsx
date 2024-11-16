"use client";

import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { type BorrowPosition } from "@/app/types";
import PositionCard from "@/components/PositionCard";

const mockPositions: BorrowPosition[] = [
  {
    id: "1",
    duration: 30,
    tokenId: "1",
    price: 1,
    blockScanUrl: "https://blockscan.com/address/1",
  },
  {
    id: "2",
    duration: 60,
    tokenId: "2",
    price: 2,
    blockScanUrl: "https://blockscan.com/address/2",
  },
];

export default function MyBorrows() {
  const [positions, setPositions] = useState<BorrowPosition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Replace with your actual API endpoint
    const fetchPositions = async () => {
      try {
        // const response = await fetch("/api/positions/lends");
        // const data = await response.json();
        setPositions(mockPositions);
      } catch (error) {
        console.error("Error fetching positions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPositions();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">My Borrowed Positions</h1>

      <ScrollArea className="h-[80vh]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {positions.map((position) => (
            <PositionCard key={position.id} position={position} />
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
