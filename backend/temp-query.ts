import { prisma } from "./src/config/prisma";
(async () => {
  const rows = await prisma.$queryRawUnsafe(
    'SELECT id, "candidateId", "institution", "degree" FROM "Education" LIMIT 10',
  );
  console.log(JSON.stringify(rows, null, 2));
})();
