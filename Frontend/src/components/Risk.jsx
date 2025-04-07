import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Card,
  Container,
  Row,
  Col,
  Spinner,
  Alert,
  Button,
  ProgressBar,
  Badge,
  Accordion,
  ListGroup
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import SideMenuBar from './navigation/SideMenu';
import TopNavBar from './navigation/TopNavBar';

function RiskManagement() {
  // State with complete type safety
  const [analysis, setAnalysis] = useState({
    risks: [],
    opportunities: [],
    strategies: [],
    financial_health: {
      score: 0,
      strengths: [],
      weaknesses: []
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [fileUsed, setFileUsed] = useState('');
  const navigate = useNavigate();

  // Robust API call with error handling
  const fetchAIAnalysis = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication required');

      const response = await axios.post('/api/ai-analysis', {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000 // 30 second timeout
      });

      if (response.data.status === 'success') {
        setAnalysis({
          risks: Array.isArray(response.data.analysis.risks) ? response.data.analysis.risks : [],
          opportunities: Array.isArray(response.data.analysis.opportunities) ? response.data.analysis.opportunities : [],
          strategies: Array.isArray(response.data.analysis.strategies) ? response.data.analysis.strategies : [],
          financial_health: {
            score: Number(response.data.analysis.financial_health?.score) || 0,
            strengths: Array.isArray(response.data.analysis.financial_health?.strengths)
              ? response.data.analysis.financial_health.strengths
              : [],
            weaknesses: Array.isArray(response.data.analysis.financial_health?.weaknesses)
              ? response.data.analysis.financial_health.weaknesses
              : []
          }
        });
        setFileUsed(response.data.file_used || 'Latest financial data');
        setLastUpdated(new Date());
      } else {
        throw new Error(response.data.message || 'Analysis failed');
      }
    } catch (error) {
      console.error('API Error:', error);
      setError(error.response?.data?.message || error.message || 'Failed to load analysis');

      // Set demo data
      setAnalysis({
        risks: [{ type: 'demo', description: 'Sample risk', likelihood: 'medium', impact: 'high' }],
        opportunities: [{ description: 'Sample opportunity', investment: '$50,000', roi_timeline: '6 months' }],
        strategies: [{
          title: 'Sample strategy',
          description: 'Implement cost-saving measures',
          priority: 'High',
          resources: 'Internal team',
          timeline: '3 months',
          expected_outcome: '20% cost reduction'
        }],
        financial_health: {
          score: 6,
          strengths: ['Strong cash flow'],
          weaknesses: ['High operating costs']
        }
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAIAnalysis();
  }, []);

  // UI Components with complete null safety
  const renderRiskBadge = (likelihood = 'medium', impact = 'medium') => {
    const likelihoodColor = {
      low: 'secondary',
      medium: 'warning',
      high: 'danger'
    };

    const impactColor = {
      low: 'info',
      medium: 'warning',
      high: 'danger'
    };

    return (
      <div className="d-flex gap-2 mt-2">
        <Badge bg={likelihoodColor[likelihood.toLowerCase()] || 'warning'}>
          Likelihood: {likelihood}
        </Badge>
        <Badge bg={impactColor[impact.toLowerCase()] || 'warning'}>
          Impact: {impact}
        </Badge>
      </div>
    );
  };

  const renderFinancialHealth = () => {
    const { score = 0, strengths = [], weaknesses = [] } = analysis.financial_health;

    return (
      <Card className="mb-4 shadow-sm">
        <Card.Header className="bg-light">
          <h5>Financial Health Score</h5>
        </Card.Header>
        <Card.Body>
          <div className="mb-3">
            <h6 className="d-flex justify-content-between">
              <span>Overall Score</span>
              <span>{score}/10</span>
            </h6>
            <ProgressBar
              now={score * 10}
              variant={
                score > 7 ? 'success' :
                score > 4 ? 'warning' : 'danger'
              }
              animated
              className="mb-3"
              label={`${score}/10`}
            />
          </div>

          <Row>
            <Col md={6}>
              <Card className="border-0 bg-light">
                <Card.Body>
                  <h6>Strengths</h6>
                  <ListGroup variant="flush">
                    {strengths.length > 0 ? (
                      strengths.map((strength, i) => (
                        <ListGroup.Item key={i} className="bg-light">
                          <i className="fas fa-check-circle text-success me-2"></i>
                          {strength}
                        </ListGroup.Item>
                      ))
                    ) : (
                      <ListGroup.Item className="bg-light text-muted">
                        No strengths identified
                      </ListGroup.Item>
                    )}
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="border-0 bg-light">
                <Card.Body>
                  <h6>Improvement Areas</h6>
                  <ListGroup variant="flush">
                    {weaknesses.length > 0 ? (
                      weaknesses.map((weakness, i) => (
                        <ListGroup.Item key={i} className="bg-light">
                          <i className="fas fa-exclamation-triangle text-warning me-2"></i>
                          {weakness}
                        </ListGroup.Item>
                      ))
                    ) : (
                      <ListGroup.Item className="bg-light text-muted">
                        No weaknesses identified
                      </ListGroup.Item>
                    )}
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    );
  };

  const renderRisks = () => (
    <Card className="mb-4 shadow-sm">
      <Card.Header className="bg-light">
        <h5>Risk Assessment</h5>
      </Card.Header>
      <Card.Body>
        <Row>
          {['operational', 'financial'].map((riskType) => (
            <Col key={riskType} md={6}>
              <h6 className={`text-${riskType === 'operational' ? 'danger' : 'warning'} mb-3`}>
                <i className={`fas fa-${riskType === 'operational' ? 'exclamation-triangle' : 'chart-line'} me-2`}></i>
                {riskType === 'operational' ? 'Operational' : 'Financial'} Risks
              </h6>
              <ListGroup variant="flush">
                {analysis.risks.filter(risk => risk?.type === riskType).length > 0 ? (
                  analysis.risks
                    .filter(risk => risk?.type === riskType)
                    .map((risk, i) => (
                      <ListGroup.Item key={i} className="mb-3">
                        <strong>{risk?.description || 'Unspecified risk'}</strong>
                        {renderRiskBadge(risk?.likelihood, risk?.impact)}
                      </ListGroup.Item>
                    ))
                ) : (
                  <ListGroup.Item className="text-muted">
                    No {riskType} risks identified
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Col>
          ))}
        </Row>
      </Card.Body>
    </Card>
  );

  const renderOpportunities = () => (
    <Card className="mb-4 shadow-sm">
      <Card.Header className="bg-light">
        <h5>Growth Opportunities</h5>
      </Card.Header>
      <Card.Body>
        <Row className="g-3">
          {analysis.opportunities.length > 0 ? (
            analysis.opportunities.map((opp, i) => (
              <Col key={i} md={6}>
                <Card className="h-100 border-0 bg-light">
                  <Card.Body>
                    <Card.Title>
                      <i className="fas fa-lightbulb text-primary me-2"></i>
                      {opp?.description || 'Potential opportunity'}
                    </Card.Title>
                    <Card.Text>
                      <small className="text-muted d-block">
                        <i className="fas fa-dollar-sign me-1"></i>
                        <strong>Investment:</strong> {opp?.investment || 'Not specified'}
                      </small>
                      <small className="text-muted">
                        <i className="fas fa-clock me-1"></i>
                        <strong>ROI Timeline:</strong> {opp?.roi_timeline || 'Not specified'}
                      </small>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <Col md={12}>
              <Card className="border-0 bg-light">
                <Card.Body className="text-muted">
                  No growth opportunities identified
                </Card.Body>
              </Card>
            </Col>
          )}
        </Row>
      </Card.Body>
    </Card>
  );

  const renderStrategies = () => (
    <Card className="mb-4 shadow-sm">
      <Card.Header className="bg-light">
        <h5>Recommended Strategies</h5>
      </Card.Header>
      <Card.Body>
        <Row className="g-3">
          {analysis.strategies.length > 0 ? (
            analysis.strategies.map((strategy, i) => (
              <Col key={i} lg={4} md={6}>
                <Card className="h-100">
                  <Card.Header
                    className={`bg-${
                      strategy?.priority === 'High' ? 'danger' :
                      strategy?.priority === 'Medium' ? 'warning' : 'light'
                    } d-flex justify-content-between align-items-center`}
                  >
                    <span>{strategy?.title || 'Strategy recommendation'}</span>
                    <Badge pill bg="dark">
                      {strategy?.priority || 'Medium'}
                    </Badge>
                  </Card.Header>
                  <Card.Body>
                    <Card.Text>{strategy?.description || 'No description available'}</Card.Text>
                    <Accordion flush>
                      <Accordion.Item eventKey={`strategy-${i}`}>
                        <Accordion.Header className="py-1 small">
                          <i className="fas fa-info-circle me-2"></i>
                          Implementation Details
                        </Accordion.Header>
                        <Accordion.Body className="small">
                          <div className="mb-2">
                            <i className="fas fa-tools me-2"></i>
                            <strong>Resources:</strong> {strategy?.resources || 'Not specified'}
                          </div>
                          <div className="mb-2">
                            <i className="fas fa-calendar-alt me-2"></i>
                            <strong>Timeline:</strong> {strategy?.timeline || 'Not specified'}
                          </div>
                          <div>
                            <i className="fas fa-bullseye me-2"></i>
                            <strong>Expected Outcome:</strong> {strategy?.expected_outcome || 'Not specified'}
                          </div>
                        </Accordion.Body>
                      </Accordion.Item>
                    </Accordion>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <Col md={12}>
              <Card className="border-0 bg-light">
                <Card.Body className="text-muted">
                  No strategies recommended
                </Card.Body>
              </Card>
            </Col>
          )}
        </Row>
      </Card.Body>
    </Card>
  );

  return (
    <>
      <div className="navigation">
        <TopNavBar />
        <SideMenuBar />
      </div>

      <div className="trendSection p-4">
        <Container fluid>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="border-bottom pb-2">
              <i className="fas fa-chart-pie me-2"></i>
              Business Risk Analysis
            </h2>
            <div className="d-flex align-items-center gap-3">
              {lastUpdated && (
                <small className="text-muted">
                  <i className="fas fa-clock me-1"></i>
                  {lastUpdated.toLocaleString()}
                </small>
              )}
              <Button
                variant="outline-primary"
                onClick={fetchAIAnalysis}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner as="span" size="sm" animation="border" />
                    <span className="ms-2">Refreshing...</span>
                  </>
                ) : (
                  <>
                    <i className="fas fa-sync-alt me-2"></i>
                    Refresh Analysis
                  </>
                )}
              </Button>
            </div>
          </div>

          {error && (
            <Alert variant="danger" className="mb-4">
              <div className="d-flex align-items-center">
                <i className="fas fa-exclamation-circle me-2"></i>
                <div>
                  <strong>Analysis Warning:</strong> {error}
                  {error.includes('Authentication') && (
                    <div className="mt-2">
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => navigate('/login')}
                      >
                        <i className="fas fa-sign-in-alt me-1"></i>
                        Go to Login
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Alert>
          )}

          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" size="lg" />
              <p className="mt-3">Generating AI-powered analysis...</p>
              <p className="text-muted">This may take a few moments</p>
            </div>
          ) : (
            <>
              {renderFinancialHealth()}
              {renderRisks()}
              {renderOpportunities()}
              {renderStrategies()}

              {fileUsed && (
                <div className="text-end text-muted small mt-3">
                  <i className="fas fa-file-alt me-1"></i>
                  Analysis based on: {fileUsed}
                </div>
              )}
            </>
          )}
        </Container>
      </div>
    </>
  );
}

export default RiskManagement;