import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import { type LendPosition } from "@/app/types";

const PositionCard = ({ position }: { position: LendPosition }) => {
  return (
    <Card key={position.id} className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-xl">Token #{position.tokenId}</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Duration:</span>
            <span className="font-medium">{position.duration} days</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Price:</span>
            <span className="font-medium">{position.price} ETH</span>
          </div>

          <a
            href={position.blockScanUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 text-primary hover:underline mt-2"
          >
            View on BlockScan
            <ExternalLink size={16} />
          </a>
        </div>
      </CardContent>
    </Card>
  );
};

export default PositionCard;
