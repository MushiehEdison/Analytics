import React from "react";
import SideMenuBar from "./navigation/SideMenu";
import TopNavBar from "./navigation/TopNavBar";
import Alert from "./PageComponents/Alert";
import { Card, Container, Row, Col, Accordion } from "react-bootstrap";

function RiskManagement() {
  // Detailed system-generated strategies
  const strategies = [
    {
      id: 1,
      category: "Growth Strategy",
      title: "Market Penetration in Douala ",
      details: [
        "Phase 1 (Q1-Q2): Conduct market research to identify top 3 target countries",
        "Phase 2 (Q3): Establish local partnerships with distributors",
        "Phase 3 (Q4): Launch localized marketing campaigns",
        "KPIs: 15% market share within 18 months"
      ],
      risks: [
        "Regulatory compliance varies by Region",
        "Existing competitors have 40% market dominance",
        "Cultural adaptation of products required"
      ]
    },
    {
      id: 2,
      category: "Marketing Strategy",
      title: "Digital Content Optimization",
      details: [
        "Audit existing content assets and identify gaps",
        "Develop SEO-optimized content calendar for next 6 months",
        "Implement A/B testing for all landing pages",
        "Allocate 30% of marketing budget to high-performing channels",
        "KPIs: 25% increase in organic traffic by Q4"
      ],
      risks: [
        "Algorithm changes may impact SEO performance",
        "Requires continuous content production",
        "Longer conversion funnel than paid ads"
      ]
    },
    {
      id: 3,
      category: "Operational Strategy",
      title: "Supply Chain Digitization",
      details: [
        "Implement IoT sensors in warehouse inventory (Q1)",
        "Migrate to cloud-based inventory management system by Q2",
        "Train staff on new systems (Q3-Q4)",
        "KPIs: 20% reduction in stockouts, 15% faster order fulfillment"
      ],
      risks: [
        "Upfront technology investment costs",
        "Employee resistance to new systems",
        "Data security considerations"
      ]
    }
  ];

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
        </Container>
      </div>
    </>
  );
}

export default RiskManagement;