import { VerificationLevel, IDKitWidget } from "@worldcoin/idkit";

const WORLD_ID_APP_ID = import.meta.env.VITE_WLD_APP_ID!;
const WORLD_ID_ACTION_ID = import.meta.env.VITE_WLD_ACTION!;

type Props = {
  signal: string;
  onProofGenerated: (proof: {
    merkle_root: string;
    nullifier_hash: string;
    proof: string;
  }) => void;
};

export const WorldIdWidget = ({ signal, onProofGenerated }: Props) => {
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
        onProofGenerated(proof);
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
