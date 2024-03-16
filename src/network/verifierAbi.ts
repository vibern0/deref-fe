export default [
  {
    type: "constructor",
    inputs: [
      {
        name: "_worldId",
        type: "address",
        internalType: "contract IWorldID",
      },
      { name: "_appId", type: "string", internalType: "string" },
      { name: "_actionId", type: "string", internalType: "string" },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "verifyAndExecute",
    inputs: [
      { name: "signal", type: "address", internalType: "address" },
      { name: "root", type: "uint256", internalType: "uint256" },
      {
        name: "nullifierHash",
        type: "uint256",
        internalType: "uint256",
      },
      { name: "proof", type: "uint256[8]", internalType: "uint256[8]" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  { type: "error", name: "InvalidNullifier", inputs: [] },
];