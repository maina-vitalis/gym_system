# M-Pesa Sandbox Setup Guide - Fix "Wrong Credentials" Error

## 🚨 Current Issue

You're getting "Wrong credentials" error because your M-Pesa API credentials are invalid or placeholder values.

## ✅ Step-by-Step Solution

### Step 1: Create Safaricom Developer Account

1. Go to [Safaricom Developer Portal](https://developer.safaricom.co.ke/)
2. Click "Sign Up" and create an account
3. Verify your email address
4. Log in to your account

### Step 2: Create a New App

1. Once logged in, go to "My Apps" section
2. Click "Create New App"
3. Fill in the app details:
   - **App Name**: `Gym Management System`
   - **Description**: `Gym membership payment system`
4. **IMPORTANT**: Check ALL the checkboxes for APIs:
   - ✅ Lipa Na M-Pesa Online
   - ✅ M-Pesa Express (STK Push)
   - ✅ Customer to Business (C2B)
   - ✅ Business to Customer (B2C)
   - ✅ Transaction Status
   - ✅ Account Balance
   - ✅ Reversal
5. Click "Create App"

### Step 3: Get Your Credentials

After creating the app, you'll see it listed under "Sandbox Apps":

1. **Consumer Key & Consumer Secret**:

   - Click on your app name
   - Copy the `Consumer Key` and `Consumer Secret`

2. **Get the Passkey**:
   - Go to "APIs" tab
   - Click "Lipa Na M-Pesa Online"
   - Click "Simulate"
   - Select your app from the dropdown on the right
   - Copy the `Passkey` (it will be displayed)

### Step 4: Update Your .env File

Replace the placeholder values in your `.env` file:

```env
# Replace these with your actual credentials:
MPESA_CONSUMER_KEY="your_actual_consumer_key_from_step_3"
MPESA_CONSUMER_SECRET="your_actual_consumer_secret_from_step_3"
MPESA_PASSKEY="your_actual_passkey_from_step_3"

# These sandbox values should work:
MPESA_SHORTCODE="174379"
MPESA_ENVIRONMENT="sandbox"
```

### Step 5: Setup Public Callback URL

Your callback URL must be publicly accessible. For local development:

#### Option A: Using ngrok (Recommended)

```bash
# Install ngrok if you haven't
npm install -g ngrok

# Start your Next.js server
npm run dev

# In another terminal, expose port 3000
ngrok http 3000

# Copy the HTTPS URL (e.g., https://abc123.ngrok.io)
# Update your .env:
MPESA_CALLBACK_URL="https://abc123.ngrok.io/api/payments/callback"
```

#### Option B: Using Cloudflare Tunnel

```bash
# Install cloudflared
# Then run:
cloudflared tunnel --url http://localhost:3000

# Copy the HTTPS URL and update .env
```

### Step 6: Test Your Setup

1. Restart your development server:

   ```bash
   npm run dev
   ```

2. Try the M-Pesa STK Push again
3. Check the console logs for success messages

## 🔍 Common Sandbox Test Numbers

For testing in sandbox, use these Safaricom test numbers:

- `254708374149`
- `254711XXXXXX` (any valid format)

## ✅ Verification Checklist

- [ ] Created Safaricom Developer account
- [ ] Created new app with ALL APIs checked
- [ ] Got actual Consumer Key (not placeholder)
- [ ] Got actual Consumer Secret (not placeholder)
- [ ] Got actual Passkey (not Consumer Secret)
- [ ] Updated .env file with real credentials
- [ ] Setup public callback URL with ngrok/cloudflare
- [ ] Restarted development server
- [ ] Tested with valid Safaricom number

## 🚨 Important Notes

1. **Never use Consumer Secret as Passkey** - they are different values
2. **Callback URL must be HTTPS** in production (HTTP ok for localhost in sandbox)
3. **Credentials are app-specific** - each app has unique credentials
4. **Test in sandbox first** before going to production

## 📞 Still Having Issues?

If you still get "Wrong credentials" after following these steps:

1. **Double-check credentials**: Make sure you copied them correctly
2. **Verify app permissions**: Ensure all APIs are enabled for your app
3. **Check callback URL**: Must be publicly accessible
4. **Try different test number**: Use official Safaricom test numbers
5. **Check logs**: Look for specific error details in console

## 🎯 Expected Success Response

After fixing credentials, you should see:

```
✅ M-Pesa STK Push sent successfully for payment 123
CheckoutRequestID: ws_CO_123456789
```

Instead of:

```
❌ M-Pesa STK Push failed: Wrong credentials
```
