import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Dev only" }, { status: 403 });
  }

  try {
    const [
      users,
      sellers,
      workers,
      subscriptions,
      orderUsage,
      overageBills,
      payments,
      services,
      orders,
      orderItems,
      orderTimelines,
      teams,
      teamMembers,
      teamJoinRequests,
      jobs,
      jobClaims,
      stores,
      storeReviews,
      paymentRecords,
      paymentSchedules,
      workerAccounts,
      outsourceJobs,
      outsourceBids,
      hubPosts,
      contentReports,
      sellerMeeLikeConfigs,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.seller.count(),
      prisma.worker.count(),
      prisma.subscription.count(),
      prisma.orderUsage.count(),
      prisma.overageBill.count(),
      prisma.payment.count(),
      prisma.service.count(),
      prisma.order.count(),
      prisma.orderItem.count(),
      prisma.orderTimeline.count(),
      prisma.team.count(),
      prisma.teamMember.count(),
      prisma.teamJoinRequest.count(),
      prisma.job.count(),
      prisma.jobClaim.count(),
      prisma.store.count(),
      prisma.storeReview.count(),
      prisma.paymentRecord.count(),
      prisma.paymentSchedule.count(),
      prisma.workerAccount.count(),
      prisma.outsourceJob.count(),
      prisma.outsourceBid.count(),
      prisma.hubPost.count(),
      prisma.contentReport.count(),
      prisma.sellerMeeLikeConfig.count(),
    ]);

    return NextResponse.json({
      User: users,
      Seller: sellers,
      Worker: workers,
      Subscription: subscriptions,
      OrderUsage: orderUsage,
      OverageBill: overageBills,
      Payment: payments,
      Service: services,
      Order: orders,
      OrderItem: orderItems,
      OrderTimeline: orderTimelines,
      Team: teams,
      TeamMember: teamMembers,
      TeamJoinRequest: teamJoinRequests,
      Job: jobs,
      JobClaim: jobClaims,
      Store: stores,
      StoreReview: storeReviews,
      PaymentRecord: paymentRecords,
      PaymentSchedule: paymentSchedules,
      WorkerAccount: workerAccounts,
      OutsourceJob: outsourceJobs,
      OutsourceBid: outsourceBids,
      HubPost: hubPosts,
      ContentReport: contentReports,
      SellerMeeLikeConfig: sellerMeeLikeConfigs,
    });
  } catch (error) {
    console.error("[dev/stats]", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Stats failed" },
      { status: 500 }
    );
  }
}
