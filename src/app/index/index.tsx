import React from "react";
import {render} from "react-dom";
import "./index.scss";
import {AppWrapper} from "../ui/app-wrapper";

document.addEventListener("DOMContentLoaded", () => {
  render(<AppWrapper />, document.getElementById("root"));
});
