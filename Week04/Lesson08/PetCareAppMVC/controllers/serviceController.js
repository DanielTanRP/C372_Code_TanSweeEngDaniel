const Pet = require('../models/petModel');
const Service = require('../models/serviceModel');
const ServiceBooking = require('../models/serviceBookingModel');

function getLocalToday() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function isValidDateString(dateString) {
  if (typeof dateString !== 'string') {
    return false;
  }

  const match = /^\d{4}-\d{2}-\d{2}$/.test(dateString);
  if (!match) {
    return false;
  }

  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  if (
    Number.isNaN(date.getTime()) ||
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return false;
  }

  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const selectedDate = new Date(year, month - 1, day);

  return selectedDate >= startOfToday;
}

function listServices(req, res) {
  const ownerId = req.session.user.id;
  let selectedPetId = req.query.petId;

  Pet.getByOwner(ownerId, (petErr, pets) => {
    if (petErr) {
      console.error('Error loading pets for service booking:', petErr);
      return res.status(500).send('Unable to load pets.');
    }

    const ownedMatch = Array.isArray(pets)
      ? pets.find((pet) => String(pet.id) === String(selectedPetId))
      : null;

    if (!ownedMatch) {
      selectedPetId = '';
    }

    Service.getActiveServices((serviceErr, services) => {
      if (serviceErr) {
        console.error('Error loading services for service booking:', serviceErr);
        return res.status(500).send('Unable to load services.');
      }

      return res.render('services', {
        pets: pets || [],
        services: services || [],
        selectedPetId: selectedPetId || '',
        today: getLocalToday(),
        messages: req.flash('success'),
        errors: req.flash('error'),
        session: req.session
      });
    });
  });
}

function createBooking(req, res) {
  const ownerId = req.session.user.id;
  const petId = Number(req.body.petId);
  const serviceId = Number(req.body.serviceId);
  const bookingDate = req.body.bookingDate;

  if (
    !Number.isInteger(petId) || petId <= 0 ||
    !Number.isInteger(serviceId) || serviceId <= 0 ||
    !isValidDateString(bookingDate)
  ) {
    req.flash('error', 'Choose a pet, service, and valid booking date.');
    return res.redirect('/services');
  }

  ServiceBooking.createPendingBooking(ownerId, petId, serviceId, bookingDate, (err, result) => {
    if (err) {
      console.error('Error creating booking:', err);
      req.flash('error', 'Unable to create the booking. Please try again.');
      return res.redirect(`/services?petId=${petId}`);
    }

    if (!result) {
      req.flash('error', 'That pet or service is unavailable for booking.');
      return res.redirect('/services');
    }

    req.flash('success', 'Booking created. Payment is pending; no payment has been processed.');
    return res.redirect('/bookings');
  });
}

function listBookings(req, res) {
  const ownerId = req.session.user.id;

  ServiceBooking.getBookingsByOwner(ownerId, (err, bookings) => {
    if (err) {
      console.error('Error loading booking history:', err);
      return res.status(500).send('Unable to load booking history.');
    }

    return res.render('bookings', {
      bookings: bookings || [],
      messages: req.flash('success'),
      errors: req.flash('error'),
      session: req.session
    });
  });
}

module.exports = {
  listServices,
  createBooking,
  listBookings
};
