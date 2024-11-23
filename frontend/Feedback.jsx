import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BadgeCheck, Loader2 } from 'lucide-react';

const FeedbackDashboard = ({ userId = 1 }) => {
  const [points, setPoints] = useState(null);
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);

  useEffect(() => {
    fetchUserPoints();
  }, [userId]);

  const fetchUserPoints = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://whkhxoqclrbwsapozcsx.supabase.co/rest/v1/14_user_points?user_id=eq.${userId}`, {
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indoa2h4b3FjbHJid3NhcG96Y3N4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA5MjI2OTMsImV4cCI6MjA0NjQ5ODY5M30.r9sVK-h_VhWEaFcpbItsegw3C3ColewPJMqad1xJXkk',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indoa2h4b3FjbHJid3NhcG96Y3N4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA5MjI2OTMsImV4cCI6MjA0NjQ5ODY5M30.r9sVK-h_VhWEaFcpbItsegw3C3ColewPJMqad1xJXkk'
        }
      });
      const data = await response.json();
      if (data.length > 0) {
        setPoints(data[0].points_balance);
      }
    } catch (error) {
      console.error('Error fetching points:', error);
    }
    setLoading(false);
  };

  const handleGetSummary = async () => {
    setSummaryLoading(true);
    try {
      const response = await fetch('http://localhost:3000/summary');
      const data = await response.json();
      if (data.success) {
        setSummary(data.summary);
      }
    } catch (error) {
      console.error('Error fetching summary:', error);
    }
    setSummaryLoading(false);
  };

  return (
    <div className="space-y-4 p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Your Points
            {loading ? (
              <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
            ) : (
              <BadgeCheck className="h-6 w-6 text-green-500" />
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-center">
            {points !== null ? points : '-'} points
          </div>
          <p className="text-sm text-gray-500 text-center mt-2">
            Earn more points by providing feedback!
          </p>
        </CardContent>
      </Card>

      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Feedback Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={handleGetSummary} 
            className="w-full"
            disabled={summaryLoading}
          >
            {summaryLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Summary...
              </>
            ) : (
              'Generate Feedback Summary'
            )}
          </Button>
          
          {summary && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700">{summary}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FeedbackDashboard;