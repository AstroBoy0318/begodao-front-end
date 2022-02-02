import React from "react";
import { Timeline } from "react-material-timeline";
import { Avatar, Icon } from "@material-ui/core";
import "./road-map.scss";

function RoadMap() {
  const events = [
    {
      title: "Launch Website",
      description: [""],
      icon: (
        <Avatar>
          <Icon></Icon>
        </Avatar>
      ),
    },
    {
      title: "Start Presale",
      subheader: "7/2/2022",
      description: [""],
      icon: (
        <Avatar>
          <Icon></Icon>
        </Avatar>
      ),
    },
    {
      title: "Finalize Presale",
      description: [""],
      icon: (
        <Avatar>
          <Icon></Icon>
        </Avatar>
      ),
    },
    {
      title: "Open Swap pBego for BEGO",
      description: [""],
      icon: (
        <Avatar>
          <Icon></Icon>
        </Avatar>
      ),
    },
    {
      title: "Start staking and bonds",
      description: [""],
      icon: (
        <Avatar>
          <Icon></Icon>
        </Avatar>
      ),
    },
  ];
  return (
    <div id="roadmap-content">
      <Timeline position="alternate" events={events} />
    </div>
  );
}

export default RoadMap;
