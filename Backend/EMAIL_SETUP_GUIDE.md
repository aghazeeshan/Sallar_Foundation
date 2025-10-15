# Email Configuration Guide

## Gmail SMTP Setup (Recommended)

### Step 1: Enable 2-Step Verification
1. Go to https://myaccount.google.com/security
2. Click "2-Step Verification"
3. Follow the steps to enable it

### Step 2: Generate App Password
1. Go to https://myaccount.google.com/apppasswords
2. Select app: "Mail"
3. Select device: "Other (Custom name)"
4. Enter name: "Sallar Foundation"
5. Click "Generate"
6. **Copy the 16-character password** (e.g., abcd efgh ijkl mnop)

### Step 3: Configure in Admin Panel
```
Admin Email: your-email@gmail.com
SMTP Host: smtp.gmail.com
SMTP Port: 587
SMTP User: your-email@gmail.com
SMTP Password: [paste the 16-character app password]
```

---

## Alternative Email Providers

### Outlook/Hotmail
```
SMTP Host: smtp-mail.outlook.com
SMTP Port: 587
SMTP User: your-email@outlook.com
SMTP Password: your-password
```

### Yahoo Mail
```
SMTP Host: smtp.mail.yahoo.com
SMTP Port: 587
SMTP User: your-email@yahoo.com
SMTP Password: [app password]
```

### Custom Domain (cPanel)
```
SMTP Host: mail.yourdomain.com
SMTP Port: 587 (or 465 for SSL)
SMTP User: noreply@yourdomain.com
SMTP Password: your-email-password
```

---

## Email Settings in Admin Panel

### Navigation
1. Login to Admin Panel: `http://localhost:3000/development`
2. Go to **Settings** → **Email** tab

### Configuration Fields

**Admin Email:**
- Email address where you want to receive notifications
- Example: `admin@sallarfoundation.org`

**SMTP Host:**
- Mail server address
- Gmail: `smtp.gmail.com`

**SMTP Port:**
- Usually `587` (TLS) or `465` (SSL)
- Gmail uses: `587`

**SMTP User:**
- Your email address
- Example: `notifications@sallarfoundation.org`

**SMTP Password:**
- For Gmail: Use App Password (16 characters)
- For others: Your email password

### Email Notifications

Enable/Disable automatic emails for:
- ✅ **Donation Emails** - Sent when someone donates
- ✅ **Contact Emails** - Sent when someone fills contact form
- ✅ **Volunteer Emails** - Sent when someone applies as volunteer

---

## Testing Email Configuration

### In Admin Panel
1. Go to Settings → Email
2. Fill in all SMTP details
3. Click "Save Email Settings"
4. Click "Send Test Email"
5. Check your inbox (and spam folder)

### Test Email Format
```
Subject: Test Email - Sallar Foundation
From: Sallar Foundation <your-smtp-user@gmail.com>
To: your-admin-email@gmail.com

This is a test email from Sallar Foundation admin panel.
If you received this, your email configuration is working correctly!
```

---

## Common Issues & Solutions

### Issue 1: "Invalid login" or "Authentication failed"
**Solution:**
- For Gmail: Make sure you're using App Password, not regular password
- Check username is your full email address
- Verify 2-Step Verification is enabled

### Issue 2: "Connection timeout"
**Solution:**
- Check SMTP host and port are correct
- Try port 465 instead of 587
- Check firewall isn't blocking outgoing SMTP

### Issue 3: "Self-signed certificate"
**Solution:**
Add this to SMTP config:
```javascript
tls: {
  rejectUnauthorized: false
}
```

### Issue 4: "Email not received"
**Solution:**
- Check spam/junk folder
- Verify email address is correct
- Check email provider's sending limits

---

## Email Templates

### Donation Confirmation Email
```
Subject: Thank you for your donation!

Dear [Donor Name],

Thank you for your generous donation of [Amount] to Sallar Foundation.

Your contribution will help us continue our mission to support those in need.

Transaction ID: [ID]
Date: [Date]

Best regards,
Sallar Foundation Team
```

### Contact Form Notification
```
Subject: New Contact Form Submission

You have received a new message:

Name: [Name]
Email: [Email]
Phone: [Phone]
Subject: [Subject]

Message:
[Message]
```

### Volunteer Application Notification
```
Subject: New Volunteer Application

New volunteer application received:

Name: [Name]
Email: [Email]
Phone: [Phone]
Skills: [Skills]
Availability: [Availability]

Message:
[Message]
```

---

## Security Best Practices

1. **Use App Passwords** - Never use your main email password
2. **Limit Permissions** - Use dedicated email for notifications
3. **Monitor Activity** - Check email sending logs regularly
4. **Rate Limiting** - Prevent spam by limiting emails per hour
5. **Secure Storage** - Keep SMTP credentials encrypted in database

---

## Gmail Specific Settings

### Allow Less Secure Apps (Alternative method - Not Recommended)
If App Password doesn't work:
1. Go to https://myaccount.google.com/lesssecureapps
2. Turn ON "Allow less secure apps"
3. Use your regular Gmail password

**Note:** This is less secure. Use App Password instead.

### Gmail Sending Limits
- **Free Gmail:** 500 emails/day
- **Google Workspace:** 2,000 emails/day
- Add delay between emails if sending in bulk

---

## Production Deployment

For production, use:

### Option 1: SendGrid (Recommended)
```
SMTP Host: smtp.sendgrid.net
SMTP Port: 587
SMTP User: apikey
SMTP Password: [your-sendgrid-api-key]
```

### Option 2: Mailgun
```
SMTP Host: smtp.mailgun.org
SMTP Port: 587
SMTP User: postmaster@mg.yourdomain.com
SMTP Password: [your-mailgun-password]
```

### Option 3: AWS SES
```
SMTP Host: email-smtp.us-east-1.amazonaws.com
SMTP Port: 587
SMTP User: [your-aws-access-key]
SMTP Password: [your-aws-secret-key]
```

---

## Environment Variables (.env)

Add to Backend/.env:
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
ADMIN_EMAIL=admin@sallarfoundation.org
```

---

## Support

If emails still not working:
1. Check Backend console for error messages
2. Verify MySQL settings table has email data
3. Test SMTP credentials using online tools
4. Contact your email provider support

