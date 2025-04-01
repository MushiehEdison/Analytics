import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Bar, Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement
} from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import SideMenuBar from "./navigation/SideMenu";
import TopNavBar from "./navigation/TopNavBar";
import Alert from "./PageComponents/Alert";
import TimeFilter from "./AnalyticsComponents/TimeFilter";
import KPIToggle from "./AnalyticsComponents/KPIToggle";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement,
  zoomPlugin
);

const Analytics = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedFileId, setSelectedFileId] = useState(null);
  const [chartType, setChartType] = useState('line');
  const [selectedDataset, setSelectedDataset] = useState(0);
  const [timeRange, setTimeRange] = useState("Monthly");
  const [selectedKPI, setSelectedKPI] = useState("Sales");
  const [zoomLevel, setZoomLevel] = useState(1);
  const chartRef = useRef(null);

  // Color palette for datasets
  const colorPalette = [
    'rgba(54, 162, 235, 0.7)',
    'rgba(255, 99, 132, 0.7)',
    'rgba(75, 192, 192, 0.7)',
    'rgba(255, 206, 86, 0.7)',
    'rgba(153, 102, 255, 0.7)'
  ];

  // Fetch user's uploaded files
  useEffect(() => {
    const fetchUploadedFiles = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/user-uploaded-files', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setUploadedFiles(response.data.files);
      } catch (err) {
        setError('Failed to fetch uploaded files');
      }
    };
    fetchUploadedFiles();
  }, []);

  // Fetch and process selected Excel file
  const fetchExcelData = async (fileId, range = 'Monthly') => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/excel-chart-data/${fileId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
        params: { range }
      });

      if (response.data.error) {
        throw new Error(response.data.error);
      }

      setChartData(response.data);
      setSelectedDataset(0);
      if (chartRef.current) {
        chartRef.current.resetZoom();
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to process file');
    } finally {
      setLoading(false);
    }
  };

  // Handle file selection change
  const handleFileChange = (e) => {
    const fileId = e.target.value;
    setSelectedFileId(fileId);
    if (fileId) {
      fetchExcelData(fileId, timeRange);
    } else {
      setChartData(null);
    }
  };

  // Handle time range change
  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
    if (selectedFileId) {
      fetchExcelData(selectedFileId, range);
    }
  };

  // Chart configuration
  const chartConfig = {
    labels: chartData?.labels || [],
    datasets: chartData?.datasets?.map((dataset, index) => ({
      ...dataset,
      backgroundColor: colorPalette[index % colorPalette.length],
      borderColor: colorPalette[index % colorPalette.length].replace('0.7', '1'),
      borderWidth: zoomLevel > 1 ? 1 : 2,
      pointRadius: zoomLevel > 1 ? 3 : 0,
      pointHoverRadius: 8,
      pointHitRadius: 10,
      barThickness: zoomLevel > 1 ? 'flex' : 30,
      hoverBackgroundColor: colorPalette[index % colorPalette.length].replace('0.7', '0.9'),
      hoverBorderColor: colorPalette[index % colorPalette.length].replace('0.7', '1')
    })) || []
  };

  // Enhanced tooltip configuration
  const getTooltipOptions = () => {
    const baseOptions = {
      enabled: true,
      position: 'nearest',
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      titleColor: '#ffffff',
      bodyColor: '#ffffff',
      borderColor: 'rgba(255, 255, 255, 0.2)',
      borderWidth: 1,
      padding: 12,
      caretSize: 8,
      displayColors: true,
      intersect: false,
      mode: 'index',
      callbacks: {
        title: (context) => context[0].label || '',
        label: (context) => {
          const label = context.dataset.label || '';
          const value = context.parsed.y ?? context.raw;
          return `${label}: ${value.toLocaleString()}`;
        },
        afterLabel: (context) => `Time Range: ${timeRange}`
      }
    };

    if (chartType === 'pie') {
      return {
        ...baseOptions,
        callbacks: {
          ...baseOptions.callbacks,
          label: (context) => {
            const label = context.label || '';
            const value = context.raw;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 1000) / 10;
            return `${label}: ${value.toLocaleString()} (${percentage}%)`;
          }
        }
      };
    }

    return baseOptions;
  };

  // Chart options with precise hover behavior
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: zoomLevel > 1 ? 0 : 1000
    },
    interaction: {
      mode: 'nearest',
      axis: 'xy',
      intersect: false
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 14
          }
        }
      },
      title: {
        display: true,
        text: chartData?.filename || 'Select a file to visualize',
        font: {
          size: 18,
          weight: 'bold'
        }
      },
      tooltip: getTooltipOptions(),
      zoom: {
        zoom: {
          wheel: { enabled: true },
          pinch: { enabled: true },
          mode: 'xy',
          speed: 0.1,
          onZoom: ({ chart }) => {
            setZoomLevel(chart.getZoomLevel());
          }
        },
        pan: {
          enabled: true,
          mode: 'xy',
          speed: 0.1
        },
        limits: {
          x: { min: 'original', max: 'original' },
          y: { min: 'original', max: 'original' }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: selectedKPI,
          font: {
            size: 14,
            weight: 'bold'
          }
        }
      },
      x: {
        title: {
          display: true,
          text: timeRange,
          font: {
            size: 14,
            weight: 'bold'
          }
        },
        grid: {
          display: zoomLevel > 1
        }
      }
    }
  };

  // KPI and Time Range options
  const kpiOptions = ["Sales", "Revenue", "Profit", "Expenses"];
  const timeRanges = ["Daily", "Weekly", "Monthly", "Quarterly"];

  // Render dataset selector conditionally
  const renderDatasetSelector = () => {
    if (!chartData?.datasets || chartData.datasets.length <= 1 || chartType === 'pie') {
      return null;
    }

    return (
      <div className="mt-3 p-3 bg-light rounded">
        <div className="row align-items-center">
          <div className="col-md-2">
            <label className="col-form-label">Dataset:</label>
          </div>
          <div className="col-md-10">
            <select
              className="form-select"
              value={selectedDataset}
              onChange={(e) => setSelectedDataset(parseInt(e.target.value))}
            >
              {chartData.datasets.map((dataset, index) => (
                <option key={index} value={index}>
                  {dataset.label} ({colorPalette[index % colorPalette.length].replace('rgba(', '').replace(')', '')})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="alerts">
        <Alert />
      </div>

      <div className="navigation">
        <TopNavBar />
        <SideMenuBar />
      </div>

      <div className="analyticSection container-fluid px-4 py-3">
        <h1 className="mb-4">Data Visualization Dashboard</h1>

        <div className="controls mb-4 p-3 bg-light rounded">
          <div className="row g-3 align-items-center">
            <div className="col-md-3">
              <label className="form-label">Select Excel File</label>
              <select
                className="form-select"
                value={selectedFileId || ''}
                onChange={handleFileChange}
                disabled={loading}
              >
                <option value="">Choose a file...</option>
                {uploadedFiles.map(file => (
                  <option key={file.id} value={file.id}>
                    {file.filename} ({new Date(file.uploadDate).toLocaleDateString()})
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-2">
              <label className="form-label">KPI</label>
              <KPIToggle
                options={kpiOptions}
                selectedKPI={selectedKPI}
                onChange={setSelectedKPI}
              />
            </div>

            <div className="col-md-2">
              <label className="form-label">Time Range</label>
              <TimeFilter
                timeRanges={timeRanges}
                selectedTimeRange={timeRange}
                onTimeRangeChange={handleTimeRangeChange}
              />
            </div>

            <div className="col-md-2">
              <label className="form-label">Chart Type</label>
              <select
                className="form-select"
                value={chartType}
                onChange={(e) => setChartType(e.target.value)}
                disabled={!chartData || loading}
              >
                <option value="line">Line Chart</option>
                <option value="bar">Bar Chart</option>
                <option value="pie">Pie Chart</option>
              </select>
            </div>

            <div className="col-md-3 d-flex align-items-end gap-2">
              <button
                className="btn btn-outline-secondary"
                onClick={() => chartRef.current?.resetZoom()}
                disabled={!chartData || zoomLevel <= 1}
              >
                Reset Zoom
              </button>
              <button
                className="btn btn-primary"
                onClick={() => fetchExcelData(selectedFileId, timeRange)}
                disabled={!selectedFileId || loading}
              >
                {loading ? 'Loading...' : 'Refresh'}
              </button>
            </div>
          </div>
        </div>

        {loading && (
          <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
            <div className="text-center">
              <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Processing your Excel file...</p>
            </div>
          </div>
        )}

        {error && !loading && (
          <div className="alert alert-danger my-4">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <h5 className="alert-heading">Data Processing Error</h5>
                <p>{error}</p>
              </div>
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => fetchExcelData(selectedFileId, timeRange)}
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {!loading && !error && (
          <>
            {!selectedFileId ? (
              <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
                <div className="text-center p-4 bg-light rounded">
                  <h4>No file selected</h4>
                  <p className="mb-0">Please select an Excel file from the dropdown above</p>
                </div>
              </div>
            ) : (
              <>
                <div className="chart-container bg-white p-4 rounded shadow" style={{ height: '60vh' }}>
                  {chartType === 'bar' && (
                    <Bar
                      ref={chartRef}
                      data={chartConfig}
                      options={chartOptions}
                    />
                  )}
                  {chartType === 'line' && (
                    <Line
                      ref={chartRef}
                      data={chartConfig}
                      options={{
                        ...chartOptions,
                        elements: {
                          point: {
                            hoverRadius: 8,
                            hoverBorderWidth: 2
                          }
                        }
                      }}
                    />
                  )}
                  {chartType === 'pie' && (
                    <Pie
                      data={chartConfig}
                      options={{
                        ...chartOptions,
                        plugins: {
                          ...chartOptions.plugins,
                          zoom: { enabled: false }
                        }
                      }}
                    />
                  )}
                </div>
                {renderDatasetSelector()}
              </>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Analytics;