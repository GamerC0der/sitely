import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { siteId: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '7d';
    
    const siteId = params.siteId;
    
    const now = new Date();
    let startDate = new Date();
    
    switch (period) {
      case '1d':
        startDate.setDate(now.getDate() - 1);
        break;
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(now.getDate() - 90);
        break;
      default:
        startDate.setDate(now.getDate() - 7);
    }

    const visits = await prisma.siteVisit.findMany({
      where: {
        siteId,
        startTime: {
          gte: startDate
        }
      },
      orderBy: {
        startTime: 'desc'
      }
    });

    const totalVisits = visits.length;
    const uniqueVisitors = new Set(visits.map(v => v.visitorId)).size;
    
    const totalDuration = visits.reduce((sum, visit) => sum + (visit.duration || 0), 0);
    const avgSessionDuration = totalVisits > 0 ? Math.round(totalDuration / totalVisits) : 0;
    
    const bounceCount = visits.filter(v => v.isBounce).length;
    const bounceRate = totalVisits > 0 ? Math.round((bounceCount / totalVisits) * 100) : 0;

    const recentVisits = visits.slice(0, 10).map(visit => ({
      id: visit.id,
      browser: visit.browser || 'Unknown',
      os: visit.os || 'Unknown',
      device: visit.device || 'desktop',
      startTime: visit.startTime,
      duration: visit.duration || 0,
      isBounce: visit.isBounce
    }));

    const browserStats = visits.reduce((acc, visit) => {
      const browser = visit.browser || 'Unknown';
      acc[browser] = (acc[browser] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const referrerStats = visits.reduce((acc, visit) => {
      const referrer = visit.referrer || 'Direct';
      acc[referrer] = (acc[referrer] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topReferrers = Object.entries(referrerStats)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([referrer, count]) => ({
        name: referrer,
        count,
        percentage: Math.round((count / totalVisits) * 100)
      }));

    const dailyStats = await prisma.siteAnalytics.findMany({
      where: {
        siteId,
        date: {
          gte: startDate
        }
      },
      orderBy: {
        date: 'asc'
      }
    });

    if (totalVisits === 0) {
      return NextResponse.json({
        success: true,
        analytics: {
          totalVisits: 0,
          uniqueVisitors: 0,
          avgSessionDuration: 0,
          bounceRate: 0,
          recentVisits: [],
          topReferrers: [],
          browserStats: {},
          dailyStats: []
        }
      });
    }

    return NextResponse.json({
      success: true,
      analytics: {
        totalVisits,
        uniqueVisitors,
        avgSessionDuration,
        bounceRate,
        recentVisits,
        topReferrers,
        browserStats,
        dailyStats
      }
    });

  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch analytics',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 