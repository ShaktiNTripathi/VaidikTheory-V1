import type { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { contactBookingSchema } from './bookings.validation.js';
import { saveContactBooking } from './bookings.service.js';

export const postContactBooking = asyncHandler(async (req: Request, res: Response) => {
  const body = contactBookingSchema.parse(req.body);
  const consultation = await saveContactBooking(body);
  res.status(201).json({ success: true, consultation });
});
