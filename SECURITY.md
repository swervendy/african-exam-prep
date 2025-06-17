# Security Policy

## Supported Versions

Use this section to tell people about which versions of your project are currently being supported with security updates.

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security of African Exam Prep seriously. If you believe you have found a security vulnerability, please report it to us as described below.

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report them via email to security@africanexamprep.com.

You should receive a response within 48 hours. If for some reason you do not, please follow up via email to ensure we received your original message.

Please include the requested information listed below (as much as you can provide) to help us better understand the nature and scope of the possible issue:

- Type of issue (buffer overflow, SQL injection, cross-site scripting, etc.)
- Full paths of source file(s) related to the vulnerability
- The location of the affected source code (tag/branch/commit or direct URL)
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit it

This information will help us triage your report more quickly.

## Preferred Languages

We prefer all communications to be in English.

## Policy

African Exam Prep follows the principle of [Responsible Disclosure](https://en.wikipedia.org/wiki/Responsible_disclosure).

## What to expect

After you submit a report, we will:

1. **Acknowledge receipt** of your report within 48 hours
2. **Investigate** the issue and determine its severity
3. **Keep you informed** of our progress
4. **Work on a fix** and release it as soon as possible
5. **Credit you** in our security advisory (unless you prefer to remain anonymous)

## Disclosure Policy

When we receive a security bug report, we will:

1. Confirm the problem and determine the affected versions
2. Audit code to find any similar problems
3. Prepare fixes for all supported versions
4. Release new versions and update documentation
5. Credit the reporter in our security advisory

## Security Best Practices

### For Users

- Keep your dependencies updated
- Use HTTPS in production
- Regularly rotate API keys
- Monitor your application logs
- Use strong, unique passwords
- Enable two-factor authentication where available

### For Developers

- Follow secure coding practices
- Validate all user inputs
- Use parameterized queries to prevent SQL injection
- Implement proper authentication and authorization
- Use HTTPS for all communications
- Keep dependencies updated
- Conduct regular security audits

## Security Features

African Exam Prep includes several security features:

- **Input Validation**: All user inputs are validated and sanitized
- **SQL Injection Protection**: Uses parameterized queries
- **XSS Protection**: Implements Content Security Policy
- **CSRF Protection**: Uses CSRF tokens for form submissions
- **Rate Limiting**: API endpoints are rate-limited
- **Secure Headers**: Implements security headers
- **Environment Variables**: Sensitive data is stored in environment variables

## Updates

This security policy is subject to change. We will notify users of any significant changes via our GitHub repository and email notifications.

## Contact

For security-related questions or concerns, please contact us at security@africanexamprep.com.

---

Thank you for helping keep African Exam Prep secure! 