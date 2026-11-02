# Feature: Prepare payment details
## 1. User goal
As a pet owner, i want to make payment for a pet service
## 2. Scope
Review selected service and amount before payment
Catalogue (ID, name, numeric price):
1, Vaccination, 35
2, Pet Grooming, 50
3, Boarding, 80

Use the server catalogue price. Do not accept a client-supplied payment amount.

## 3. Request
GET /payments/prepare/:serviceId

## 4. Service catalogue
id, service name, price
1, Vaccination, 35
2, pet grooming, 50
3, boarding, 80

## 5. Successful response
HTTP 200 with exactly five JSON fields:
serviceId (number), serviceName (string), amount (number),
currency (string, "sgd"), status (string, "READY_FOR_PAYMENT").

## 6. Unsuccessful response
Unknown service: HTTP 404 with {"error":"Service not found"}.

## 7. Acceptance criteria
AC1: /1 -> 200; Vaccination; amount 35; serviceId 1.
AC2: /2 -> 200; Pet Grooming; amount 50; serviceId 2.
AC3: /3 -> 200; Boarding; amount 80; serviceId 3.
AC4: /999 -> 404; the exact error object above.
AC5: Each success has exactly the five agreed fields,
correct types, catalogue values, "sgd" and "READY_FOR_PAYMENT".
Access: No login required for this classroom mock.
Out of scope: charging money, gateway integration, transactions,
new database tables, EJS pages or changes to existing features.


## 8. Open questions
What has not yet been agreed? Do not silently invent an answer.
