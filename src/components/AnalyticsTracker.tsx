'use client';

interface AnalyticsTrackerProps {
  siteId: string;
}

export default function AnalyticsTracker({ siteId }: AnalyticsTrackerProps) {
  const trackingScript = `
    (function() {
      let visitId = null;
      let startTime = Date.now();
      let pageViews = 1;
      let isBounce = true;
      
      const visitorId = localStorage.getItem('sitely_visitor_id') || 
                       'visitor_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('sitely_visitor_id', visitorId);
      
      const trackVisit = async () => {
        try {
          const response = await fetch('/api/analytics/track', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              siteId: '${siteId}',
              visitorId: visitorId,
              referrer: document.referrer || null
            }),
          });
          
          const data = await response.json();
          if (data.success) {
            visitId = data.visitId;
          }
        } catch (error) {
          console.error('Failed to track visit:', error);
        }
      };
      
      const updateVisit = async () => {
        if (!visitId) return;
        
        const duration = Math.floor((Date.now() - startTime) / 1000);
        
        try {
          await fetch('/api/analytics/track', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              visitId: visitId,
              duration: duration,
              pageViews: pageViews,
              isBounce: isBounce
            }),
          });
        } catch (error) {
          console.error('Failed to update visit:', error);
        }
      };
      
      const handlePageView = () => {
        pageViews++;
        isBounce = false;
      };
      
      const handleBeforeUnload = () => {
        updateVisit();
      };
      
      const handleVisibilityChange = () => {
        if (document.hidden) {
          updateVisit();
        } else {
          startTime = Date.now();
        }
      };
      
      document.addEventListener('click', handlePageView);
      document.addEventListener('scroll', handlePageView);
      window.addEventListener('beforeunload', handleBeforeUnload);
      document.addEventListener('visibilitychange', handleVisibilityChange);
      
      trackVisit();
      
      setInterval(() => {
        if (!document.hidden) {
          updateVisit();
        }
      }, 30000);
    })();
  `;

  return (
    <script
      dangerouslySetInnerHTML={{ __html: trackingScript }}
    />
  );
} 