import React from "react";

const SuccessStories = () => {
  const stories = [
    {
      title: "Tech Innovators",
      description: "Doubled revenue with AI-driven insights.",
      image: "https://via.placeholder.com/150",
      link: "#", // Link to full case study or article
      rating: 4.8,
      category: "Tech",
    },
    {
      title: "Retail Leaders",
      description: "Improved customer satisfaction by 30%.",
      image: "https://via.placeholder.com/150",
      link: "#",
      rating: 4.5,
      category: "Retail",
    },
    {
      title: "Logistics Experts",
      description: "Optimized supply chains to reduce costs by 20%.",
      image: "https://via.placeholder.com/150",
      link: "#",
      rating: 4.7,
      category: "Logistics",
    },
  ];

  return (
    <div>
      <h3 style={{ textAlign: "center", marginBottom: "20px" }}>Success Stories</h3>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "20px" }}>
        {stories.map((story, index) => (
          <div
            key={index}
            style={{
              width: "250px",
              border: "1px solid #ddd",
              borderRadius: "10px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              padding: "15px",
              transition: "transform 0.3s ease-in-out",
              backgroundColor: "#fff",
              overflow: "hidden",
              cursor: "pointer",
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <img
              src={story.image}
              alt={story.title}
              style={{
                width: "100%",
                height: "150px",
                objectFit: "cover",
                borderRadius: "10px",
              }}
            />
            <h4 style={{ fontSize: "18px", margin: "10px 0" }}>{story.title}</h4>
            <p style={{ fontSize: "14px", color: "#555" }}>{story.description}</p>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: "bold",
                  color: "#f39c12",
                }}
              >
                Rating: {story.rating}
              </span>
              <a href={story.link} style={{ color: "#3498db", fontSize: "14px", textDecoration: "none" }}>
                Read More
              </a>
            </div>
            <div
              style={{
                marginTop: "10px",
                padding: "5px",
                backgroundColor: "#f0f0f0",
                borderRadius: "5px",
                textAlign: "center",
                fontSize: "12px",
                color: "#333",
              }}
            >
              {story.category}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuccessStories;
