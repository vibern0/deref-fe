import { VerificationLevel, IDKitWidget } from "@worldcoin/idkit";
import { useState } from "react";

const WORLD_ID_APP_ID = import.meta.env.VITE_WLD_APP_ID!;
const WORLD_ID_ACTION_ID = import.meta.env.VITE_WLD_ACTION!;
const VERIFIER_CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDR!;

type Props = {
  signal: string;
};

export const WorldIdWidget = ({ signal }: Props) => {
  const [proof, setProof] = useState<unknown>(null);

  console.log("proof", proof);
  console.log("VERIFIER_CONTRACT_ADDRESS", VERIFIER_CONTRACT_ADDRESS);

  return (
    <IDKitWidget
      app_id={WORLD_ID_APP_ID as `app_${string}`}
      action={WORLD_ID_ACTION_ID}
      signal={signal}
      onSuccess={(proof) => {
        console.log("debug::onSuccess", JSON.stringify(proof));
      }}
      handleVerify={(proof) => {
        console.log("debug::handleVerify", JSON.stringify(proof));
        setProof(proof);
      }}
      verification_level={VerificationLevel.Device}
    >
      {({ open }) => (
        <button className="border border-black rounded-md" onClick={open}>
          <div className="mx-3 my-1">Verify with World ID</div>
        </button>
      )}
    </IDKitWidget>
  );
};
