import { prisma } from '../prisma.js'; // Import your Prisma instance

export const getAllDeals = async () => {
  return await prisma.deals.findMany();
};
