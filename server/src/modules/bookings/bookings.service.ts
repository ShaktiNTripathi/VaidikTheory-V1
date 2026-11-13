import { prisma } from '../../config/prisma.js';

function parseDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

export async function saveContactBooking(input: {
  fullName: string;
  email: string;
  phone: string;
  serviceType: string;
  message?: string;
  preferredDate?: string;
}) {
  return prisma.consultation.create({
    data: {
      fullName: input.fullName,
      email: input.email,
      phone: input.phone,
      serviceType: input.serviceType as never,
      message: input.message ?? null,
      preferredDate: input.preferredDate ? parseDate(input.preferredDate) : null,
    },
  });
}
