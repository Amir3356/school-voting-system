'use client';

import { useEffect, useRef } from 'react';

export default function ResultChart({ candidates }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !candidates || candidates.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const totalVotes = candidates.reduce((sum, c) => sum + c.vote_count, 0);
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 20;
    
    let startAngle = 0;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    candidates.forEach((candidate, index) => {
      const sliceAngle = (candidate.vote_count / totalVotes) * 2 * Math.PI;
      const color = colors[index % colors.length];
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
      
      startAngle += sliceAngle;
    });
  }, [candidates]);

  return (
    <div className="flex flex-col items-center">
      <canvas ref={canvasRef} width={300} height={300} className="max-w-full" />
      <div className="mt-4 grid grid-cols-2 gap-2">
        {candidates?.map((candidate, index) => {
          const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
          return (
            <div key={candidate.id} className="flex items-center">
              <div
                className="w-4 h-4 mr-2"
                style={{ backgroundColor: colors[index % colors.length] }}
              />
              <span className="text-sm">
                {candidate.user?.name}: {candidate.vote_count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
