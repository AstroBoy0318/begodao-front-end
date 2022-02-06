import React from "react";
import { Timeline } from "react-material-timeline";
import { Avatar, Icon } from "@material-ui/core";
import "./road-map.scss";

function RoadMap() {
  const events = [
    {
      title: "Open Website",
      description: [""],
      icon: (
        <Avatar>
          <Icon></Icon>
        </Avatar>
      ),
    },
    {
      title: "KYC",
      description: [""],
      icon: (
        <Avatar>
          <Icon></Icon>
        </Avatar>
      ),
    },
    {
      title: "Presale",
      subheader: "7/2/2022 - Open Whitelist",
      description: [""],
      icon: (
        <Avatar>
          <Icon></Icon>
        </Avatar>
      ),
    },
    {
      title: "Presale Finished",
      description: [""],
      icon: (
        <Avatar>
          <Icon></Icon>
        </Avatar>
      ),
    },
    {
      title: "Add Liquidity",
      description: [""],
      icon: (
        <Avatar>
          <Icon></Icon>
        </Avatar>
      ),
    },
    {
      title: "Claim BEGO",
      description: [""],
      icon: (
        <Avatar>
          <Icon></Icon>
        </Avatar>
      ),
    },
    {
      title: "Start Staking & Bonds",
      description: [""],
      icon: (
        <Avatar>
          <Icon></Icon>
        </Avatar>
      ),
    },
    {
      title: "Open DAO",
      description: [""],
      icon: (
        <Avatar>
          <Icon></Icon>
        </Avatar>
      ),
    },
    {
      title: "Launch Market NFTS",
      description: [""],
      icon: (
        <Avatar>
          <Icon></Icon>
        </Avatar>
      ),
    },
    {
      title: "Launch Expansive Farms",
      description: [""],
      icon: (
        <Avatar>
          <Icon></Icon>
        </Avatar>
      ),
    },
    {
      title: "Launch Farms NFTS",
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
