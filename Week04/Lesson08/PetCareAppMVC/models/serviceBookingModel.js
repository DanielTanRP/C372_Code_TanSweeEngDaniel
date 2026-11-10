const connection = require('../config/db');

function createPendingBooking(ownerId, petId, serviceId, bookingDate, callback) {
  const petCheckSql = 'SELECT id FROM pets WHERE id = ? AND owner_id = ?';
  const serviceCheckSql = 'SELECT id, price FROM services WHERE id = ? AND is_active = 1';
  const insertBookingSql = 'INSERT INTO service_bookings (pet_id, service_id, booking_status, booked_price, booking_date) VALUES (?, ?, ?, ?, ?)';
  const insertPaymentSql = 'INSERT INTO payments (booking_id, amount, payment_status) VALUES (?, ?, ?)';

  connection.beginTransaction((beginErr) => {
    if (beginErr) {
      return callback(beginErr);
    }

    connection.query(petCheckSql, [petId, ownerId], (petErr, petRows) => {
      if (petErr) {
        return connection.rollback(() => callback(petErr));
      }

      if (!petRows || petRows.length === 0) {
        return connection.rollback(() => callback(null, null));
      }

      connection.query(serviceCheckSql, [serviceId], (serviceErr, serviceRows) => {
        if (serviceErr) {
          return connection.rollback(() => callback(serviceErr));
        }

        if (!serviceRows || serviceRows.length === 0) {
          return connection.rollback(() => callback(null, null));
        }

        const bookedPrice = serviceRows[0].price;

        connection.query(insertBookingSql, [petId, serviceId, 'pending', bookedPrice, bookingDate], (bookingErr, bookingResult) => {
          if (bookingErr) {
            return connection.rollback(() => callback(bookingErr));
          }

          const bookingId = bookingResult.insertId;

          connection.query(insertPaymentSql, [bookingId, bookedPrice, 'pending'], (paymentErr, paymentResult) => {
            if (paymentErr) {
              return connection.rollback(() => callback(paymentErr));
            }

            connection.commit((commitErr) => {
              if (commitErr) {
                return connection.rollback(() => callback(commitErr));
              }

              return callback(null, {
                bookingId,
                paymentId: paymentResult.insertId
              });
            });
          });
        });
      });
    });
  });
}

function getBookingsByOwner(ownerId, callback) {
  const sql = `
    SELECT
      sb.id AS booking_id,
      sb.booking_date,
      p.name AS pet_name,
      s.name AS service_name,
      sb.booked_price,
      sb.booking_status,
      pay.payment_status
    FROM service_bookings AS sb
    JOIN pets AS p ON p.id = sb.pet_id
    JOIN services AS s ON s.id = sb.service_id
    LEFT JOIN payments AS pay ON pay.booking_id = sb.id
    WHERE p.owner_id = ?
    ORDER BY sb.created_at DESC, sb.id DESC
  `;

  connection.query(sql, [ownerId], callback);
}

module.exports = { createPendingBooking, getBookingsByOwner };
