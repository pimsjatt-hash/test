import React, { useEffect, useState } from "react";
import { getReports } from "../../api/api";

export default function ReportsDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    getReports().then((res) => setData(res.data)).catch(console.error);
  }, []);

  if (!data) return <p>Loading reports...</p>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">📊 Reports Dashboard</h2>
      <pre className="bg-gray-100 p-4 rounded">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
