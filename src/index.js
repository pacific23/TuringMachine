import React from "react";
import { createRoot } from "react-dom/client";
import Cookies from "universal-cookie";
import "./styles.css";

import MainMenu from "./MainMenu";

import traduction from "./traduction";
import idPage from "./idPage";

import boxFR from "./images/BOX_FR.jpg";
import boxEN from "./images/BOX_EN.jpg";
import history from "./images/History.png";
import home from "./images/Home.png";
import langFR from "./images/LangFR.png";
import langEN from "./images/LangEN.png";

const imgLang = [langFR, langEN];
const imgBox = [boxFR, boxEN];
const cookies = new Cookies();

var userID = "";
var historicalGames;

class App extends React.Component {
  state = {
    landscapeMode: true,
    sizeImage: 1,
    sizeFont: 24,
    page: 0,
    historicalData: false,
    language: 1,
    hashValue: "",
    advancedSettings: [0, 0, 1, 1]
  };
  game = {
    idPartie: 0,
    color: 0,
    hash: "",
    m: 0,
    d: 0,
    n: 4,
    code: "111",
    par: 0,
    fake: [0, 0, 0, 0, 0, 0],
    ind: [0, 0, 0, 0, 0, 0],
    law: [0, 0, 0, 0, 0, 0],
    crypt: [0, 0, 0, 0, 0, 0],
    sortedInd: [0, 0, 0, 0, 0, 0]
  };

  componentDidMount() {
    document.title = "Turing Machine";
    window.addEventListener("resize", this.resize.bind(this));
    this.resize();
    userID = cookies.get("user");
    var hData = cookies.get("histData", { doNotParse: true });
    if (hData === undefined) {
      historicalGames = [];
    } else {
      historicalGames = JSON.parse(hData);
      if (historicalGames.length > 0) {
        this.setState({
          historicalData: true
        });
      }
    }
    if (userID === undefined) {
      userID = this.generateUUID();
    }
    var d = new Date();
    d.setTime(d.getTime() + 60 * 60 * 24 * 400 * 1000);
    cookies.set("user", userID, {
      path: "/",
      maxAge: 60 * 60 * 24 * 400,
      expires: d
    });
  }

  updateHistoricalData() {
    var d = new Date();
    d.setTime(d.getTime() + 60 * 60 * 24 * 400 * 1000);
    cookies.set("histData", JSON.stringify(historicalGames), {
      path: "/",
      maxAge: 60 * 60 * 24 * 400,
      expires: d
    });
    this.setState({
      historicalData: true
    });
  }

