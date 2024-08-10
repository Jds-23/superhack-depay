import React, { useState } from 'react';
import { useInvoice, CreateInvoiceType } from '@/lib/hooks/invoice'; // Adjust the import path as necessary

const InvoiceComponent = () => {
    const { useFetchInvoiceById, useCreateInvoice } = useInvoice();
    const [invoiceId, setInvoiceId] = useState<number | null>(null);
    const [newInvoice, setNewInvoice] = useState<CreateInvoiceType>({
        offering: {
            price: '1000',
            metadata: {
                name: 'Offering Name',
                description: 'Offering Description',
            },
            stock: 10,
            isUnlimited: false,
            merchantId: 'merchant1',
        },
        customer: {
            walletAddress: '0x123',
            email: 'customer@example.com',
            metadata: {
                name: 'Customer Name',
            },
        },
        date: new Date().toISOString(),
        customerId: undefined,
        offeringId: undefined,
    });

    const { data, error, isLoading } = useFetchInvoiceById(invoiceId!);
    const createInvoiceMutation = useCreateInvoice();

    const handleCreateInvoice = async () => {
        try {
            await createInvoiceMutation.mutateAsync(newInvoice);
            alert('Invoice created successfully!');
        } catch (err: any) {
            alert(err.message);
        }
    };

    return (
        <div>
            <h1>Fetch Invoice</h1>
            <input
                type="number"
                value={invoiceId || ''}
                onChange={(e) => setInvoiceId(Number(e.target.value))}
                placeholder="Enter invoice ID"
            />
            <button onClick={() => invoiceId && useFetchInvoiceById(invoiceId)}>Fetch Invoice</button>

            {isLoading && <p>Loading...</p>}
            {error && <p>Error: {error.message}</p>}
            {data && (
                <div>
                    <h2>Invoice Details</h2>
                    {/* <p>Customer ID: {data.customer}</p> */}
                    {/* <p>Offering ID: {data.offeringId}</p> */}
                    <p>Date: {data.date}</p>
                </div>
            )}

            <h1>Create Invoice with New Offering and Customer</h1>

            <h2>Customer Information</h2>
            <input
                type="text"
                value={newInvoice.customerId || ''}
                onChange={(e) => setNewInvoice({ ...newInvoice, customerId: e.target.value })}
                placeholder="Customer ID"
            />
            {
                // show the input fields if customer ID is not provided
                !newInvoice.customerId || newInvoice.customerId.length === 0 && (
                    <>
                        <input
                            type="text"
                            value={newInvoice.customer?.walletAddress || ''}
                            onChange={(e) => setNewInvoice({ ...newInvoice, customer: { ...newInvoice.customer, walletAddress: e.target.value } })}
                            placeholder="Customer Wallet Address"
                        />
                        {/* <input
                            type="email"
                            value={newInvoice.customer?.email || ''}
                            onChange={(e) => setNewInvoice({ ...newInvoice, customer: { ...newInvoice.customer, email: e.target.value } })}
                            placeholder="Customer Email"
                        />
                        <input
                            type="text"
                            value={newInvoice.customer?.metadata.name || ''}
                            onChange={(e) => setNewInvoice({ ...newInvoice, customer: { ...newInvoice.customer, metadata: { ...newInvoice.customer.metadata, name: e.target.value } } })}
                            placeholder="Customer Name"
                        /> */}
                    </>
                )
            }

            <h2>Offering Information</h2>
            <input
                type="text"
                value={newInvoice.offering?.metadata.name || ''}
                onChange={(e) => setNewInvoice({ ...newInvoice, offering: { ...newInvoice.offering, price: newInvoice.offering?.price ?? "", metadata: { ...newInvoice.offering?.metadata, name: e.target.value } } as any })}
                placeholder="Offering Name"
            />
            <input
                type="text"
                value={newInvoice.offering?.metadata.description || ''}
                onChange={(e) => setNewInvoice({ ...newInvoice, offering: { ...newInvoice.offering, metadata: { ...newInvoice.offering?.metadata, description: e.target.value } } as any })}
                placeholder="Offering Description"
            />
            <input
                type="text"
                value={newInvoice.offering?.price || ''}
                onChange={(e) => setNewInvoice({ ...newInvoice, offering: { ...newInvoice.offering, price: e.target.value } as any })}
                placeholder="Offering Price"
            />


            <button onClick={handleCreateInvoice}>Create Invoice</button>
        </div>
    );
};

export default InvoiceComponent;