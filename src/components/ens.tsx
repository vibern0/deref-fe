import React from "react";
import { useWriteContract, useWalletClient, usePublicClient } from "wagmi";
import { ensNameWrapperABI } from "../network/ensNameWrapperABI";
import { namehash } from "viem";
import { addresses } from "../network/addresses";
import { makeid } from "../utils";
import { Button, Progress } from "@nextui-org/react";

interface Props {
  // Define your component's props here
}

const ENSNameWrapper: React.FC<Props> = () => {
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const { writeContract } = useWriteContract();
  const [submitting, setSubmitting] = React.useState(false);
  const [subStep, setSubStep] = React.useState(0);

  const handleSubmit = () => {
    setSubmitting(true);
    const key = "wid";
    const value = "1234567";
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
      <Button
        color="primary"
        isLoading={submitting}
        disabled={submitting}
        onClick={handleSubmit}
      >
        Submit
      </Button>
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
    </div>
  );
};

export default ENSNameWrapper;
