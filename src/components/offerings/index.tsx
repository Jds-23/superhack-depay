import React, { useState } from 'react';
import { CreateOfferingParams, useOffering } from '../../lib/hooks/useOfferings';

const OfferingComponent = () => {
    const { useFetchOfferingById, useCreateOffering } = useOffering();
    const [offeringId, setOfferingId] = useState<number | null>(null);
    const [newOffering, setNewOffering] = useState<CreateOfferingParams>({
        metadata: { name: '', description: '' },
        price: '1000',
        customToken: { symbol: 'ETH', decimals: 18, address: '0x', chainId: '1' },
        stock: 10,
        isUnlimited: false,
        isLive: true,
        merchantId: 'nnini',
    });

    const { data, error, isLoading } = useFetchOfferingById(offeringId!);
    const createOfferingMutation = useCreateOffering();

    const handleCreateOffering = async () => {
        try {
            await createOfferingMutation.mutateAsync(newOffering);
            alert('Offering created successfully!');
        } catch (err: any) {
            alert(err.message);
        }
    };

    return (
        <div>
            <h1>Fetch Offering</h1>
            <input
                type="number"
                value={offeringId || ''}
                onChange={(e) => setOfferingId(Number(e.target.value))}
                placeholder="Enter offering ID"
            />


            {isLoading && <p>Loading...</p>}
            {error && <p>Error: {error.message}</p>}
            {data && (
                <div>
                    <h2>Offering Details</h2>
                    <p>Name: {data.metadata.name}</p>
                    <p>Description: {data.metadata.description}</p>
                    <p>Price: {data.price.toString()}</p>
                </div>
            )}

            <h1>Create Offering</h1>
            {/* Form for creating a new offering */}
            <input
                type="text"
                value={newOffering.metadata.name}
                onChange={(e) => setNewOffering({ ...newOffering, metadata: { ...newOffering.metadata, name: e.target.value } })}
                placeholder="Name"
            />
            <input
                type="text"
                value={newOffering.metadata.description}
                onChange={(e) =>
                    setNewOffering({ ...newOffering, metadata: { ...newOffering.metadata, description: e.target.value } })
                }
                placeholder="Description"
            />
            {/* Add more fields for price, stock, etc. */}
            <button onClick={handleCreateOffering}>Create Offering</button>
        </div>
    );
};

export default OfferingComponent;