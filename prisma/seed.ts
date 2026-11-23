import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import "dotenv/config";

const url = process.env.DATABASE_URL!;
const connectionString = url.replace("mysql://", "mariadb://");
const adapter = new PrismaMariaDb(connectionString);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Memulai database seeding...");

  // Bersihkan data lama agar proses seeding bersifat idempotent
  await prisma.article.deleteMany();

  await prisma.article.createMany({
    data: [
      {
        title: "Panduan Memulai Next.js 16 untuk Pemula",
        slug: "panduan-memulai-nextjs-16",
        content:
          "Next.js 16 menghadirkan peningkatan performa signifikan dengan arsitektur Server Components dan Turbopack.",
        published: true,
        image: "/uploads/nextjs-guide.jpg",
      },
      {
        title: "Mengenal Prisma ORM dan Pola Singleton",
        slug: "mengenal-prisma-orm-dan-singleton",
        content:
          "Prisma ORM mempermudah pengelolaan database relasional dengan validasi tipe data yang ketat.",
        published: true,
        image: "/uploads/prisma-guide.jpg",
      },
      {
        title: "Tips Optimasi Database MySQL di Lokal",
        slug: "tips-optimasi-database-mysql",
        content:
          "Cara menjaga kestabilan koneksi database lokal menggunakan ServBay dan Laragon.",
        published: false,
      },
    ],
  });

  const count = await prisma.article.count();
  console.log(`Seeding selesai: ${count} artikel berhasil ditambahkan.`);
}

main()
  .catch((e) => {
    console.error("Gagal menjalankan seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