  generateUUID() {
    // Public Domain/MIT
    var d = new Date().getTime(); //Timestamp
    var d2 =
      (typeof performance !== "undefined" &&
        performance.now &&
        performance.now() * 1000) ||
      0; //Time in microseconds since page-load or 0 if unsupported
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (
      c
    ) {
      var r = Math.random() * 16; //random number between 0 and 16
      if (d > 0) {
        //Use timestamp until depleted
        r = (d + r) % 16 | 0;
        d = Math.floor(d / 16);
      } else {
        //Use microseconds since page-load if supported
        r = (d2 + r) % 16 | 0;
        d2 = Math.floor(d2 / 16);
      }
      return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
    });
  }

  swapLanguage() {
    if (this.state.language === 0) {
      this.setState({ language: 1 });
    } else {
      this.setState({ language: 0 });
    }
  }

  resize() {
    var sizex = window.innerWidth;
    var sizey = window.innerHeight;
    if (sizex < sizey) {
      this.setState({
        sizeImage: Math.min(sizex * 0.7, sizey / 2),
        sizeFont: Math.max(sizex * 0.06, 20),
        landscapeMode: sizex < sizey ? false : true
      });
    } else {
      this.setState({
        sizeImage: Math.min(sizex / 2, sizey - 100),
        sizeFont: Math.max(sizex * 0.03, 20),
        landscapeMode: sizex < sizey ? false : true
      });
    }
  }

  addGame(hash) {
    for (var i = 0; i < historicalGames.length; i++) {
      if (historicalGames[i] === hash) {
        historicalGames.splice(i, 1);
        i--;
      }
    }
    historicalGames = [hash].concat(historicalGames);
    if (historicalGames.length > 100) {
      historicalGames.pop();
    }
    this.updateHistoricalData();
  }

  shuffleIndFake() {
    for (var i = 0; i < this.game.n; i++) {
      if (Math.floor(Math.random() * 2) === 0) {
        var n = this.game.ind[i];
        this.game.ind[i] = this.game.fake[i];
        this.game.fake[i] = n;
      }
    }
  }

  sortInd() {
    this.game.sortedInd = [...this.game.ind];
    this.game.sortedInd.sort((a, b) => (a > b ? 1 : -1));
  }

  loadGame(url) {
    this.changePage(idPage["P_LOADING"]);
    var xhr = new XMLHttpRequest();

    xhr.addEventListener("load", () => {
      var data = xhr.responseText;
      if (data.length === 0) {
        this.changePage(idPage["P_ERROR"]);
        return;
      }
      var jsonResponse = JSON.parse(data);
      if (jsonResponse["status"] === "ok") {
        this.addGame(jsonResponse["hash"]);
        this.game.idPartie = jsonResponse["idPartie"];
        this.game.color = jsonResponse["color"];
        this.game.hash = jsonResponse["hash"];
        this.game.m = jsonResponse["m"];
        this.game.d = jsonResponse["d"];
        this.game.n = jsonResponse["n"];
        this.game.code = jsonResponse["code"];
        this.game.par = jsonResponse["par"];
        this.game.fake = jsonResponse["fake"];
        this.game.ind = jsonResponse["ind"];
        this.game.law = jsonResponse["law"];
        this.game.crypt = jsonResponse["crypt"];
        if (this.game.m === 1) {
          this.shuffleIndFake();
        }
        if (this.game.m === 2) {
          this.sortInd();
        }
        this.changePage(idPage["P_INGAME"]);
      } else {
        this.changePage(idPage["P_ERROR"]);
      }
    });
    xhr.addEventListener("error", () => {
      this.changePage(idPage["P_ERROR"]);
    });
    xhr.addEventListener("abort", () => {
      this.changePage(idPage["P_ERROR"]);
    });
    xhr.open(
      "GET",
      "https://www.pcspace.com/tl/api.php?uuid=" + userID + "&" + url
    );
    xhr.send();
  }

  quickGame() {
    this.loadGame("s=0");
  }

  gameOfTheDay() {
    this.loadGame("s=1");
  }

  hashGame() {
    this.loadGame("h=" + this.state.hashValue.toUpperCase());
  }

  playAdvanced() {
    this.loadGame(
      "m=" +
        this.state.advancedSettings[1] +
        "&d=" +
        this.state.advancedSettings[2] +
        "&n=" +
        (this.state.advancedSettings[3] + 4)
    );
  }

  changePage(newPage) {
    this.setState({ page: newPage });
  }

  handleChange(value) {
    value = value.replace("#", "");
    value = value.replace(" ", "");
    this.setState({ hashValue: value });
  }

  clickAdvanced(column, row) {
    this.state.advancedSettings[column] = row;
    this.forceUpdate();
  }

  render() {
    return <div>{this.getPage()}</div>;
  }

  getPage() {
    if (
      this.state.page === idPage["P_MAIN"] ||
      this.state.page === idPage["P_SHARP"]
    ) {
      return (
        <div className="App">
          {this.state.landscapeMode
            ? this.getLandscapeMainPage()
            : this.getPortraitMainPage()}
        </div>
      );
    }
    if (this.state.page === idPage["P_ADV"]) {
      return (
        <div className="App">
          {this.state.landscapeMode
            ? this.getLandscapeAdvancedMenu()
            : this.getPortraitAdvancedMenu()}
        </div>
      );
    }
    if (this.state.page === idPage["P_LOADING"]) {
      return (
        <div className="App">
          <table className="mainTab">
            <tbody>
              <tr>
                <td>{traduction[this.state.language]["LOADING"]}</td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    }
    if (
      this.state.page === idPage["P_INGAME"] ||
      this.state.page === idPage["P_SHOWQUESTION"]
    ) {
      return (
        <div className="App">
          {this.state.landscapeMode
            ? this.getLandscapeGame()
            : this.getPortraitGame()}
        </div>
      );
    }
    if (this.state.page === idPage["P_ERROR"]) {
      return (
        <div className="App">
          <table className="mainTab">
            <tbody>
              <tr>
                <td>
                  <button
                    id="homeBut"
                    className="smallButton"
                    type="submit"
                    onClick={() => this.changePage(idPage["P_MAIN"])}
                  >
                    <img src={home} width="20" alt="home" />
                  </button>
                  {traduction[this.state.language]["ERROR_UNABLE"]}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    }
    if (this.state.page === idPage["P_HIST"]) {
      return (
        <div className="App">
          <table className="mainTab">
            <tbody>
              <tr>
                <td>
                  <button
                    id="homeBut"
                    className="smallButton"
                    type="submit"
                    onClick={() => this.changePage(idPage["P_MAIN"])}
                  >
                    <img src={home} width="20" alt="home" />
                  </button>
                  <div className="scrollmenu">{this.getListHistorical()}</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    }
    if (this.state.page === idPage["P_ABOUT"]) {
      return (
        <div className="App">
          <table className="mainTab">
            <tbody>
              <tr>
                <td>
                  <button
                    id="homeBut"
                    className="smallButton"
                    type="submit"
                    onClick={() => this.changePage(idPage["P_MAIN"])}
                  >
                    <img src={home} width="20" alt="home" />
                  </button>
                  TURING MACHINE
                  <br />
                  <br />
                  SCORPION MASQUE
                  <br />
                  <br />
                  FABIEN GRIDEL
                  <br />
                  <br />
                  YOANN LEVET
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    }
    if (this.state.page === idPage["P_SOLUTION"]) {
      return (
        <div className="App">
          {this.state.landscapeMode
            ? this.getLandscapeSolution()
            : this.getPortraitSolution()}
        </div>
      );
    }
  }

  getListHistorical() {
    return historicalGames.map((hash) => (
      <div key={"#" + hash}>
        <input
          className="button"
          type="button"
          value={"#" + hash}
          onClick={() => this.loadGame("h=" + hash)}
        />
        <br />
        &nbsp;
      </div>
    ));
  }

  getMainMenu() {
    return (
      <table className="mainTab">
        <tbody>
          <tr>
            <td>
              {this.state.page === idPage["P_MAIN"] ? (
                <MainMenu
                  language={this.state.language}
                  quickGame={() => this.quickGame()}
                  gameOfTheDay={() => this.gameOfTheDay()}
                  changePage={(page) => this.changePage(page)}
                  sizeFont={this.state.sizeFont}
                />
              ) : null}
            </td>
          </tr>
        </tbody>
      </table>
    );
  }

  getOptionMenu() {
    return (
      <div>
        <input
          className="smallButton"
          type="button"
          value={traduction[this.state.language]["ABOUT"]}
          onClick={() => this.changePage(idPage["P_ABOUT"])}
        />
        &nbsp;
        <button
          className="smallButton"
          type="submit"
          onClick={() => this.swapLanguage()}
        >
          <img src={imgLang[this.state.language]} width="20" alt="language" />
        </button>
      </div>
    );
  }

  getAdvancedButton(column, row, textValue) {
    return (
      <input
        className={
          this.state.advancedSettings[column] === row
            ? "advButtonActive"
            : "advButton"
        }
        type="button"
        value={traduction[this.state.language][textValue]}
        onClick={() => this.clickAdvanced(column, row)}
      />
    );
  }

  getAdvancedButtonImg(column, row, img) {
    return (
      <button
        id="advBut"
        className={
          this.state.advancedSettings[column] === row
            ? "advButtonActive"
            : "advButton"
        }
        type="submit"
        onClick={() => this.clickAdvanced(column, row)}
        style={{ backgroundImage: `url(${img})` }}
      ></button>
    );
  }

  getLandscapeGame() {
    return (
      <table className="mainTab">
        <tbody>
          <tr>
            <td colSpan={this.game.n}>
              <button
                id="homeBut"
                className="smallButton"
                type="submit"
                onClick={() => this.changePage(idPage["P_MAIN"])}
              >
                <img src={home} width="20" alt="home" />
              </button>
              {"#" + this.game.hash}
            </td>
          </tr>
          <tr>
            <td id="spot">A</td>
            <td id="spot">B</td>
            <td id="spot">C</td>
            <td id="spot">D</td>
            {this.game.n > 4 ? <td id="spot">E</td> : null}
            {this.game.n > 5 ? <td id="spot">F</td> : null}
          </tr>
          {this.game.m !== 2 ? (
            <tr>
              <td>
                <input className="ind" type="button" value={this.game.ind[0]} />
              </td>
              <td>
                <input className="ind" type="button" value={this.game.ind[1]} />
              </td>
              <td>
                <input className="ind" type="button" value={this.game.ind[2]} />
              </td>
              <td>
                <input className="ind" type="button" value={this.game.ind[3]} />
              </td>
              {this.game.n > 4 ? (
                <td>
                  <input
                    className="ind"
                    type="button"
                    value={this.game.ind[4]}
                  />
                </td>
              ) : null}
              {this.game.n > 5 ? (
                <td>
                  <input
                    className="ind"
                    type="button"
                    value={this.game.ind[5]}
                  />
                </td>
              ) : null}
            </tr>
          ) : null}

          {this.game.m === 1 ? (
            <tr>
              <td>
                <input
                  className="ind"
                  type="button"
                  value={this.game.fake[0]}
                />
              </td>
              <td>
                <input
                  className="ind"
                  type="button"
                  value={this.game.fake[1]}
                />
              </td>
              <td>
                <input
                  className="ind"
                  type="button"
                  value={this.game.fake[2]}
                />
              </td>
              <td>
                <input
                  className="ind"
                  type="button"
                  value={this.game.fake[3]}
                />
              </td>
              {this.game.n > 4 ? (
                <td>
                  <input
                    className="ind"
                    type="button"
                    value={this.game.fake[4]}
                  />
                </td>
              ) : null}
              {this.game.n > 5 ? (
                <td>
                  <input
                    className="ind"
                    type="button"
                    value={this.game.fake[5]}
                  />
                </td>
              ) : null}
            </tr>
          ) : null}
          <tr id={"color" + this.game.color}>
            <td>{this.game.crypt[0]}</td>
            <td>{this.game.crypt[1]}</td>
            <td>{this.game.crypt[2]}</td>
            <td>{this.game.crypt[3]}</td>
            {this.game.n > 4 ? <td>{this.game.crypt[4]}</td> : null}
            {this.game.n > 5 ? <td>{this.game.crypt[5]}</td> : null}
          </tr>
          {this.game.m === 2 ? (
            <tr>
              <td colSpan={this.game.n}>
                <input
                  className="indS"
                  type="button"
                  value={this.game.sortedInd[0]}
                />{" "}
                <input
                  className="indS"
                  type="button"
                  value={this.game.sortedInd[1]}
                />{" "}
                <input
                  className="indS"
                  type="button"
                  value={this.game.sortedInd[2]}
                />{" "}
                <input
                  className="indS"
                  type="button"
                  value={this.game.sortedInd[3]}
                />{" "}
                {this.game.n > 4 ? (
                  <input
                    className="indS"
                    type="button"
                    value={this.game.sortedInd[4]}
                  />
                ) : null}{" "}
                {this.game.n > 5 ? (
                  <input
                    className="indS"
                    type="button"
                    value={this.game.sortedInd[5]}
                  />
                ) : null}
              </td>
            </tr>
          ) : null}
          <tr>
            {this.state.page === idPage["P_INGAME"] ? (
              <td colSpan={this.game.n}>
                <input
                  className="smallButton"
                  type="button"
                  value={traduction[this.state.language]["SOLUTION"]}
                  onClick={() => this.changePage(idPage["P_SHOWQUESTION"])}
                />
              </td>
            ) : (
              <td colSpan={this.game.n}>
                <input
                  className="smallButton"
                  type="button"
                  value={traduction[this.state.language]["NO"]}
                  onClick={() => {
                    this.changePage(idPage["P_INGAME"]);
                  }}
                />
                &nbsp;
                <input
                  className="smallButton"
                  type="button"
                  value={traduction[this.state.language]["SHOW_SOLUTION"]}
                />
                &nbsp;
                <input
                  className="smallButton"
                  type="button"
                  value={traduction[this.state.language]["YES"]}
                  onClick={() => {
                    this.changePage(idPage["P_SOLUTION"]);
                  }}
                />
              </td>
            )}
          </tr>
        </tbody>
      </table>
    );
  }

  getPortraitGame() {
    return (
      <table className="mainTab">
        <tbody>
          <tr>
            <td colSpan={this.game.m === 1 ? 4 : this.game.m === 2 ? 2 : 3}>
              <button
                id="homeBut"
                className="smallButton"
                type="submit"
                onClick={() => this.changePage(idPage["P_MAIN"])}
              >
                <img src={home} width="20" alt="home" />
              </button>
              {"#" + this.game.hash}
            </td>
          </tr>
          <tr>
            <td id="spot">A</td>
            {this.game.m !== 2 ? (
              <td>
                <input className="ind" type="button" value={this.game.ind[0]} />
              </td>
            ) : null}
            {this.game.m === 1 ? (
              <td>
                <input
                  className="ind"
                  type="button"
                  value={this.game.fake[0]}
                />
              </td>
            ) : null}
            <td id={"color" + this.game.color}>{this.game.crypt[0]}</td>
          </tr>
          <tr>
            <td id="spot">B</td>
            {this.game.m !== 2 ? (
              <td>
                <input className="ind" type="button" value={this.game.ind[1]} />
              </td>
            ) : null}
            {this.game.m === 1 ? (
              <td>
                <input
                  className="ind"
                  type="button"
                  value={this.game.fake[1]}
                />
              </td>
            ) : null}
            <td id={"color" + this.game.color}>{this.game.crypt[1]}</td>
          </tr>
          <tr>
            <td id="spot">C</td>
            {this.game.m !== 2 ? (
              <td>
                <input className="ind" type="button" value={this.game.ind[2]} />
              </td>
            ) : null}
            {this.game.m === 1 ? (
              <td>
                <input
                  className="ind"
                  type="button"
                  value={this.game.fake[2]}
                />
              </td>
            ) : null}
            <td id={"color" + this.game.color}>{this.game.crypt[2]}</td>
          </tr>
          <tr>
            <td id="spot">D</td>
            {this.game.m !== 2 ? (
              <td>
                <input className="ind" type="button" value={this.game.ind[3]} />
              </td>
            ) : null}
            {this.game.m === 1 ? (
              <td>
                <input
                  className="ind"
                  type="button"
                  value={this.game.fake[3]}
                />
              </td>
            ) : null}
            <td id={"color" + this.game.color}>{this.game.crypt[3]}</td>
          </tr>
          {this.game.n > 4 ? (
            <tr>
              <td id="spot">E</td>
              {this.game.m !== 2 ? (
                <td>
                  <input
                    className="ind"
                    type="button"
                    value={this.game.ind[4]}
                  />
                </td>
              ) : null}
              {this.game.m === 1 ? (
                <td>
                  <input
                    className="ind"
                    type="button"
                    value={this.game.fake[4]}
                  />
                </td>
              ) : null}
              <td id={"color" + this.game.color}>{this.game.crypt[4]}</td>
            </tr>
          ) : null}
          {this.game.n > 5 ? (
            <tr>
              <td id="spot">F</td>
              {this.game.m !== 2 ? (
                <td>
                  <input
                    className="ind"
                    type="button"
                    value={this.game.ind[5]}
                  />
                </td>
              ) : null}
              {this.game.m === 1 ? (
                <td>
                  <input
                    className="ind"
                    type="button"
                    value={this.game.fake[5]}
                  />
                </td>
              ) : null}
              <td id={"color" + this.game.color}>{this.game.crypt[5]}</td>
            </tr>
          ) : null}
          {this.game.m === 2 ? (
            <tr>
              <td colSpan="2">
                <input
                  className="indS"
                  type="button"
                  value={this.game.sortedInd[0]}
                />{" "}
                <input
                  className="indS"
                  type="button"
                  value={this.game.sortedInd[1]}
                />{" "}
                <input
                  className="indS"
                  type="button"
                  value={this.game.sortedInd[2]}
                />{" "}
                <input
                  className="indS"
                  type="button"
                  value={this.game.sortedInd[3]}
                />{" "}
                {this.game.n > 4 ? (
                  <input
                    className="indS"
                    type="button"
                    value={this.game.sortedInd[4]}
                  />
                ) : null}{" "}
                {this.game.n > 5 ? (
                  <input
                    className="indS"
                    type="button"
                    value={this.game.sortedInd[5]}
                  />
                ) : null}
              </td>
            </tr>
          ) : null}
          <tr>
            {this.state.page === idPage["P_INGAME"] ? (
              <td colSpan={this.game.m === 1 ? 4 : this.game.m === 2 ? 2 : 3}>
                <input
                  className="smallButton"
                  type="button"
                  value={traduction[this.state.language]["SOLUTION"]}
                  onClick={() => this.changePage(idPage["P_SHOWQUESTION"])}
                />
              </td>
            ) : (
              <td colSpan={this.game.m === 1 ? 4 : this.game.m === 2 ? 2 : 3}>
                <input
                  className="smallButton"
                  type="button"
                  value={traduction[this.state.language]["NO"]}
                  onClick={() => {
                    this.changePage(idPage["P_INGAME"]);
                  }}
                />
                &nbsp;
                <input
                  className="smallButton"
                  type="button"
                  value={traduction[this.state.language]["SHOW_SOLUTION"]}
                />
                &nbsp;
                <input
                  className="smallButton"
                  type="button"
                  value={traduction[this.state.language]["YES"]}
                  onClick={() => {
                    this.changePage(idPage["P_SOLUTION"]);
                  }}
                />
              </td>
            )}
          </tr>
        </tbody>
      </table>
    );
  }

  getLandscapeSolution() {
    return (
      <table className="mainTab">
        <tbody>
          <tr>
            <td colSpan={this.game.n}>
              <button
                id="homeBut"
                className="smallButton"
                type="submit"
                onClick={() => this.changePage(idPage["P_MAIN"])}
              >
                <img src={home} width="20" alt="home" />
              </button>
              {"#" + this.game.hash}
            </td>
          </tr>
          <tr>
            <td colSpan={this.game.n}>
              {traduction[this.state.language]["CODE"] + " : " + this.game.code}
            </td>
          </tr>
          <tr>
            <td id="spot">A</td>
            <td id="spot">B</td>
            <td id="spot">C</td>
            <td id="spot">D</td>
            {this.game.n > 4 ? <td id="spot">E</td> : null}
            {this.game.n > 5 ? <td id="spot">F</td> : null}
          </tr>
          <tr>
            <td>
              <button
                id="solBut"
                className="solButton"
                type="submit"
                style={{
                  backgroundImage:
                    "url('https://www.pcspace.com/tl/img/laws/" +
                    this.game.law[0] +
                    "_Mini.jpg')"
                }}
              ></button>
            </td>
            <td>
              <button
                id="solBut"
                className="solButton"
                type="submit"
                style={{
                  backgroundImage:
                    "url('https://www.pcspace.com/tl/img/laws/" +
                    this.game.law[1] +
                    "_Mini.jpg')"
                }}
              ></button>
            </td>
            <td>
              <button
                id="solBut"
                className="solButton"
                type="submit"
                style={{
                  backgroundImage:
                    "url('https://www.pcspace.com/tl/img/laws/" +
                    this.game.law[2] +
                    "_Mini.jpg')"
                }}
              ></button>
            </td>
            <td>
              <button
                id="solBut"
                className="solButton"
                type="submit"
                style={{
                  backgroundImage:
                    "url('https://www.pcspace.com/tl/img/laws/" +
                    this.game.law[3] +
                    "_Mini.jpg')"
                }}
              ></button>
            </td>
            {this.game.n > 4 ? (
              <td>
                <button
                  id="solBut"
                  className="solButton"
                  type="submit"
                  style={{
                    backgroundImage:
                      "url('https://www.pcspace.com/tl/img/laws/" +
                      this.game.law[4] +
                      "_Mini.jpg')"
                  }}
                ></button>
              </td>
            ) : null}
            {this.game.n > 5 ? (
              <td>
                <button
                  id="solBut"
                  className="solButton"
                  type="submit"
                  style={{
                    backgroundImage:
                      "url('https://www.pcspace.com/tl/img/laws/" +
                      this.game.law[5] +
                      "_Mini.jpg')"
                  }}
                ></button>
              </td>
            ) : null}
          </tr>
          <tr>
            <td colSpan={this.game.n}>
              <input
                className="smallButton"
                type="button"
                value={traduction[this.state.language]["BACK"]}
                onClick={() => this.changePage(idPage["P_INGAME"])}
              />
            </td>
          </tr>
        </tbody>
      </table>
    );
  }

  getPortraitSolution() {
    return (
      <table className="mainTab">
        <tbody>
          <tr>
            <td colSpan="3">
              <button
                id="homeBut"
                className="smallButton"
                type="submit"
                onClick={() => this.changePage(idPage["P_MAIN"])}
              >
                <img src={home} width="20" alt="home" />
              </button>
              {"#" + this.game.hash}
            </td>
          </tr>
          <tr>
            <td colSpan="3">
              {traduction[this.state.language]["CODE"] + " : " + this.game.code}
            </td>
          </tr>
          <tr>
            <td id="spot">A</td>
            <td colSpan="2">
              <button
                id="solBut"
                className="solButton"
                type="submit"
                style={{
                  backgroundImage:
                    "url('https://www.pcspace.com/tl/img/laws/" +
                    this.game.law[0] +
                    "_Mini.jpg')"
                }}
              ></button>
            </td>
          </tr>
          <tr>
            <td id="spot">B</td>
            <td colSpan="2">
              <button
                id="solBut"
                className="solButton"
                type="submit"
                style={{
                  backgroundImage:
                    "url('https://www.pcspace.com/tl/img/laws/" +
                    this.game.law[1] +
                    "_Mini.jpg')"
                }}
              ></button>
            </td>
          </tr>
          <tr>
            <td id="spot">C</td>
            <td colSpan="2">
              <button
                id="solBut"
                className="solButton"
                type="submit"
                style={{
                  backgroundImage:
                    "url('https://www.pcspace.com/tl/img/laws/" +
                    this.game.law[2] +
                    "_Mini.jpg')"
                }}
              ></button>
            </td>
          </tr>
          <tr>
            <td id="spot">D</td>
            <td colSpan="2">
              <button
                id="solBut"
                className="solButton"
                type="submit"
                style={{
                  backgroundImage:
                    "url('https://www.pcspace.com/tl/img/laws/" +
                    this.game.law[3] +
                    "_Mini.jpg')"
                }}
              ></button>
            </td>
          </tr>
          {this.game.n > 4 ? (
            <tr>
              <td id="spot">E</td>
              <td colSpan="2">
                <button
                  id="solBut"
                  className="solButton"
                  type="submit"
                  style={{
                    backgroundImage:
                      "url('https://www.pcspace.com/tl/img/laws/" +
                      this.game.law[4] +
                      "_Mini.jpg')"
                  }}
                ></button>
              </td>
            </tr>
          ) : null}
          {this.game.n > 5 ? (
            <tr>
              <td id="spot">F</td>
              <td colSpan="2">
                <button
                  id="solBut"
                  className="solButton"
                  type="submit"
                  style={{
                    backgroundImage:
                      "url('https://www.pcspace.com/tl/img/laws/" +
                      this.game.law[5] +
                      "_Mini.jpg')"
                  }}
                ></button>
              </td>
            </tr>
          ) : null}
          <tr>
            <td colSpan="3">
              <input
                className="smallButton"
                type="button"
                value={traduction[this.state.language]["BACK"]}
                onClick={() => this.changePage(idPage["P_INGAME"])}
              />
            </td>
          </tr>
        </tbody>
      </table>
    );
  }

  getLandscapeAdvancedMenu() {
    return (
      <table className="mainTab">
        <tbody>
          <tr>
            <td>
              {this.state.page !== idPage["P_MAIN"] ? (
                <button
                  id="homeBut"
                  className="smallButton"
                  type="submit"
                  onClick={() => this.changePage(idPage["P_MAIN"])}
                >
                  <img src={home} width="20" alt="home" />
                </button>
              ) : null}
              {this.getAdvancedButton(0, 0, "COMPETITIVE")}
            </td>
            <td>{this.getAdvancedButton(1, 0, "CLASSIC")}</td>
            <td>{this.getAdvancedButton(2, 0, "EASY")}</td>
            <td>{this.getAdvancedButton(3, 0, "V4")}</td>
            <td></td>
          </tr>
          <tr>
            <td>{this.getAdvancedButton(0, 1, "SOLO")}</td>
            <td>{this.getAdvancedButton(1, 1, "EXTREME")}</td>
            <td>{this.getAdvancedButton(2, 1, "MEDIUM")}</td>
            <td>{this.getAdvancedButton(3, 1, "V5")}</td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td>{this.getAdvancedButton(1, 2, "NIGHTMARE")}</td>
            <td>{this.getAdvancedButton(2, 2, "HARD")}</td>
            <td>{this.getAdvancedButton(3, 2, "V6")}</td>
            <td>
              <input
                className="advButton"
                type="button"
                value={traduction[this.state.language]["PLAY"]}
                onClick={() => this.playAdvanced()}
              />
            </td>
          </tr>
        </tbody>
      </table>
    );
  }

  getPortraitAdvancedMenu() {
    return (
      <table className="mainTab">
        <tbody>
          <tr>
            <td>
              {this.state.page !== idPage["P_MAIN"] ? (
                <button
                  id="homeBut"
                  className="smallButton"
                  type="submit"
                  onClick={() => this.changePage(idPage["P_MAIN"])}
                >
                  <img src={home} width="20" alt="home" />
                </button>
              ) : null}
              {this.getAdvancedButton(0, 0, "COMPETITIVE")}
            </td>
            <td>{this.getAdvancedButton(0, 1, "SOLO")}</td>
            <td></td>
          </tr>
          <tr>
            <td>{this.getAdvancedButton(1, 0, "CLASSIC")}</td>
            <td>{this.getAdvancedButton(1, 1, "EXTREME")}</td>
            <td>{this.getAdvancedButton(1, 2, "NIGHTMARE")}</td>
          </tr>
          <tr>
            <td>{this.getAdvancedButton(2, 0, "EASY")}</td>
            <td>{this.getAdvancedButton(2, 1, "MEDIUM")}</td>
            <td>{this.getAdvancedButton(2, 2, "HARD")}</td>
          </tr>
          <tr>
            <td>{this.getAdvancedButton(3, 0, "V4")}</td>
            <td>{this.getAdvancedButton(3, 1, "V5")}</td>
            <td>{this.getAdvancedButton(3, 2, "V6")}</td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td>
              <input
                className="advButton"
                type="button"
                value={traduction[this.state.language]["PLAY"]}
                onClick={() => this.playAdvanced()}
              />
            </td>
          </tr>
        </tbody>
      </table>
    );
  }

  getLandscapeMainPage() {
    return (
      <table className="mainTab">
        <tbody>
          <tr>
            <td>
              {this.state.page !== idPage["P_MAIN"] ? (
                <button
                  id="homeBut"
                  className="smallButton"
                  type="submit"
                  onClick={() => this.changePage(idPage["P_MAIN"])}
                >
                  <img src={home} width="20" alt="home" />
                </button>
              ) : null}
              {this.state.historicalData ? (
                <button
                  id="histBut"
                  className="smallButton"
                  type="submit"
                  onClick={() => this.changePage(idPage["P_HIST"])}
                >
                  <img src={history} width="20" alt="history" />
                </button>
              ) : null}
              <form onSubmit={() => this.hashGame()}>
                <input
                  className="text"
                  type="text"
                  defaultValue=""
                  placeholder={traduction[this.state.language]["SEARCH"]}
                  size="10"
                  onChange={(e) => this.handleChange(e.target.value)}
                />
              </form>
              <br />
              <img
                src={imgBox[this.state.language]}
                width={this.state.sizeImage}
                height="auto"
                alt="tm"
              />
              <br />
              {this.getOptionMenu()}
            </td>
            <td>{this.getMainMenu()}</td>
          </tr>
        </tbody>
      </table>
    );
  }

  getPortraitMainPage() {
    return (
      <table className="mainTab">
        <tbody>
          <tr>
            <td>
              {this.state.page !== idPage["P_MAIN"] ? (
                <button
                  id="homeBut"
                  className="smallButton"
                  type="submit"
                  onClick={() => this.changePage(idPage["P_MAIN"])}
                >
                  <img src={home} width="20" alt="home" />
                </button>
              ) : null}
              {this.state.historicalData ? (
                <button
                  id="histBut"
                  className="smallButton"
                  type="submit"
                  onClick={() => this.changePage(idPage["P_HIST"])}
                >
                  <img src={history} width="20" alt="history" />
                </button>
              ) : null}
              <form onSubmit={() => this.hashGame()}>
                <input
                  className="text"
                  type="text"
                  defaultValue=""
                  placeholder={traduction[this.state.language]["SEARCH"]}
                  size="10"
                  onChange={(e) => this.handleChange(e.target.value)}
                />
              </form>
              <img
                src={imgBox[this.state.language]}
                width={this.state.sizeImage}
                height="auto"
                alt="tm"
              />
            </td>
          </tr>
          <tr>
            <td>{this.getMainMenu()}</td>
          </tr>
          <tr>
            <td>{this.getOptionMenu()}</td>
          </tr>
        </tbody>
      </table>
    );
  }
}

const container = document.getElementById("root");
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(<App tab="home" />);
