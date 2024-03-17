import React, { useEffect, useState } from "react";
import { useWriteContract, useWalletClient, usePublicClient } from "wagmi";
import { ensNameWrapperABI } from "../network/ensNameWrapperABI";
import { namehash } from "viem";
import { addresses } from "../network/addresses";
import { makeid } from "../utils";
import { Button, Progress, Input } from "@nextui-org/react";
import { useIndexedDB } from "react-indexed-db-hook";

interface Props {
  // Define your component's props here
}

const Home: React.FC<Props> = () => {
  const db = useIndexedDB("worldcoin");
  const dbReferrals = useIndexedDB("referrals");
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const { writeContract } = useWriteContract();
  const [submitting, setSubmitting] = React.useState(false);
  const [subStep, setSubStep] = React.useState(0);
  const [hasEntry, setHasEntry] = useState(false);
  const [rootHash, setRootHash] = useState<string>("");
  const [referralCodes, setReferralCodes] = useState<string[]>([]);

  useEffect(() => {
    db.getAll().then((wc) => {
      setHasEntry(wc.length > 0);
      setRootHash(wc[0]?.merkle_root);
    });
    dbReferrals.getAll().then((ref) => {
      setReferralCodes(ref.map((r) => r.code));
    });
  }, []);

  if (!hasEntry) {
    return <p>You have not verified World ID</p>;
  }

  const handleSubmit = () => {
    setSubmitting(true);
    const key = "worldcoin";
    const value = rootHash;
    //
    const referralCode = makeid(6);
    //
    const parentNode = namehash("cat.eth");
    const node = namehash(`${referralCode}.cat.eth`);
    //
    writeContract(
      {
        abi: ensNameWrapperABI,
        address: addresses.ensResolverWrapper,
        functionName: "setSubnodeRecord",
        args: [
          addresses.nameWrapper,
          parentNode,
          referralCode,
          addresses.ensNameOwnerAddress,
          addresses.ensResolver,
          0n,
          0,
          0n,
        ],
        account: walletClient!.account,
      },
      {
        onSettled: async (data) => {
          await publicClient!.waitForTransactionReceipt({
            hash: data!,
          });
          setSubStep(1);

          writeContract(
            {
              abi: ensNameWrapperABI,
              address: addresses.ensResolverWrapper,
              functionName: "setText",
              args: [addresses.ensResolver, node, key, value],
              account: walletClient!.account,
            },
            {
              onSettled: async (data) => {
                await publicClient!.waitForTransactionReceipt({
                  hash: data!,
                });
                dbReferrals.add({ code: referralCode });
                setSubmitting(false);
                setSubStep(0);
              },
              onError: () => {
                setSubmitting(false);
                setSubStep(0);
              },
            }
          );
        },
        onError: () => {
          setSubmitting(false);
          setSubStep(0);
        },
      }
    );
  };

  return (
    <div
      style={{
        margin: "3%",
      }}
    >
      <h1>Generate Referral</h1>
      <Button
        color="primary"
        isLoading={submitting}
        disabled={submitting}
        onClick={handleSubmit}
      >
        Generate
      </Button>
      {referralCodes.length > 0 && (
        <>
          <br />
          <br />
          <h1>Referral Codes</h1>
        </>
      )}
      <ul>
        {referralCodes.map((code) => (
          <li key={code}>{code}</li>
        ))}
      </ul>
      {submitting && (
        <>
          <br />
          <br />
          <Progress
            isStriped
            aria-label="Loading..."
            color="secondary"
            value={subStep * 50}
            className="max-w-md"
          />
        </>
      )}
      <br />
      <br />
      <h1>Use Referral</h1>
      <Input type="text" label="Referral" placeholder="Use a referral code" />
    </div>
  );
};

export default Home;
