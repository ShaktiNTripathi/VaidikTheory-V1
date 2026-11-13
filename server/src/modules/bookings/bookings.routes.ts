import { Router } from 'express';
import { postContactBooking } from './bookings.controller.js';

export const bookingsRouter = Router();

bookingsRouter.post('/', postContactBooking);
