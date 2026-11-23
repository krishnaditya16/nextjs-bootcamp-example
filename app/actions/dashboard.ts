"use server"

import { prisma } from "@/lib/db"

export interface DashboardMetrics {
  totalRevenue: number
  totalOrders: number
  totalProducts: number
  lowStockCount: number
  activeCustomers: number
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  try {
    const [revenueResult, totalOrders, totalProducts, lowStockCount, totalUsers] =
      await Promise.all([
        prisma.order.aggregate({
          _sum: {
            totalAmount: true,
          },
          where: {
            status: { in: ["PAID", "DELIVERED", "PROCESSING"] },
          },
        }),
        prisma.order.count(),
        prisma.product.count(),
        prisma.productVariant.count({
          where: {
            stock: {
              lte: 10,
            },
          },
        }),
        prisma.user.count(),
      ])

    const totalRevenue = revenueResult._sum.totalAmount
      ? Number(revenueResult._sum.totalAmount)
      : 0

    return {
      totalRevenue,
      totalOrders,
      totalProducts,
      lowStockCount,
      activeCustomers: totalUsers,
    }
  } catch (error) {
    console.error("Gagal mengambil metrik dashboard:", error)
    return {
      totalRevenue: 0,
      totalOrders: 0,
      totalProducts: 0,
      lowStockCount: 0,
      activeCustomers: 0,
    }
  }
}

export async function getRecentOrders() {
  try {
    const orders = await prisma.order.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            variant: {
              include: {
                product: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    return orders.map((order) => {
      const firstItem = order.items[0]
      const productName = firstItem?.variant?.product?.name || "Order Item"
      const product =
        order.items.length > 1
          ? `${productName} +${order.items.length - 1}`
          : productName

      const statusMap: Record<string, string> = {
        PAID: "Completed",
        DELIVERED: "Completed",
        PROCESSING: "Processing",
        PENDING: "Pending",
        CANCELLED: "Cancelled",
      }

      return {
        id: order.id.slice(0, 8).toUpperCase(),
        customer: order.user?.name || "Customer",
        email: order.user?.email || "customer@example.com",
        product,
        amount: new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          maximumFractionDigits: 0,
        }).format(Number(order.totalAmount)),
        status: statusMap[order.status] || order.status,
        date: order.createdAt.toISOString().split("T")[0],
      }
    })
  } catch (error) {
    console.error("Gagal mengambil pesanan terbaru:", error)
    return []
  }
}
