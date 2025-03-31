import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Card, Badge, ProgressBar } from "react-bootstrap";

const GrowthOpportunities = () => {
  const [pieData, setPieData] = useState({
    labels: ["E-Commerce", "Tech Services", "Retail", "Logistics"],
    datasets: [{
      data: [0, 0, 0, 0], // Initialize with zeros
      backgroundColor: ["#36a2eb", "#ff6384", "#ffcd56", "#4bc0c0"],
    }]
  });

  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://your-flask-backend/api/growth-opportunities');
        const data = await response.json();

        // Update pie chart data
        setPieData(prev => ({
          ...prev,
          datasets: [{
            ...prev.datasets[0],
            data: [
              data.ecommerce.growth,
              data.tech_services.growth,
              data.retail.growth,
              data.logistics.growth
            ]
          }]
        }));

        // Update opportunities list
        setOpportunities([
          {
            industry: "E-Commerce",
            opportunity: data.ecommerce.opportunity,
            growth: data.ecommerce.growth,
            risk: data.ecommerce.risk,
            investment: data.ecommerce.investment,
            action: data.ecommerce.action
          },
          // ... other industries
        ]);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center my-5">Loading growth opportunities...</div>;
  }

  const riskVariant = (risk) => {
    switch(risk.toLowerCase()) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'secondary';
    }
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">Market Growth Opportunities</h2>

      <div className="row mb-4">
        <div className="col-md-6">
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <Card.Title>Market Distribution</Card.Title>
              <div style={{ height: '300px' }}>
                <Pie
                  data={pieData}
                  options={{
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'right'
                      }
                    }
                  }}
                />
              </div>
            </Card.Body>
          </Card>
        </div>

        <div className="col-md-6">
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <Card.Title>Top Opportunities</Card.Title>
              <div className="opportunities-list" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {opportunities.map((opp, index) => (
                  <div key={index} className="mb-3 pb-2 border-bottom">
                    <h5>{opp.industry}</h5>
                    <p className="text-muted">{opp.opportunity}</p>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Growth: <strong>{opp.growth}%</strong></span>
                      <Badge pill bg={riskVariant(opp.risk)}>Risk: {opp.risk}</Badge>
                      <Badge pill bg="info">Investment: {opp.investment}</Badge>
                    </div>
                    <ProgressBar now={opp.growth} label={`${opp.growth}%`} />
                    <p className="mt-2"><small className="text-primary">{opp.action}</small></p>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>

      {/* Table View */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Card.Title>Opportunity Metrics</Card.Title>
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th>Industry</th>
                  <th>Opportunity</th>
                  <th>Growth</th>
                  <th>Risk</th>
                  <th>Investment</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {opportunities.map((opp, index) => (
                  <tr key={index}>
                    <td>{opp.industry}</td>
                    <td>{opp.opportunity}</td>
                    <td>
                      <ProgressBar now={opp.growth} style={{ height: '20px' }} label={`${opp.growth}%`} />
                    </td>
                    <td>
                      <Badge bg={riskVariant(opp.risk)}>{opp.risk}</Badge>
                    </td>
                    <td>{opp.investment}</td>
                    <td><small>{opp.action}</small></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card.Body>
      </Card>

      {/* Notes Section */}
      <Card className="shadow-sm">
        <Card.Body>
          <Card.Title>Your Observations</Card.Title>
          <textarea
            className="form-control"
            rows="4"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add your observations or ideas about growth opportunities..."
          />
          <button className="btn btn-primary mt-2">Save Notes</button>
        </Card.Body>
      </Card>
    </div>
  );
};

export default GrowthOpportunities;