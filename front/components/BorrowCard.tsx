import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import { type BorrowPosition, type LendPosition } from "@/app/types";
import { Button } from "./ui/button";
import { config } from "@/app/wagmi";
import { writeContract } from "viem/actions";
import { UNILEND_ADDRESS } from "@/config/addresses";
import { unilendABI } from "@/config/abis";
import { toast } from "sonner";

const BorrowCard = ({
  position,
  handleCollect,
}: {
  position: BorrowPosition;
  handleCollect: (tokenId: string) => void;
}) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-xl">Token #{position.tokenId}</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Deadline:</span>
            <span className="font-medium">
              {new Date(Number(position.deadline) * 1000).toLocaleString(
                undefined,
                {
                  timeZoneName: "short",
                }
              )}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Price:</span>
            <span className="font-medium">{position.price} ETH</span>
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

          <Button onClick={() => handleCollect(position.tokenId)}>
            Collect
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BorrowCard;
