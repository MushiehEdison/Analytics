import React, { useState } from "react";
import SideMenuBar from "./navigation/SideMenu";
import TopNavBar from "./navigation/TopNavBar";
import Alert from "./PageComponents/Alert";
import { Container, Form, Card, Button, Spinner, Badge } from "react-bootstrap";

function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Sample data - replace with your actual data source
  const sampleData = [
    {
      id: 1,
      title: "Q3 Market Trends Analysis",
      type: "report",
      category: "Finance",
      match: 92,
      excerpt: "Comprehensive analysis of current market trends and projections"
    },
    {
      id: 2,
      title: "Competitor Benchmarking 2023",
      type: "analysis",
      category: "Strategy",
      match: 85,
      excerpt: "Detailed comparison of industry competitors' performance"
    },
    {
      id: 3,
      title: "Consumer Behavior Insights",
      type: "research",
      category: "Marketing",
      match: 78,
      excerpt: "Latest findings on changing consumer preferences"
    }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setHasSearched(true);

    // Simulate search delay - replace with actual API call
    setTimeout(() => {
      const filtered = sampleData.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setResults(filtered);
      setIsLoading(false);
    }, 800);
  };

  return (
    <>
      {/* Your existing components */}
      <div className="alerts">
        <Alert/>
      </div>
      <div className="navigation">
        <TopNavBar/>
        <SideMenuBar/>
      </div>

      {/* Search page content */}
      <div className="search p-4">
        <Container fluid>
          <div className="mb-5">
            <h2 className="mb-3">Search Database</h2>
            <Form onSubmit={handleSearch}>
              <div className="d-flex gap-2">
                <Form.Control
                  type="search"
                  placeholder="Search reports, analyses, market data..."
                  size="lg"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button variant="primary" type="submit" size="lg">
                  Search
                </Button>
              </div>
            </Form>
          </div>

          {isLoading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3">Searching...</p>
            </div>
          ) : hasSearched ? (
            results.length > 0 ? (
              <div>
                <h5 className="mb-4">Found {results.length} results</h5>
                <div className="row g-4">
                  {results.map((item) => (
                    <div key={item.id} className="col-md-6 col-lg-4">
                      <Card className="h-100">
                        <Card.Body>
                          <div className="d-flex justify-content-between align-items-start">
                            <Card.Title>{item.title}</Card.Title>
                            <Badge bg="secondary">{item.match}% match</Badge>
                          </div>
                          <Badge bg="light" text="dark" className="mb-2">
                            {item.category} • {item.type}
                          </Badge>
                          <Card.Text>{item.excerpt}</Card.Text>
                          <Button variant="outline-primary" size="sm">
                            View Details
                          </Button>
                        </Card.Body>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-5">
                <i className="bi bi-search display-4 text-muted mb-3"></i>
                <h5>No results found for "{searchQuery}"</h5>
                <p className="text-muted">Try different search terms</p>
              </div>
            )
          ) : (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-search display-4 mb-3"></i>
              <p>Enter your search query above</p>
            </div>
          )}
        </Container>
      </div>
    </>
  );
}

export default Search;