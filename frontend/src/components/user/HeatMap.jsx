import React, { useMemo } from "react";
import HeatMap from "@uiw/react-heat-map";

const HeatMapProfile = ({ repos = [] }) => {
  const activityData = useMemo(() => {
    const counts = {};

    repos.forEach((repo) => {
      if (repo.createdAt) {
        const date = repo.createdAt.split("T")[0];
        counts[date] = (counts[date] || 0) + 1;
      }
    });

    return Object.entries(counts).map(([date, count]) => ({
      date,
      count,
    }));
  }, [repos]);

  const panelColors = {
    0: "#161b22",
    2: "#0e4429",
    4: "#006d32",
    10: "#26a641",
    20: "#39d353",
  };

  return (
    <div style={{ width: "100%" }}>
      <h4 style={{ marginBottom: "10px" }}>Recent Contributions</h4>
      <HeatMap
        value={activityData}
        width={800}
        style={{ color: "#adbac7" }}
        startDate={
          new Date(new Date().setFullYear(new Date().getFullYear() - 1))
        }
        panelColors={panelColors}
        rectSize={14}
        space={4}
        rectProps={{
          rx: 2.5,
        }}
        weekLabels={["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]}
      />
    </div>
  );
};

export default HeatMapProfile;
