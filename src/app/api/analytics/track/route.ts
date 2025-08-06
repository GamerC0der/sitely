import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { headers } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const { siteId, visitorId, referrer } = await request.json();
    
    if (!siteId || !visitorId) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const headersList = headers();
    const userAgent = headersList.get('user-agent') || '';
    const ipAddress = headersList.get('x-forwarded-for') || 
                     headersList.get('x-real-ip') || 
                     request.ip || 
                     'unknown';
    
    const parseUserAgent = (ua: string) => {
      const browser = ua.includes('Chrome') ? 'Chrome' :
                     ua.includes('Firefox') ? 'Firefox' :
                     ua.includes('Safari') ? 'Safari' :
                     ua.includes('Edge') ? 'Edge' :
                     ua.includes('Opera') ? 'Opera' : 'Unknown';
      
      const os = ua.includes('Windows') ? 'Windows' :
                ua.includes('Mac') ? 'macOS' :
                ua.includes('Linux') ? 'Linux' :
                ua.includes('Android') ? 'Android' :
                ua.includes('iOS') ? 'iOS' : 'Unknown';
      
      const device = ua.includes('Mobile') || ua.includes('Android') || ua.includes('iPhone') ? 'mobile' :
                    ua.includes('Tablet') ? 'tablet' : 'desktop';
      
      return { browser, os, device };
    };
    
    const result = parseUserAgent(userAgent);
    
    const site = await prisma.site.findUnique({
      where: { id: siteId }
    });
    
    if (!site) {
      return NextResponse.json({ success: false, error: 'Site not found' }, { status: 404 });
    }
    
    const visit = await prisma.siteVisit.create({
      data: {
        siteId,
        visitorId,
        userAgent,
        referrer: referrer || null,
        ipAddress: ipAddress.toString(),
        browser: result.browser,
        os: result.os,
        device: result.device,
        screenResolution: null,
        language: headersList.get('accept-language')?.split(',')[0] || null,
        startTime: new Date(),
        isBounce: true,
        pageViews: 1
      }
    });

    return NextResponse.json({ 
      success: true, 
      visitId: visit.id,
      message: 'Visit tracked successfully' 
    });

  } catch (error) {
    console.error('Error tracking visit:', error);
    return NextResponse.json({ success: false, error: 'Failed to track visit' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { visitId, duration, pageViews, isBounce } = await request.json();
    
    if (!visitId) {
      return NextResponse.json({ success: false, error: 'Missing visit ID' }, { status: 400 });
    }

    const updatedVisit = await prisma.siteVisit.update({
      where: { id: visitId },
      data: {
        endTime: new Date(),
        duration: duration || 0,
        pageViews: pageViews || 1,
        isBounce: isBounce !== undefined ? isBounce : true
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Visit updated successfully' 
    });

  } catch (error) {
    console.error('Error updating visit:', error);
    return NextResponse.json({ success: false, error: 'Failed to update visit' }, { status: 500 });
  }
} 