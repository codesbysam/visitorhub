import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Calendar, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({ todayCount: 0, totalCount: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/visitors/dashboard');
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="dashboard">
      <h1 className="page-title">Dashboard Overview</h1>
      
      {loading ? (
        <p>Loading stats...</p>
      ) : (
        <div className="dashboard-grid">
          <div className="stat-card glass-panel">
            <div className="stat-title">
              <Calendar size={20} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle', color: '#3b82f6' }}/>
              Today's Visitors
            </div>
            <div className="stat-value">{stats.todayCount}</div>
          </div>
          
          <div className="stat-card glass-panel">
            <div className="stat-title">
              <Users size={20} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle', color: '#10b981' }}/>
              Total Visitors All-Time
            </div>
            <div className="stat-value">{stats.totalCount}</div>
          </div>
          
          <div className="stat-card glass-panel">
            <div className="stat-title">
              <TrendingUp size={20} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle', color: '#8b5cf6' }}/>
              Activity Status
            </div>
            <div className="stat-value">Active</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
