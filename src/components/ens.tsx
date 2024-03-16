import React from "react";
import {
    type BaseError,
    useWriteContract,
    useWalletClient,
    useWaitForTransactionReceipt,
    usePublicClient,
} from "wagmi";
import { contractAbi } from "../network/contractAbi";
import { namehash } from "viem";
import { addresses } from "../network/addresses";

// biome-ignore lint/suspicious/noEmptyInterface: <explanation>
interface Props {
    // Define your component's props here
}

function makeid(length: number) {
    let result = '';
    const characters = 'abcdef0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ENSNameWrapper: React.FC<Props> = (_props) => {
    const { data: walletClient } = useWalletClient();
    const publicClient = usePublicClient();
    const { data: hash, error, isPending, writeContract } = useWriteContract();

    const handleSubmit = () => {
        // wid key<>value
        const key = "wid";
        const value = "1234567";
        const referralCode = makeid(6);
        //
        const parentNode = namehash("cat.eth");
        const node = namehash(`${referralCode}.cat.eth`);
        //
        writeContract(
            {
                abi: contractAbi,
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
                // biome-ignore lint/style/noNonNullAssertion: <explanation>
                account: walletClient!.account,
            },
            {
                onSettled: async (data) => {
                    console.log("onSettled", data);

                    // NOTE: this takes a long time to resolve
                    const tx = await publicClient.waitForTransactionReceipt({
                        hash: data!,
                    });

                    console.log("tx", tx);

                    writeContract(
                        {
                            abi: contractAbi,
                            address: addresses.ensResolverWrapper,
                            functionName: "setText",
                            args: [addresses.ensResolver, node, key, value],
                            // biome-ignore lint/style/noNonNullAssertion: <explanation>
                            account: walletClient!.account,
                        },
                        {
                            onSettled: (data) => {
                                console.log("onSettled", data);
                            },
                            onSuccess: (data) => {
                                console.log("onSuccess", data);
                            },
                            onError: (error) => {
                                console.log("onError", error);
                            },
                        }
                    );
                },
                onSuccess: (data) => {
                    console.log("onSuccess", data);
                },
                onError: (error) => {
                    console.log("onError", error);
                },
            }
        );
    };

    const { isLoading: isConfirming, isSuccess: isConfirmed } =
        useWaitForTransactionReceipt({
            hash,
        });

    return (
        <div>
            {/* Render your component's content here */}
            <button disabled={isPending} type="submit" onClick={handleSubmit}>
                Submit
            </button>

            {hash && <div>Transaction Hash: {hash}</div>}
            {isConfirming && <div>Waiting for confirmation...</div>}
            {isConfirmed && <div>Transaction confirmed.</div>}
            {error && (
                <div>Error: {(error as BaseError).shortMessage || error.message}</div>
            )}
        </div>
    );
};

export default ENSNameWrapper;
