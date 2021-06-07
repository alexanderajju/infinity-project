import React from "react";
import "./InfoBox.css";
import { Card, CardContent, Typography } from "@material-ui/core";

function InfoBox({ title, isRed , cases, active, total, ...props }) {
  return (
    <Card onClick={props.onClick} className={`infobox ${active && 'infobox--selected' } ${isRed && 'infobox--red'} `}>
      <CardContent className="infobox__title">
        <Typography color="textSecondary">{title}</Typography>

        <h2 className={`infobox__cases ${!isRed && 'infobox--green' }`}>{cases}</h2>

        <Typography className="infobox__total" color="textSecondary">
          {total} Total
        </Typography>
      </CardContent>
    </Card>
  );
}

export default InfoBox;
