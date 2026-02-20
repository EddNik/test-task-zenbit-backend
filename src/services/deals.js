import { prisma } from '../prisma.js'; // Import your Prisma instance

export const getAllDeals = async () => {
  return await prisma.deals.findMany();
};

export const createDeal = async (payload) => {
  return await prisma.deals.create({
    data: {
      image: payload.image,
      title: payload.title,
      price: parseFloat(payload.price),
      yield: parseFloat(payload.yield),
      sold: parseFloat(payload.sold),
      tiket: parseFloat(payload.tiket),
      daysLeft: parseInt(payload.daysLeft),
      usersId: payload.userId,
    },
  });
};
