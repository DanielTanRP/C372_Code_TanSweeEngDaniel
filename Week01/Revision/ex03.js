const payments = [
    {petName: "Chester", amount: 50, status: "APPROVED"},
    {petName: "Mochi", amount: 80, status: "PENDING"},
    {petName: "Mira", amount: 40, status: "DECLINED"},
];

// a) Display Mochi's payment status
console.log("Mochi's payment status: " + payments[1].status);

// b) Loop through and display payment details (using for loop)
for (let payment of payments) {
    if (payment.status === "APPROVED") {
        console.log(`Pet-care service for ${payment.petName} confirmed`);
    } else if (payment.status === "PENDING") {
        console.log(`Payment for ${payment.petName} is being processed`);
    } else if (payment.status === "DECLINED") {
        console.log(`Payment for ${payment.petName} unsuccessful`);
    }
}
// b) using forEach method
payments.forEach(payment => {
    if (payment.status === "APPROVED") {
        console.log(`Pet-care service for ${payment.petName} confirmed`);
    } else if (payment.status === "PENDING") {
        console.log(`Payment for ${payment.petName} is being processed`);
    } else if (payment.status === "DECLINED") {
        console.log(`Payment for ${payment.petName} unsuccessful`);
    }   
}); 