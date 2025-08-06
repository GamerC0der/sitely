import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const sites = await prisma.site.findMany({
      take: 1
    });
    
    return NextResponse.json({
      success: true,
      message: 'Prisma is working',
      sitesCount: sites.length,
      prismaClient: typeof prisma,
      availableModels: Object.keys(prisma).filter(key => !key.startsWith('_')),
      siteVisitExists: 'siteVisit' in prisma,
      siteAnalyticsExists: 'siteAnalytics' in prisma
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 