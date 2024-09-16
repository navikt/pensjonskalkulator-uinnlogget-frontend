'use client'

import { useEffect, useState } from 'react';

const ResultPage = () => {
  const [resultData, setResultData] = useState(null);
  const [age, setAge] = useState(0);

  useEffect(() => {
    const storedData = localStorage.getItem('resultData');
    if (storedData) {
      setResultData(JSON.parse(storedData));
    }
  }, []);

  return (
    <div>
      <h1>Beregn</h1>
      {resultData ? (
        <pre>{JSON.stringify(resultData, null, 2)}</pre>
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default ResultPage;