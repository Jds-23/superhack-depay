// import { CreateMerchantParams, useMerchant } from '@/lib/hooks/merchant';
// import React, { useState } from 'react';

// const MerchantComponent = () => {
//     const { useFetchMerchantById, useCreateMerchant } = useMerchant();
//     const [merchantId, setMerchantId] = useState<string>('nnini');
//     const [newMerchant, setNewMerchant] = useState<CreateMerchantParams>({
//         id: '',
//         baseToken: { symbol: 'ETH', decimals: 18, chainId: "1", address: "0x" },
//         metadata: { name: '', description: '' },
//         walletAddress: '',
//     });

//     const { data, error, isLoading } = useFetchMerchantById(merchantId);
//     const createMerchantMutation = useCreateMerchant();

//     const handleCreateMerchant = async () => {
//         try {
//             await createMerchantMutation.mutateAsync(newMerchant);
//             alert('Merchant created successfully!');
//         } catch (err: any) {
//             alert(err.message);
//         }
//     };

//     return (
//         <div>
//             <h1>Fetch Merchant</h1>
//             <input
//                 type="text"
//                 value={merchantId}
//                 onChange={(e) => setMerchantId(e.target.value)}
//                 placeholder="Enter merchant ID"
//             />

//             {isLoading && <p>Loading...</p>}
//             {error && <p>Error: {error.message}</p>}
//             {data && (
//                 <div>
//                     <h2>Merchant Details</h2>
//                     <p>Name: {data.metadata.name}</p>
//                     <p>Description: {data.metadata.description}</p>
//                     <p>Wallet Address: {data.walletAddress}</p>
//                 </div>
//             )}

//             <h1>Create Merchant</h1>
//             <input
//                 type="text"
//                 value={newMerchant.id}
//                 onChange={(e) => setNewMerchant({ ...newMerchant, id: e.target.value })}
//                 placeholder="Merchant ID"
//             />
//             <input
//                 type="text"
//                 value={newMerchant.metadata.name}
//                 onChange={(e) => setNewMerchant({ ...newMerchant, metadata: { ...newMerchant.metadata, name: e.target.value } })}
//                 placeholder="Name"
//             />
//             <input
//                 type="text"
//                 value={newMerchant.metadata.description}
//                 onChange={(e) =>
//                     setNewMerchant({ ...newMerchant, metadata: { ...newMerchant.metadata, description: e.target.value } })
//                 }
//                 placeholder="Description"
//             />
//             <input
//                 type="text"
//                 value={newMerchant.walletAddress}
//                 onChange={(e) => setNewMerchant({ ...newMerchant, walletAddress: e.target.value })}
//                 placeholder="Wallet Address"
//             />
//             <button onClick={handleCreateMerchant}>Create Merchant</button>
//         </div>
//     );
// };

// export default MerchantComponent;