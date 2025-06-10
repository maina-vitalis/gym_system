# M-Pesa STK Push Integration Guide

## Overview

This gym management system includes a complete production-ready M-Pesa STK Push integration that allows gym administrators to send payment requests directly to customers' phones through Safaricom's M-Pesa service.

## Features

✅ **Complete M-Pesa Integration**

- Real-time STK Push requests to customer phones
- Automatic payment status tracking and updates
- M-Pesa callback handling for payment confirmations
- Support for both sandbox and production environments
- Comprehensive error handling and validation

✅ **Safaricom Number Validation**

- Validates all Safaricom prefixes (701-709, 110-115, 790-799)
- Supports multiple phone number formats
- Real-time validation feedback in UI

✅ **Production Features**

- OAuth token management
- Proper M-Pesa API authentication
- Transaction status querying
- Automatic payment record creation and updates
- Audit logging and error tracking

## Setup Instructions

### 1. M-Pesa Developer Account Setup

1. Visit [Safaricom Developer Portal](https://developer.safaricom.co.ke/)
2. Create an account and register your application
3. Create a new app and select "Lipa Na M-Pesa Online"
4. Note down your credentials:
   - Consumer Key
   - Consumer Secret
   - Business Short Code (Paybill or Till Number)
   - Lipa Na M-Pesa Online Passkey

### 2. Environment Configuration

Update your `.env` file with M-Pesa credentials:

```env
# M-Pesa Configuration (Required)
MPESA_ENVIRONMENT="sandbox"  # Change to "production" when ready
MPESA_CONSUMER_KEY="your_consumer_key_here"
MPESA_CONSUMER_SECRET="your_consumer_secret_here"
MPESA_SHORTCODE="your_business_shortcode_here"
MPESA_PASSKEY="your_lipa_na_mpesa_passkey_here"
MPESA_CALLBACK_URL="https://yourdomain.com/api/payments/callback"

# Optional M-Pesa Configuration
MPESA_TIMEOUT_URL="https://yourdomain.com/api/payments/timeout"
MPESA_RESULT_URL="https://yourdomain.com/api/payments/result"
MPESA_ACCOUNT_REFERENCE="GYM"
MPESA_TRANSACTION_DESC="Gym Membership Payment"

# Business Information
BUSINESS_NAME="Gym Management System"
BUSINESS_SHORT_NAME="GymMS"
```

### 3. Callback URL Setup

**Important**: The callback URL must be publicly accessible and use HTTPS in production.

For development, you can use tools like:

- [ngrok](https://ngrok.com/) to expose localhost
- [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/)

Example with ngrok:

```bash
ngrok http 3000
# Use the HTTPS URL: https://abc123.ngrok.io/api/payments/callback
```

### 4. Testing

#### Sandbox Testing

- Use the sandbox environment for testing
- Safaricom provides test numbers for simulation
- All transactions are simulated (no real money)

#### Production Deployment

1. Change `MPESA_ENVIRONMENT` to "production"
2. Use real business credentials
3. Ensure callback URL is publicly accessible with HTTPS
4. Test with small amounts first

## API Endpoints

### 1. Send STK Push

**POST** `/api/payments/push`

```json
{
  "memberId": "member_id",
  "amount": 1000,
  "phoneNumber": "254712345678",
  "description": "Monthly membership"
}
```

### 2. Check Payment Status

**POST** `/api/payments/status`

```json
{
  "checkoutRequestId": "ws_CO_123456789"
}
```

### 3. M-Pesa Callback (Automatic)

**POST** `/api/payments/callback`

This endpoint receives automatic notifications from M-Pesa when payments are completed.

### 4. Health Check

**GET** `/api/payments/push`

Returns service status and configuration info.

## Usage Workflow

1. **Admin selects member** in payment form
2. **Admin enters payment amount** and description
3. **Admin clicks "Send Push"** - opens M-Pesa modal
4. **Admin enters customer's Safaricom number**
5. **System validates** phone number in real-time
6. **STK Push sent** to customer's phone
7. **Customer enters M-Pesa PIN** on their phone
8. **Automatic confirmation** updates payment in system
9. **Admin can record payment** with auto-filled transaction reference

## Error Handling

The system handles various M-Pesa error scenarios:

- **Invalid phone numbers**: Real-time validation prevents invalid requests
- **Insufficient funds**: Proper error messages displayed
- **User cancellation**: Status updated automatically
- **Network issues**: Retry mechanisms and error logging
- **API failures**: Graceful degradation with manual fallback

## Security Features

✅ **Environment Variables**: All credentials stored securely
✅ **OAuth Authentication**: Proper M-Pesa API authentication
✅ **Input Validation**: Comprehensive validation on all inputs
✅ **Error Logging**: Detailed logging without exposing sensitive data
✅ **HTTPS Requirements**: Callback URLs must use HTTPS in production

## Monitoring & Logging

The system provides comprehensive logging:

```bash
# Success logs
✅ M-Pesa STK Push sent successfully for payment 123
📞 M-Pesa Callback received
✅ Payment successful for John Doe

# Error logs
❌ M-Pesa STK Push failed: Invalid phone number
⚠️ No pending payment found for CheckoutRequestID
❌ M-Pesa Callback Error: Database connection failed
```

## Production Checklist

- [ ] M-Pesa developer account created and verified
- [ ] App registered with Safaricom
- [ ] Production credentials obtained
- [ ] Callback URL publicly accessible with HTTPS
- [ ] Environment variables properly set
- [ ] Test transactions completed successfully
- [ ] Error handling tested
- [ ] Logging and monitoring configured
- [ ] Backup payment methods available

## Common Issues & Solutions

### 1. "M-Pesa service not configured"

**Solution**: Check environment variables are set correctly

### 2. "Invalid phone number format"

**Solution**: Ensure phone number is a valid Safaricom number (701-709, 110-115, 790-799)

### 3. "Callback URL not accessible"

**Solution**: Ensure callback URL is publicly accessible and uses HTTPS

### 4. "OAuth failed"

**Solution**: Verify consumer key and secret are correct

### 5. "Transaction timeout"

**Solution**: Customer may have cancelled or there's a network issue

## Support

For M-Pesa API issues:

- [Safaricom Developer Documentation](https://developer.safaricom.co.ke/docs)
- [M-Pesa API Reference](https://developer.safaricom.co.ke/lipa-na-m-pesa-online/apis/post/stkpush/v1/processrequest)

For system issues:

- Check application logs
- Verify environment configuration
- Test with sandbox environment first

## Environment URLs

### Sandbox

- OAuth: `https://sandbox.safaricom.co.ke/oauth/v1/generate`
- STK Push: `https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest`
- Query: `https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query`

### Production

- OAuth: `https://api.safaricom.co.ke/oauth/v1/generate`
- STK Push: `https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest`
- Query: `https://api.safaricom.co.ke/mpesa/stkpushquery/v1/query`

---

**Note**: This integration is production-ready but requires proper M-Pesa credentials and callback URL setup. Always test thoroughly in sandbox environment before going live.
