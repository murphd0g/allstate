import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import './App.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ReportData {
  id: number;
  name: string;
  phoneNumber: string;
  location: string;
  creditScore: number;
  tenure: number;
}

function App() {
  const [data, setData] = useState<ReportData[]>([]);
  const [filters, setFilters] = useState({
    name: '',
    location: '',
    minCreditScore: '',
    maxCreditScore: '',
    sortBy: 'id',
    order: 'asc',
  });
  const [notification, setNotification] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<ReportData>>({});
  const [editId, setEditId] = useState<number | null>(null);

  const fetchData = () => {
    const params = new URLSearchParams();
    if (filters.name) params.append('name', filters.name);
    if (filters.location) params.append('location', filters.location);
    if (filters.minCreditScore) params.append('minCreditScore', filters.minCreditScore);
    if (filters.maxCreditScore) params.append('maxCreditScore', filters.maxCreditScore);
    params.append('sortBy', filters.sortBy);
    params.append('order', filters.order);
    params.append('size', '1000');
    fetch(`http://localhost:8080/api/report?${params.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch data');
        return res.json();
      })
      .then((result) => setData(result.content || result))
      .catch(() => setNotification('Error fetching data'));
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [filters]);

  const chartData = {
    labels: data.map((d) => d.name),
    datasets: [
      {
        label: 'Credit Score',
        data: data.map((d) => d.creditScore),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        yAxisID: 'y',
      },
      {
        label: 'Tenure',
        data: data.map((d) => d.tenure),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        yAxisID: 'y1',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: 'Credit Score vs Tenure' },
    },
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: { display: true, text: 'Credit Score' },
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        grid: { drawOnChartArea: false },
        title: { display: true, text: 'Tenure' },
      },
    },
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleFormInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = () => {
    fetch('http://localhost:8080/api/report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to add record');
        setNotification('Record added!');
        setForm({});
        fetchData();
      })
      .catch(() => setNotification('Error adding record'));
  };

  const handleEdit = (row: ReportData) => {
    setEditId(row.id);
    setForm(row);
  };

  const handleUpdate = () => {
    fetch(`http://localhost:8080/api/report/${editId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to update record');
        setNotification('Record updated!');
        setEditId(null);
        setForm({});
        fetchData();
      })
      .catch(() => setNotification('Error updating record'));
  };

  const handleDelete = (id: number) => {
    fetch(`http://localhost:8080/api/report/${id}`, { method: 'DELETE' })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to delete record');
        setNotification('Record deleted!');
        fetchData();
      })
      .catch(() => setNotification('Error deleting record'));
  };

  const handleExportCSV = () => {
    const csv = [
      ['Name', 'Phone Number', 'Location', 'Credit Score', 'Tenure'],
      ...data.map((row) => [row.name, row.phoneNumber, row.location, row.creditScore, row.tenure]),
    ]
      .map((r) => r.join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'report-data.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ maxWidth: 900, margin: '2rem auto' }}>
      <h1>Report Data Visualization</h1>
      {notification && (
        <div style={{ background: '#fee', color: '#900', padding: 8, marginBottom: 16 }}>{notification}</div>
      )}
      <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
        <input name="name" placeholder="Search Name" value={filters.name} onChange={handleInput} />
        <input name="location" placeholder="Location" value={filters.location} onChange={handleInput} />
        <input name="minCreditScore" type="number" placeholder="Min Credit Score" value={filters.minCreditScore} onChange={handleInput} />
        <input name="maxCreditScore" type="number" placeholder="Max Credit Score" value={filters.maxCreditScore} onChange={handleInput} />
        <select name="sortBy" value={filters.sortBy} onChange={handleInput}>
          <option value="id">ID</option>
          <option value="name">Name</option>
          <option value="location">Location</option>
          <option value="creditScore">Credit Score</option>
          <option value="tenure">Tenure</option>
        </select>
        <select name="order" value={filters.order} onChange={handleInput}>
          <option value="asc">Asc</option>
          <option value="desc">Desc</option>
        </select>
        <button onClick={fetchData}>Search</button>
      </div>
      <Bar data={chartData} options={chartOptions} />
      <div style={{ margin: '16px 0', display: 'flex', gap: 8 }}>
        <input name="name" placeholder="Name" value={form.name || ''} onChange={handleFormInput} />
        <input name="phoneNumber" placeholder="Phone Number" value={form.phoneNumber || ''} onChange={handleFormInput} />
        <input name="location" placeholder="Location" value={form.location || ''} onChange={handleFormInput} />
        <input name="creditScore" type="number" placeholder="Credit Score" value={form.creditScore || ''} onChange={handleFormInput} />
        <input name="tenure" type="number" placeholder="Tenure" value={form.tenure || ''} onChange={handleFormInput} />
        {editId ? (
          <>
            <button onClick={handleUpdate}>Update</button>
            <button onClick={() => { setEditId(null); setForm({}); }}>Cancel</button>
          </>
        ) : (
          <button onClick={handleAdd}>Add</button>
        )}
        <button onClick={handleExportCSV}>Export CSV</button>
      </div>
      <table style={{ width: '100%', marginTop: 32, borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone Number</th>
            <th>Location</th>
            <th>Credit Score</th>
            <th>Tenure</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id}>
              <td>{row.name}</td>
              <td>{row.phoneNumber}</td>
              <td>{row.location}</td>
              <td>{row.creditScore}</td>
              <td>{row.tenure}</td>
              <td>
                <button onClick={() => handleEdit(row)}>Edit</button>
                <button onClick={() => handleDelete(row.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
