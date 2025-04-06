import React, { useEffect, useState } from "react";
import SideMenuBar from "./navigation/SideMenu";
import TopNavBar from "./navigation/TopNavBar";
import Alert from "./PageComponents/Alert";
import { Card, Container, Row, Col, Accordion, Spinner } from "react-bootstrap";

function RiskManagement() {
  const [strategies, setStrategies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStrategies() {
      try {
        const response = await fetch("http://127.0.0.1:8000/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ revenue: 100000, churn_rate: 2.1, users: 5000 })
        });

        const data = await response.json();
        setStrategies(parseAIResponse(data.analysis));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching AI data:", error);
        setLoading(false);
      }
    }

    fetchStrategies();
  }, []);

  function parseAIResponse(aiText) {
    // Example: Convert AI response into structured data
    return [
      {
        id: 1,
        category: "AI-Generated Strategy",
        title: "Market Expansion",
        details: [
          "Identify key growth markets based on past sales data",
          "Develop targeted digital campaigns",
          "Partner with local influencers for trust-building"
        ],
        risks: ["Regulatory issues", "High marketing costs", "Uncertain ROI"]
      }
    ];
  }

  return (
    <>
      <div className="alerts">
        <Alert />
      </div>
      <div className="navigation">
        <TopNavBar />
        <SideMenuBar />
      </div>

      <div className="trendSection p-4">
        <Container fluid>
          <h2 className="mb-4 border-bottom pb-2">Strategic Recommendations</h2>

          {loading ? (
            <div className="text-center"><Spinner animation="border" /></div>
          ) : (
            <Row className="g-4">
              {strategies.map((strategy) => (
                <Col key={strategy.id} xl={4} lg={6} md={12}>
                  <Card className="h-100 border">
                    <Card.Header className="bg-light">
                      <Card.Title className="mb-0">
                        <div className="d-flex justify-content-between align-items-center">
                          <span>{strategy.title}</span>
                          <small className="text-muted">{strategy.category}</small>
                        </div>
                      </Card.Title>
                    </Card.Header>
                    <Card.Body>
                      <h6 className="mb-3">Implementation Plan:</h6>
                      <ol className="ps-3">
                        {strategy.details.map((detail, i) => (
                          <li key={i} className="mb-2">{detail}</li>
                        ))}
                      </ol>

                      <Accordion flush>
                        <Accordion.Item eventKey="risks">
                          <Accordion.Header className="p-0 border-0">
                            <span className="fw-normal">Potential Risks</span>
                          </Accordion.Header>
                          <Accordion.Body className="px-0">
                            <ul className="mb-0">
                              {strategy.risks.map((risk, i) => (
                                <li key={i} className="mb-1">• {risk}</li>
                              ))}
                            </ul>
                          </Accordion.Body>
                        </Accordion.Item>
                      </Accordion>
                    </Card.Body>
                    <Card.Footer className="bg-light border-0">
                      <small className="text-muted">
                        Last analyzed: {new Date().toLocaleDateString()}
                      </small>
                    </Card.Footer>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Container>
      </div>
    </>
  );
}

export default RiskManagement;
