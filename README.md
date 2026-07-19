# Affiliate Payout Management System

A simple backend REST API built using **Node.js**, **Express.js**, **MongoDB**, and **Mongoose** to simulate an affiliate payout management system.

The system allows affiliates to earn commissions from sales, receive advance payouts, request withdrawals, and process payout results.

---

## Features

- Create affiliate sales
- View all sales
- Pay 10% advance commission
- Approve or reject sales
- Request withdrawal
- Process withdrawal status
- Automatic refund if withdrawal fails
- MongoDB transactions for data consistency
- Input validation and error handling

---

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose

---

## Project Structure

```
server/
│── config/
│── controllers/
│── models/
│── routes/
│── server.js
│── package.json
│── README.md
```

---

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
```

### 2. Go to the project folder

```bash
cd server
```

### 3. Install dependencies

```bash
npm install
```

### 4. Create a `.env` file

```env
PORT=4000
MONGO_URI=your_mongodb_connection_string
```

### 5. Start the server

```bash
npm run dev
```

---

# API Endpoints

## 1. Create Sale

**POST**

```
/sales
```

Request

```json
{
  "userId": "john_doe",
  "brand": "Nike",
  "earning": 100
}
```

---

## 2. Get All Sales

**GET**

```
/sales
```

Returns all sales.

---

## 3. Advance Payout

**POST**

```
/payouts/advance
```

Calculates **10% advance commission** for all pending sales and adds it to the user's withdrawable balance.

---

## 4. Update Sale Status

**PATCH**

```
/sales/:saleId/status
```

Request

```json
{
  "status": "approved"
}
```

Allowed values:

- approved
- rejected

**Approved**

- Remaining commission is added to the user's balance.

**Rejected**

- Previously paid advance commission is deducted.

---

## 5. Request Withdrawal

**POST**

```
/withdrawals
```

Request

```json
{
  "userId": "john_doe",
  "amount": 50
}
```

Rules:

- User must exist
- User must have sufficient balance
- Only one withdrawal every 24 hours

---

## 6. Update Withdrawal Status

**PATCH**

```
/withdrawals/:withdrawalId/status
```

Request

```json
{
  "status": "success"
}
```

Allowed values:

- success
- failed
- cancelled
- rejected

If the withdrawal fails, the withdrawn amount is automatically refunded to the user's balance.

---

# Database Models

### User

```js
{
  (userId, withdrawableBalance, lastWithdrawalAt);
}
```

### Sale

```js
{
  (userId, brand, earning, advancePaid, advanceAmount, status);
}
```

### Withdrawal

```js
{
  (userId, amount, status);
}
```

---

# Business Flow

```
Create Sale
      ↓
Advance Payout (10%)
      ↓
Approve / Reject Sale
      ↓
Request Withdrawal
      ↓
Process Withdrawal Status
      ↓
Success → Completed

Failed / Rejected / Cancelled
      ↓
Refund User
```

---

# Error Handling

The API validates:

- Missing or invalid input
- Invalid user
- Invalid sale
- Invalid withdrawal
- Invalid status
- Insufficient balance
- Duplicate processing
- 24-hour withdrawal restriction

---

# Future Improvements

- Authentication & Authorization
- Payment gateway integration (e.g. Razorpay)
- Pagination and filtering
- Unit testing
- Docker support

---

## Author

**Abdur Rahman**

GitHub: https://github.com/abdurrahmancodes1
