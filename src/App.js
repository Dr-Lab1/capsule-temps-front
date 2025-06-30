import React, { useEffect, useState } from "react";
import { connectContract } from "./components/ContractAccess";

function App() {
  const [capsule, setCapsule] = useState(null);

  useEffect(() => {
    (async () => {
      const contract = await connectContract();
      const data = await contract.getCapsule(0); // Ex: token ID 0
      setCapsule(data);
    })();
  }, []);

  return (
    <div>
      <h1>Capsule Viewer</h1>
      {capsule ? <pre>{JSON.stringify(capsule, null, 2)}</pre> : "Chargement..."}
    </div>
  );
}

export default App;
