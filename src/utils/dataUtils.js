import { format } from 'd3';

const CATEGORIES = ['Product A', 'Product B', 'Product C', 'Product D'];

export const generateMockData = (count = 10) => {
  const data = [];
  const today = new Date();
  
  for (let i = 0; i < count; i++) {
    const dateOffset = Math.floor(Math.random() * 30);
    const date = new Date(today);
    date.setDate(date.getDate() - dateOffset);
    
    data.push({
      id: i,
      name: `Item ${i + 1}`,
      value: Math.floor(Math.random() * 90) + 10,
      category: CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)],
      date: date.toISOString().split('T')[0]
    });
  }
  
  return data;
};

export const addDataPoint = (currentData) => {
  const newData = [...currentData];
  const lastId = newData.length > 0 ? Math.max(...newData.map(d => d.id)) : -1;
  
  const today = new Date();
  
  newData.push({
    id: lastId + 1,
    name: `Item ${lastId + 2}`,
    value: Math.floor(Math.random() * 90) + 10,
    category: CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)],
    date: today.toISOString().split('T')[0]
  });
  
  return newData;
};

export const formatNumber = (num) => {
  return format(",.0f")(num);
};