import React from 'react';

type InvoiceCreatedEmailParams ={
  firstName:string;
  seller:string;
  amount:string;
  formattedDueDate:string;
  receiverEmail?:string;
  link: string;
}

const InvoiceCreatedEmail = ({ firstName, seller, amount, formattedDueDate, link }: InvoiceCreatedEmailParams) => (
  <div style={{
    fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
    lineHeight: 1.5,
    color: '#020817',
    backgroundColor: '#ffffff',
    maxWidth: '600px',
    margin: '0 auto',
    padding: '24px'
  }}>
    <div style={{
      backgroundColor: '#f4f4f5',
      borderRadius: '8px',
      padding: '24px',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
    }}>
      <h1 style={{
        color: '#18181b',
        fontSize: '24px',
        fontWeight: '700',
        marginBottom: '16px'
      }}>Invoice Created</h1>
      
      <p style={{ fontSize: '16px', marginBottom: '16px' }}>Hey {firstName},</p>
      
      <p style={{ fontSize: '16px', marginBottom: '16px' }}>
        <strong>{seller}</strong> sent you an invoice for <strong>{amount} USDC</strong>
      </p>
      
      <p style={{ fontSize: '16px', marginBottom: '24px' }}>
        <strong>Due date:</strong> {formattedDueDate}
      </p>
      
      <a href={link} style={{
        display: 'inline-block',
        backgroundColor: '#18181b',
        color: '#ffffff',
        padding: '10px 16px',
        textDecoration: 'none',
        borderRadius: '6px',
        fontWeight: '500',
        fontSize: '14px',
        textAlign: 'center',
        transition: 'background-color 0.2s ease-in-out'
      }}>
        Stream Funds
      </a>
      
      <p style={{
        fontSize: '14px',
        color: '#71717a',
        marginTop: '24px',
        borderTop: '1px solid #e4e4e7',
        paddingTop: '16px'
      }}>
        If you have any questions, please don't hesitate to contact us. At support@streambill.xyz
      </p>

      <p style={{
        fontSize: '14px',
        color: '#71717a',
        marginTop: '24px',
        borderTop: '1px solid #e4e4e7',
        paddingTop: '16px'
      }}>
        *Please don't reply to this email
      </p>
    </div>
  </div>
);

export default InvoiceCreatedEmail;