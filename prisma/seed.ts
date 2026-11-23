// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import "dotenv/config";
import { auth } from "../lib/auth";

const url = process.env.DATABASE_URL!;
const connectionString = url.replace("mysql://", "mariadb://");
const adapter = new PrismaMariaDb(connectionString);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Membersihkan data lama...");
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.productImage.deleteMany({});
  await prisma.productVariant.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.account.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.article.deleteMany({});

  console.log("Mengisi data artikel...");
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

  console.log("Mengisi data akun pengguna dan kredensial Better Auth...");
  const adminRes = await auth.api.signUpEmail({
    body: {
      name: "Super Admin",
      email: "admin@tokokita.dev",
      password: "password123",
    },
  });
  await prisma.user.update({
    where: { id: adminRes.user.id },
    data: { role: "admin" },
  });

  const customer1Res = await auth.api.signUpEmail({
    body: {
      name: "Olivia Martin",
      email: "olivia.martin@email.com",
      password: "password123",
    },
  });
  const customer1 = customer1Res.user;

  const customer2Res = await auth.api.signUpEmail({
    body: {
      name: "Jackson Lee",
      email: "jackson.lee@email.com",
      password: "password123",
    },
  });
  const customer2 = customer2Res.user;

  console.log("Mengisi data kategori...");
  const electronics = await prisma.category.create({
    data: { name: "Elektronik & Gadget", slug: "elektronik-gadget" },
  });

  const fashion = await prisma.category.create({
    data: { name: "Pakaian & Fashion", slug: "pakaian-fashion" },
  });

  const sports = await prisma.category.create({
    data: { name: "Sepatu & Olahraga", slug: "sepatu-olahraga" },
  });

  console.log("Mengisi produk, varian, dan galeri gambar...");
  const headphones = await prisma.product.create({
    data: {
      name: "Wireless Noise-Canceling Headphones Pro",
      slug: "wireless-headphones-pro",
      description:
        "Headphone nirkabel premium dengan suara jernih dan active noise canceling.",
      categoryId: electronics.id,
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
            altText: "Headphone Hitam Utama",
            order: 0,
          },
          {
            url: "https://images.unsplash.com/photo-1484704849700-f032a568e944",
            altText: "Headphone Tampak Samping",
            order: 1,
          },
        ],
      },
      variants: {
        create: [
          {
            sku: "WH-PRO-BLK",
            color: "Hitam",
            size: "Universal",
            price: 1450000,
            stock: 25,
          },
          {
            sku: "WH-PRO-SLV",
            color: "Silver",
            size: "Universal",
            price: 1450000,
            stock: 18,
          },
        ],
      },
    },
    include: { variants: true },
  });

  const keyboard = await prisma.product.create({
    data: {
      name: "Mechanical Gaming Keyboard RGB",
      slug: "mechanical-keyboard-rgb",
      description:
        "Keyboard mekanik dengan switch tactile dan pencahayaan RGB per tombol.",
      categoryId: electronics.id,
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1587829741301-dc798b83add3",
            altText: "Keyboard RGB Utama",
            order: 0,
          },
        ],
      },
      variants: {
        create: [
          {
            sku: "KB-RGB-BLU",
            color: "Navy",
            size: "Tenkeyless",
            price: 820000,
            stock: 30,
          },
        ],
      },
    },
    include: { variants: true },
  });

  const shirt = await prisma.product.create({
    data: {
      name: "Kemeja Katun Casual Pria",
      slug: "kemeja-katun-casual-pria",
      description:
        "Kemeja lengan panjang bahan katun oxford premium yang nyaman seharian.",
      categoryId: fashion.id,
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c",
            altText: "Kemeja Katun Putih",
            order: 0,
          },
        ],
      },
      variants: {
        create: [
          {
            sku: "KMJ-OXF-WHT-L",
            color: "Putih",
            size: "L",
            price: 275000,
            stock: 40,
          },
          {
            sku: "KMJ-OXF-BLU-M",
            color: "Biru Muda",
            size: "M",
            price: 275000,
            stock: 35,
          },
        ],
      },
    },
    include: { variants: true },
  });

  await prisma.product.create({
    data: {
      name: "Sepatu Lari Ultra Cushioning",
      slug: "sepatu-lari-ultra-cushioning",
      description:
        "Sepatu lari sol responsif untuk kenyamanan lari harian dan marathon.",
      categoryId: sports.id,
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
            altText: "Sepatu Lari Merah",
            order: 0,
          },
        ],
      },
      variants: {
        create: [
          {
            sku: "RUN-ULTRA-42",
            color: "Hitam Neon",
            size: "42",
            price: 950000,
            stock: 15,
          },
          {
            sku: "RUN-ULTRA-43",
            color: "Abu-Abu",
            size: "43",
            price: 950000,
            stock: 20,
          },
        ],
      },
    },
    include: { variants: true },
  });

  console.log("Mengisi data pesanan awal...");
  await prisma.order.create({
    data: {
      userId: customer1.id,
      status: "DELIVERED",
      totalAmount: 1450000,
      items: {
        create: {
          variantId: headphones.variants[0].id,
          quantity: 1,
          price: 1450000,
        },
      },
    },
  });

  await prisma.order.create({
    data: {
      userId: customer2.id,
      status: "PROCESSING",
      totalAmount: 820000,
      items: {
        create: {
          variantId: keyboard.variants[0].id,
          quantity: 1,
          price: 820000,
        },
      },
    },
  });

  await prisma.order.create({
    data: {
      userId: customer1.id,
      status: "PENDING",
      totalAmount: 550000,
      items: {
        create: {
          variantId: shirt.variants[0].id,
          quantity: 2,
          price: 275000,
        },
      },
    },
  });

  console.log("Katalog produk dan pesanan e-commerce berhasil di-seed!");
}

main()
  .catch((e) => {
    console.error("Gagal menjalankan seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
