import { Component } from "react";
import traduction from "./traduction";
import idPage from "./idPage";

import PrintIcon from "@mui/icons-material/Print";

class MainMenu extends Component {
  render() {
    return (
      <table className="mainTab">
        <tbody>
          <tr>
            <td>
              <input
                className="buttonMain"
                type="button"
                value={traduction[this.props.language]["QUICK"]}
                onClick={() => this.props.quickGame()}
              />
            </td>
          </tr>
          <tr>
            <td>
              <input
                className="buttonMain"
                type="button"
                value={traduction[this.props.language]["DAY"]}
                onClick={() => this.props.gameOfTheDay()}
              />
            </td>
          </tr>
          <tr>
            <td>
              <input
                className="buttonMain"
                type="button"
                value={traduction[this.props.language]["CUSTOM"]}
                onClick={() => this.props.changePage(idPage["P_ADV"])}
              />
            </td>
          </tr>
          <tr>
            <td>
              <button className="buttonMain" type="button">
                <PrintIcon />
                &nbsp;
                {traduction[this.props.language]["SHEET"]}
                &nbsp;
                <PrintIcon />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    );
  }
}

export default MainMenu;
