import React, { useState, useEffect } from "react";
import { Card, Container, Row, Col, Badge, Button, Spinner, Alert } from "react-bootstrap";

const MarketUpdates = ({ market = 'tech' }) => {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`http://localhost:5000/api/market-news/${market}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();

        if (data.error) {
          throw new Error(data.error);
        }

        // Add some variety to the types (for demo purposes)
        const typedData = data.map((item, index) => ({
          ...item,
          type: ['news', 'trends', 'analysis'][index % 3],
          impact: ['high', 'medium', 'medium'][index % 3]
        }));

        setUpdates(typedData);
      } catch (err) {
        setError(err.message || "Failed to load market updates");
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Set up polling for real-time updates (every 5 minutes)
    const interval = setInterval(fetchData, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [market]);

  const filteredUpdates = filter === "all"
    ? updates
    : updates.filter(update => update.type === filter);

  return (
    <div className="p-4">
      <Container fluid>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">Latest {market.charAt(0).toUpperCase() + market.slice(1)} Market Updates</h2>
          <div className="d-flex gap-2">
            <Button
              variant={filter === "all" ? "dark" : "outline-dark"}
              size="sm"
              onClick={() => setFilter("all")}
            >
              All Updates
            </Button>
            <Button
              variant={filter === "trends" ? "dark" : "outline-dark"}
              size="sm"
              onClick={() => setFilter("trends")}
            >
              Trends
            </Button>
            <Button
              variant={filter === "news" ? "dark" : "outline-dark"}
              size="sm"
              onClick={() => setFilter("news")}
            >
              News
            </Button>
            <Button
              variant={filter === "analysis" ? "dark" : "outline-dark"}
              size="sm"
              onClick={() => setFilter("analysis")}
            >
              Analysis
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : (
          <Row className="g-4">
            {filteredUpdates.map((update) => (
              <Col key={update.id} xl={6} lg={12}>
                <Card className="h-100 border">
                  <Card.Body>
                    <div className="d-flex justify-content-between mb-2">
                      <Badge bg={update.impact === "high" ? "dark" : "secondary"}>
                        {update.type.toUpperCase()}
                      </Badge>
                      <small className="text-muted">
                        {new Date(update.date).toLocaleDateString()} • {update.source}
                      </small>
                    </div>
                    <Card.Title className="mb-3">{update.title}</Card.Title>
                    <Card.Text>{update.summary}</Card.Text>
                  </Card.Body>
                  <Card.Footer className="bg-transparent border-0">
                    <Button
                      variant="outline-dark"
                      size="sm"
                      onClick={() => window.open(update.url, '_blank')}
                    >
                      Read Full Report
                    </Button>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </div>
  );
};

export default MarketUpdates;