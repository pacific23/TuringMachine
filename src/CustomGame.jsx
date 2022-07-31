import { Component } from "react";
import "./styles.css";

import traduction from "./traduction";
import idPage from "./idPage";

import home from "./images/Home.png";

class CustomGame extends Component {
  buttonNames = [
    ["COMPETITIVE", "SOLO"],
    ["CLASSIC", "EXTREME", "NIGHTMARE"],
    ["EASY", "MEDIUM", "HARD"],
    ["V4", "V5", "V6"]
  ];

  render() {
    return (
      <table className="mainTab">
        <tbody>
          <tr>
            <td colspan="3">
              <button
                id="homeBut"
                className="smallButton"
                type="submit"
                onClick={() => this.props.changePage(idPage["P_MAIN"])}
              >
                <img src={home} width="20" alt="home" />
              </button>
              <table className="compSolTab">
                <tbody>
                  <tr>
                    <td>{this.getAdvancedButton(0, 0, "COMPETITIVE")}&nbsp;</td>
                    <td>{this.getAdvancedButton(0, 1, "SOLO")}</td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td colspan="3">
              {this.props.landscapeMode ? (
                <table className="mainTab">
                  <tbody>
                    <tr>
                      <td>{this.getAdvancedTab(1)}</td>
                      <td>{this.getAdvancedTab(2)}</td>
                      <td>{this.getAdvancedTab(3)}</td>
                    </tr>
                  </tbody>
                </table>
              ) : (
                <table className="mainTab">
                  <tbody>
                    <tr>
                      <td colspan="3">{this.getAdvancedTab(1)}</td>
                    </tr>
                    <tr>
                      <td colspan="3">{this.getAdvancedTab(2)}</td>
                    </tr>
                    <tr>
                      <td colspan="3">{this.getAdvancedTab(3)}</td>
                    </tr>
                  </tbody>
                </table>
              )}
            </td>
          </tr>
          <tr>
            <td></td>
            <td>
              <input
                className="advButton"
                type="button"
                value={traduction[this.props.language]["PLAY"]}
                onClick={() => this.props.playAdvanced()}
              />
            </td>
            <td></td>
          </tr>
        </tbody>
      </table>
    );
  }

  getAdvancedTab(categ) {
    return (
      <table className="mainTab">
        <thead>
          <tr>
            <td>
              {categ === 1 ? (
                <div id="bcolor1">
                  <span id="smallText">
                    {traduction[this.props.language]["STEP1"]}
                  </span>
                </div>
              ) : (
                <div></div>
              )}
            </td>
            <td>
              {categ === 2 ? (
                <div id="bcolor2">
                  <span id="smallText">
                    {traduction[this.props.language]["STEP2"]}
                  </span>
                </div>
              ) : (
                <div></div>
              )}
            </td>
            <td>
              {categ === 3 ? (
                <div id="bcolor3">
                  <span id="smallText">
                    {traduction[this.props.language]["STEP3"]}
                  </span>
                </div>
              ) : (
                <div></div>
              )}
            </td>
          </tr>
        </thead>
        {this.props.landscapeMode ? (
          <tbody>
            <tr>
              <td colspan="3" id={"bcolor" + categ}>
                {this.getAdvancedButton(categ, 0, this.buttonNames[categ][0])}
              </td>
            </tr>
            <tr>
              <td colspan="3" id={"bcolor" + categ}>
                {this.getAdvancedButton(categ, 1, this.buttonNames[categ][1])}
              </td>
            </tr>
            <tr>
              <td colspan="3" id={"bcolor" + categ}>
                {this.getAdvancedButton(categ, 2, this.buttonNames[categ][2])}
              </td>
            </tr>
          </tbody>
        ) : (
          <tbody>
            <tr id={"bcolor" + categ}>
              <td>
                {this.getAdvancedButton(categ, 0, this.buttonNames[categ][0])}
              </td>
              <td>
                {this.getAdvancedButton(categ, 1, this.buttonNames[categ][1])}
              </td>
              <td>
                {this.getAdvancedButton(categ, 2, this.buttonNames[categ][2])}
              </td>
            </tr>
          </tbody>
        )}
      </table>
    );
  }

  getAdvancedButton(column, row, textValue) {
    return (
      <button
        className={
          this.props.advancedSettings[column] === row
            ? "advButtonActive"
            : "advButton"
        }
        type="button"
        onClick={() => this.props.clickAdvanced(column, row)}
      >
        {column === 1 ? (
          <span>
            {traduction[this.props.language][textValue]}
            <br />
            <span id="verySmallText">
              {traduction[this.props.language][textValue + "SUB"]}
            </span>
          </span>
        ) : (
          <span>{traduction[this.props.language][textValue]}</span>
        )}
      </button>
    );
  }
}

export default CustomGame;
