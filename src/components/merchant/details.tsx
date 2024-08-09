import React from 'react';
import { useMerchant } from '../../lib/hooks/merchant';

const MerchantDetails = ({ merchantId }: { merchantId: string }) => {
    const {
        useMerchantOfferings,
        useMerchantInvoices,
        useMerchantCustomers,
        useMerchantPayments
    } = useMerchant()
    const { data: offerings, error: offeringsError, isLoading: offeringsLoading } = useMerchantOfferings(merchantId);
    const { data: invoices, error: invoicesError, isLoading: invoicesLoading } = useMerchantInvoices(merchantId);
    const { data: customers, error: customersError, isLoading: customersLoading } = useMerchantCustomers(merchantId);
    const { data: payments, error: paymentsError, isLoading: paymentsLoading } = useMerchantPayments(merchantId);

    if (offeringsLoading || invoicesLoading || customersLoading || paymentsLoading) {
        return <p>Loading...</p>;
    }

    if (offeringsError || invoicesError || customersError || paymentsError) {
        return <p>Error loading merchant data.</p>;
    }

    return (
        <div>
            <h2>Merchant Offerings</h2>
            <ul>
                {offerings.map((offering: any) => (
                    <li key={offering.id}>{offering.name}</li>
                ))}
            </ul>

            <h2>Merchant Invoices</h2>
            <ul>
                {invoices.map((invoice: any) => (
                    <li key={invoice.id}>{invoice.amount}</li>
                ))}
            </ul>

            <h2>Merchant Customers</h2>
            <ul>
                {customers.map((customer: any) => (
                    <li key={customer.id}>{customer.name}</li>
                ))}
            </ul>

            <h2>Merchant Payments</h2>
            <ul>
                {payments.map((payment: any) => (
                    <li key={payment.id}>{payment.amount}</li>
                ))}
            </ul>
        </div>
    );
};

export default MerchantDetails;