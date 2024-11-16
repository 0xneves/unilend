import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { unichainSepolia } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "Unilend",
  projectId: "0x00",
  chains: [unichainSepolia],
  ssr: true,
});
