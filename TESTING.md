# Testing Guide

## Admin Account Credentials

For testing and development purposes, an admin account has been pre-configured in the application.

### Admin Login
- **Username**: `admin`
- **Password**: `admin`
- **Email**: `admin@example.com`
- **Role**: Administrator

### Test User Account
Additionally, a regular user account is available for testing:

- **Username**: `testuser`
- **Password**: `password123`
- **Email**: `test@example.com`
- **Role**: User

## How to Login

1. Navigate to the `/login` page
2. Enter the credentials above
3. Click "Sign In"

## Admin Capabilities

With the admin account, you can:
- Create, edit, and delete blog posts
- Publish and unpublish blog posts
- Pin blog posts to the top
- Access all administrative features
- Manage site settings (including maintenance mode)

## Notes

- These credentials are for **development/testing purposes only**
- In a production environment, make sure to:
  - Change the default admin password
  - Use strong, unique passwords
  - Enable proper authentication mechanisms
  - Consider implementing two-factor authentication
