import React from "react";

/**
 * Minimal placeholder weekly stats — replace with charts later.
 * It uses simple colored blocks and small stats to match the look.
 */
export default function WeeklyStats() {
  // For now we render a sample pie-like UI and daily bars as placeholders.
  return (
    <div className="weekly-stats">
      <div className="pie-sim">
        <div className="pie-slice red" />
        <div className="pie-slice teal" />
        <div className="pie-slice blue" />
      </div>

      <div className="stats-list">
        <div className="stat-row"><strong>English</strong><span>107h 09m</span></div>
        <div className="stat-row"><strong>Math</strong><span>106h 02m</span></div>
        <div className="stat-row"><strong>History</strong><span>107h 10m</span></div>
      </div>

      <div className="week-chart">
        <div className="bar" style={{ height: 20 }} /><div className="bar" style={{ height: 50 }} />
        <div className="bar" style={{ height: 70 }} /><div className="bar" style={{ height: 40 }} />
        <div className="bar" style={{ height: 80 }} /><div className="bar" style={{ height: 60 }} />
        <div className="bar" style={{ height: 30 }} />
      </div>
    </div>
  );
}
