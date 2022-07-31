import { Component } from "react";
import traduction from "./traduction";
import idPage from "./idPage";

class MainMenu extends Component {
  render() {
    return (
      <table className="mainTab">
        <tbody>
          <tr>
            <td>
              <input
                className="buttonMain1"
                type="button"
                value={traduction[this.props.language]["QUICK"]}
                onClick={() => this.props.quickGame()}
                style={{ fontSize: this.props.sizeFont }}
              />
            </td>
          </tr>
          <tr>
            <td>
              <input
                className="buttonMain2"
                type="button"
                value={traduction[this.props.language]["DAY"]}
                onClick={() => this.props.gameOfTheDay()}
                style={{ fontSize: this.props.sizeFont }}
              />
            </td>
          </tr>
          <tr>
            <td>
              <input
                className="buttonMain3"
                type="button"
                value={traduction[this.props.language]["CUSTOM"]}
                onClick={() => this.props.changePage(idPage["P_ADV"])}
                style={{ fontSize: this.props.sizeFont }}
              />
            </td>
          </tr>
          <tr>
            <td>
              <button
                className="buttonMain"
                type="button"
                onClick={() =>
                  window.open(
                    "https://www.pcspace.com/SheetTM.pdf",
                    "_blank",
                    "noopener,noreferrer"
                  )
                }
                style={{ fontSize: this.props.sizeFont }}
              >
                {traduction[this.props.language]["SHEET"]}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    );
  }
}

export default MainMenu;
