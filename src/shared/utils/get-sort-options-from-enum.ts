import { Prisma } from '@prisma/client';

function getSortOptionsFromEnum(scalarFieldEnum): string[] {
  const sortOrders: Prisma.SortOrder[] = Object.values(Prisma.SortOrder);
  const fields: string[] = Object.values(scalarFieldEnum);
  const result: string[] = [];

  fields.forEach((field) => {
    sortOrders.forEach((order) => {
      result.push(`${field}:${order}`);
    });
  });

  return result;
}

export default getSortOptionsFromEnum;
