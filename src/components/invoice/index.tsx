import { CreateInvoiceParams, useInvoice } from '@/lib/hooks/invoice';
import React, { useState } from 'react';

const InvoiceComponent = () => {
    const { useFetchInvoiceById, useCreateInvoice } = useInvoice();
    const [invoiceId, setInvoiceId] = useState<number | null>(null);
    const [newInvoice, setNewInvoice] = useState<CreateInvoiceParams>({
        offeringId: 1,
        customerId: 1,
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
            <button onClick={() => invoiceId && useFetchInvoiceById(invoiceId)}>
                Fetch Invoice
            </button>

            {isLoading && <p>Loading...</p>}
            {error && <p>Error: {error.message}</p>}
            {data && (
                <div>
                    <h2>Invoice Details</h2>
                    <p>Date: {data.date}</p>
                    <p>Paid: {data.paid ? 'Yes' : 'No'}</p>
                    {/* Render more invoice details here */}
                </div>
            )}

            <h1>Create Invoice</h1>
            {/* Form for creating a new invoice */}
            <input
                type="number"
                value={newInvoice.offeringId}
                onChange={(e) => setNewInvoice({ ...newInvoice, offeringId: Number(e.target.value) })}
                placeholder="Offering ID"
            />
            <input
                type="number"
                value={newInvoice.customerId}
                onChange={(e) => setNewInvoice({ ...newInvoice, customerId: Number(e.target.value) })}
                placeholder="Customer ID"
            />
            <button onClick={handleCreateInvoice}>Create Invoice</button>
        </div>
    );
};

export default InvoiceComponent;