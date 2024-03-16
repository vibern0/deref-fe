import { useAccount, useDisconnect } from 'wagmi'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import ENSNameWrapper from './components/ens'
import { WorldIdWidget } from "./components/WorldIDWidget";

function App() {
	const account = useAccount()
	const { open } = useWeb3Modal()
	const { disconnect } = useDisconnect()

  if (account.status === "connected") {
    return (
      <div>
        <h2>Account</h2>

        <div>
          status: {account.status}
          <br />
          addresses: {JSON.stringify(account.addresses)}
          <br />
          chainId: {account.chainId}
        </div>

        {account.status === "connected" && (
          <button type="button" onClick={() => disconnect()}>
            Disconnect
          </button>
        )}

				<ENSNameWrapper />
        <WorldIdWidget signal="hoge" />
			</div>
		);
  }
	return <button onClick={() => open()}>Connect</button>
}

export default App;
