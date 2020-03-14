import React from "react";
import { Button } from "@material-ui/core";
import Brightness4Icon from "@material-ui/icons/Brightness4";

export default props => {
  const { onClick, mode } = props;
  return (
    <Button
      onClick={onClick}
      variant="contained"
      color="primary"
      className="btn-toggler"
      startIcon={<Brightness4Icon />}
    >
      {mode === "light" ? "Dark Mode" : "Light Mode"}
    </Button>
  );
};
