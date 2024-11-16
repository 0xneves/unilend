import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import { type BorrowPosition, type LendPosition } from "@/app/types";
import { Button } from "./ui/button";
import { useAccount } from "wagmi";
import { unilendABI } from "@/config/abis";
import { UNILEND_ADDRESS } from "@/config/addresses";
import { writeContract } from "@wagmi/core";
import { config } from "@/app/wagmi";
import { toast } from "sonner";
import { formatEther } from "viem";

const LendCard = ({ position }: { position: LendPosition }) => {
  const cancelLend = async (tokenId: string) => {
    try {
      const tx = await writeContract(config, {
        address: UNILEND_ADDRESS,
        abi: unilendABI,
        functionName: "cancelLend",
        args: [tokenId],
      });

      if (tx) {
        toast.success("Lend cancelled");
      }
    } catch (error) {
      toast.error("Error cancelling lend");
    }
  };

  const claimPosition = async (tokenId: string) => {
    try {
      const tx = await writeContract(config, {
        address: UNILEND_ADDRESS,
        abi: unilendABI,
        functionName: "claimPosition",
        args: [tokenId],
      });

      if (tx) {
        toast.success("Position claimed");
      }
    } catch (error) {
      toast.error("Error claiming position");
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-xl">Token #{position.tokenId}</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Duration:</span>
            <span className="font-medium">{`${position.time} seconds`}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Price:</span>
            <span className="font-medium">{`${formatEther(position.price)} ETH`}</span>
          </div>

          <a
            href={position.blockscoutUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 text-primary hover:underline mt-2"
          >
            View on Blockscout
            <ExternalLink size={16} />
          </a>
        </div>
        <div className="flex justify-center gap-6 mt-4">
          <Button onClick={() => cancelLend(position.tokenId)}>Cancel</Button>
          <Button onClick={() => claimPosition(position.tokenId)}>Claim</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LendCard;
