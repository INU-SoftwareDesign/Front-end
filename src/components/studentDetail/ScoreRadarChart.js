import React from 'react';
import styled from 'styled-components';
import { 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const ChartContainer = styled.div`
  width: 100%;
  height: 350px;
  margin-top: 20px;
`;

const ChartTitle = styled.h3`
  font-family: 'Pretendard-SemiBold', sans-serif;
  font-size: 16px;
  color: #333;
  margin-bottom: 16px;
  text-align: center;
`;

const NoDataMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #888;
  font-family: 'Pretendard-Medium', sans-serif;
`;

const ScoreRadarChart = ({ labels, data, title }) => {
  if (!labels || !data || labels.length === 0 || data.length === 0) {
    return (
      <ChartContainer>
        <ChartTitle>{title || '과목별 성적 분포'}</ChartTitle>
        <NoDataMessage>데이터가 존재하지 않습니다.</NoDataMessage>
      </ChartContainer>
    );
  }

  // Transform data for the radar chart
  const chartData = labels.map((label, index) => ({
    subject: label,
    total: data[index],
    fullMark: 100
  }));

  return (
    <ChartContainer>
      <ChartTitle>{title || '과목별 성적 분포'}</ChartTitle>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
          <PolarGrid stroke="#e0e0e0" />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: '#333', fontSize: 12, fontFamily: 'Pretendard-Medium' }} 
          />
          <PolarRadiusAxis 
            angle={30} 
            domain={[0, 100]} 
            tick={{ fill: '#666', fontSize: 10 }} 
          />
          <Radar 
            name="점수" 
            dataKey="total" 
            stroke="#1D4EB0" 
            fill="#1D4EB0" 
            fillOpacity={0.5} 
          />
          <Tooltip 
            formatter={(value) => [`${value.toFixed(1)}점`, '총점']} 
            labelFormatter={(label) => `${label}`}
            contentStyle={{
              backgroundColor: 'white',
              borderRadius: '4px',
              padding: '8px',
              border: '1px solid #ddd',
              fontFamily: 'Pretendard-Regular'
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default ScoreRadarChart;
