import React, { Component, Fragment } from "react";
import { faNode, faReact } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import styles from "./Footer.module.css";

class Footer extends Component {
  render() {
    return (
      <div>
        {" "}
        <span className={styles.footer}>
          Created with <FontAwesomeIcon icon={faNode} /> +{" "}
          <FontAwesomeIcon icon={faReact} /> by{" "}
          <a href="http://tarunsingh.netlify.app">Tarun</a>
        </span>
      </div>
    );
  }
}

export default Footer;
