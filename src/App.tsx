import { useEffect, useState } from "react";
import "./App.css";

const BACKEND_URL = "http://localhost:3002/v1/vulnerabilities";
let isAscending = null;

function App() {
  const [entries, setEntries] = useState([]);
  useEffect(() => {
    const abortController = new AbortController();

    fetch(BACKEND_URL, { signal: abortController.signal })
      .then((res) => res.json())
      .then(({ vulnerabilities }) => {
        return setEntries(vulnerabilities);
      });

    return () => {
      abortController.abort();
    };
  }, []);

  const handleClick = (e) => {
    isAscending = !isAscending;
    e.target.style.rotate = isAscending ? "180deg" : "0deg";
    const sortedEntries = [...entries].sort((a, b) => {
      const condition = isAscending ? a.cves.length < b.cves.length : a.cves.length > b.cves.length;
      return condition ? -1 : 1;
    });
    setEntries(sortedEntries);
  };
  const totalEntries = entries.reduce((total, curr) => total + curr.cves.length, 0);
  return (
    <div>
      <nav>
        <h1>Vulnerable Hosts</h1>
        <h2>{new Intl.NumberFormat("en-US").format(totalEntries)} items</h2>
      </nav>
      <table>
        <thead>
          <tr>
            <th>IP ADDRESS</th>
            <th className="space-between">
              <span>CVES FOUND</span>
              <span className="arrow" onClick={handleClick}>
                &darr;
              </span>
            </th>
            <th>LATEST CVES</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, i) => (
            <tr key={i}>
              <td>{entry.ip}</td>
              <td>
                {entry.cves.length} CVE{entry.cves.length > 1 && "s"} found
              </td>
              <td>{formatCves(entry.cves)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function formatCves(cves) {
  const MAX = 3;
  const tailing = cves.length > MAX ? "..." : "";
  return cves.slice(0, MAX).join(", ") + tailing;
}

export default App;

