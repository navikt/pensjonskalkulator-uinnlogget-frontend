'use client'

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const ResultPage = () => {
  const router = useRouter();
  const [resultData, setResultData] = useState(null);

  useEffect(() => {
    if (router.query.data) {
      // Decode the query string and parse it as JSON
      const data = JSON.parse(decodeURIComponent(router.query.data as string));
      setResultData(data);
    }
  }, [router.query.data]);

  return (
    <div>
      {/* Render the result object */}
      {resultData && <pre>{JSON.stringify(resultData, null, 2)}</pre>}
    </div>
  );
};

export default ResultPage;