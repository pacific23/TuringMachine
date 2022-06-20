import React from "react";
import ReactDOM from "react-dom";
import Cookies from "universal-cookie";
import "./styles.css";

import box from "./images/Box.jpg";
import number from "./images/Number.png";
import history from "./images/History.png";
import home from "./images/Home.png";
import langFR from "./images/LangFR.png";
import langEN from "./images/LangEN.png";

const imgLang = [langFR, langEN];
const cookies = new Cookies();

var userID = "";
var historicalGames;
var traduction = [
  [
    "FR",
    "PARTIE RAPIDE",
    "PARTIE DU JOUR",
    "PARTIE AVANCEE",
    "A PROPOS",
    "CHARGER",
    "IMPOSSIBLE DE CHARGER UNE PARTIE",
    "COMPETITIF",
    "SOLO / COOP",
    "CLASSIQUE",
    "EXTREME",
    "CAUCHEMAR",
    "FACILE",
    "MOYEN",
    "DIFFICILE",
    "4",
    "5",
    "6",
    "JOUER",
    "CHARGEMENT...",
    "SOLUTION",
    "RETOUR",
    "VOIR LA SOLUTION ?",
    "OUI",
    "NON",
    "CODE"
  ],
  [
    "EN",
    "QUICK GAME",
    "GAME OF THE DAY",
    "ADVANCED GAME",
    "ABOUT",
    "LOAD",
    "UNABLE TO LOAD GAME",
    "COMPETITIVE",
    "SOLO / COOP",
    "CLASSIC",
    "EXTREME",
    "NIGHTMARE",
    "EASY",
    "MIDDLE",
    "HARD",
    "4",
    "5",
    "6",
    "PLAY",
    "LOADING...",
    "SOLUTION",
    "BACK",
    "SHOW SOLUTION?",
    "YES",
    "NO",
    "CODE"
  ]
];

class App extends React.Component {
  state = {
    landscapeMode: true,
    sizeImage: 1,
    page: 0,
    historicalData: false,
    language: 0,
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
    sortedCrypt: [0, 0, 0, 0, 0, 0]
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
    if (this.state.language == 0) {
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
        sizeImage: Math.min(sizex * 0.9, sizey / 2),
        landscapeMode: sizex < sizey ? false : true
      });
    } else {
      this.setState({
        sizeImage: Math.min(sizex / 2, sizey - 75),
        landscapeMode: sizex < sizey ? false : true
      });
    }
  }

  addGame(hash) {
    for (var i = 0; i < historicalGames.length; i++) {
      if (historicalGames[i] == hash) {
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
      if (Math.floor(Math.random() * 2) == 0) {
        var n = this.game.ind[i];
        this.game.ind[i] = this.game.fake[i];
        this.game.fake[i] = n;
      }
    }
  }

  sortCrypt() {
    this.game.sortCrypt = [...this.game.crypt];
    this.game.sortCrypt.sort();
  }

  loadGame(url) {
    this.setState({ page: 3 });
    var xhr = new XMLHttpRequest();

    xhr.addEventListener("load", () => {
      var data = xhr.responseText;
      if (data.length == 0) {
        this.setState({ page: 5 });
        return;
      }
      var jsonResponse = JSON.parse(data);
      if (jsonResponse["status"] == "ok") {
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
        if (this.game.m == 1) {
          this.shuffleIndFake();
        }
        if (this.game.m == 2) {
          this.sortCrypt();
        }
        this.setState({ page: 4 });
      } else {
        this.setState({ page: 5 });
      }
    });
    xhr.addEventListener("error", () => {
      this.setState({ page: 5 });
    });
    xhr.addEventListener("abort", () => {
      this.setState({ page: 5 });
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

  clickSolution() {
    this.setState({ page: 10 });
  }

  clickAbout() {
    this.setState({ page: 8 });
  }

  getHistorical() {
    this.setState({ page: 6 });
  }

  advancedGame() {
    this.setState({ page: 2 });
  }

  clickSharp() {
    this.setState({ page: 1 });
  }

  backHome() {
    this.setState({ page: 0 });
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
    if (this.state.page == 0 || this.state.page == 1) {
      return (
        <div className="App">
          {this.state.landscapeMode
            ? this.getLandscapeMainPage()
            : this.getPortraitMainPage()}
        </div>
      );
    }
    if (this.state.page == 2) {
      return (
        <div className="App">
          {this.state.landscapeMode
            ? this.getLandscapeAdvancedMenu()
            : this.getPortraitAdvancedMenu()}
        </div>
      );
    }
    if (this.state.page == 3) {
      return (
        <div className="App">
          <table class="mainTab">
            <tr>
              <td>{traduction[this.state.language][19]}</td>
            </tr>
          </table>
        </div>
      );
    }
    if (this.state.page == 4 || this.state.page == 9) {
      return (
        <div className="App">
          {this.state.landscapeMode
            ? this.getLandscapeGame()
            : this.getPortraitGame()}
        </div>
      );
    }
    if (this.state.page == 5) {
      return (
        <div className="App">
          <table class="mainTab">
            <tr>
              <td>
                <button
                  id="homeBut"
                  class="smallButton"
                  type="submit"
                  onClick={() => this.backHome()}
                >
                  <img src={home} width="20" />
                </button>
                {traduction[this.state.language][6]}
              </td>
            </tr>
          </table>
        </div>
      );
    }
    if (this.state.page == 6) {
      return (
        <div className="App">
          <table class="mainTab">
            <tr>
              <td>
                <button
                  id="homeBut"
                  class="smallButton"
                  type="submit"
                  onClick={() => this.backHome()}
                >
                  <img src={home} width="20" />
                </button>
              </td>
            </tr>
            <div class="scrollmenu">{this.getListHistorical()}</div>
          </table>
        </div>
      );
    }
    if (this.state.page == 8) {
      return (
        <div className="App">
          <table class="mainTab">
            <tr>
              <td>
                <button
                  id="homeBut"
                  class="smallButton"
                  type="submit"
                  onClick={() => this.backHome()}
                >
                  <img src={home} width="20" />
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
          </table>
        </div>
      );
    }
    if (this.state.page == 10) {
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
      <div>
        <input
          class="button"
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
      <table class="mainTab">
        <tr>
          <td>
            {this.state.page == 0 ? (
              <table class="mainTab">
                <tr>
                  <td>
                    <input
                      class="button"
                      type="button"
                      value={traduction[this.state.language][1]}
                      onClick={() => this.quickGame()}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <input
                      class="button"
                      type="button"
                      value={traduction[this.state.language][2]}
                      onClick={() => this.gameOfTheDay()}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <input
                      class="button"
                      type="button"
                      value={traduction[this.state.language][3]}
                      onClick={() => this.advancedGame()}
                    />
                  </td>
                </tr>
              </table>
            ) : null}
            {this.state.page == 1 ? (
              <table class="mainTab">
                <tr>
                  <td>
                    <input
                      autoFocus
                      class="text"
                      type="text"
                      defaultValue="#"
                      size="10"
                      onChange={(e) => this.handleChange(e.target.value)}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <input
                      class="button"
                      type="button"
                      value={traduction[this.state.language][5]}
                      onClick={() => this.hashGame()}
                    />
                  </td>
                </tr>
              </table>
            ) : null}
          </td>
        </tr>
      </table>
    );
  }

  getOptionMenu() {
    return (
      <div>
        <button
          class="smallButton"
          type="submit"
          onClick={() => this.clickSharp()}
        >
          <img src={number} width="20" />
        </button>
        &nbsp;
        <input
          class="smallButton"
          type="button"
          value={traduction[this.state.language][4]}
          onClick={() => this.clickAbout()}
        />
        &nbsp;
        <button
          class="smallButton"
          type="submit"
          onClick={() => this.swapLanguage()}
        >
          <img src={imgLang[this.state.language]} width="20" />
        </button>
      </div>
    );
  }

  getAdvancedButton(column, row, textValue) {
    return (
      <input
        class={
          this.state.advancedSettings[column] == row
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
        class={
          this.state.advancedSettings[column] == row
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
      <table class="mainTab">
        <tr>
          <td colspan={this.game.n}>
            <button
              id="homeBut"
              class="smallButton"
              type="submit"
              onClick={() => this.backHome()}
            >
              <img src={home} width="20" />
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
        <tr>
          <td>
            <input class="ind" type="button" value={this.game.ind[0]} />
          </td>
          <td>
            <input class="ind" type="button" value={this.game.ind[1]} />
          </td>
          <td>
            <input class="ind" type="button" value={this.game.ind[2]} />
          </td>
          <td>
            <input class="ind" type="button" value={this.game.ind[3]} />
          </td>
          {this.game.n > 4 ? (
            <td>
              <input class="ind" type="button" value={this.game.ind[4]} />
            </td>
          ) : null}
          {this.game.n > 5 ? (
            <td>
              <input class="ind" type="button" value={this.game.ind[5]} />
            </td>
          ) : null}
        </tr>
        {this.game.m == 1 ? (
          <tr>
            <td>
              <input class="ind" type="button" value={this.game.fake[0]} />
            </td>
            <td>
              <input class="ind" type="button" value={this.game.fake[1]} />
            </td>
            <td>
              <input class="ind" type="button" value={this.game.fake[2]} />
            </td>
            <td>
              <input class="ind" type="button" value={this.game.fake[3]} />
            </td>
            {this.game.n > 4 ? (
              <td>
                <input class="ind" type="button" value={this.game.fake[4]} />
              </td>
            ) : null}
            {this.game.n > 5 ? (
              <td>
                <input class="ind" type="button" value={this.game.fake[5]} />
              </td>
            ) : null}
          </tr>
        ) : null}
        {this.game.m == 2 ? (
          <tr id={"color" + this.game.color}>
            <td colspan={this.game.n}>
              {this.game.sortCrypt[0]} {this.game.sortCrypt[1]}{" "}
              {this.game.sortCrypt[2]} {this.game.sortCrypt[3]}
              {this.game.n > 4 ? " " + this.game.sortCrypt[4] : null}
              {this.game.n > 5 ? " " + this.game.sortCrypt[5] : null}
            </td>
          </tr>
        ) : (
          <tr id={"color" + this.game.color}>
            <td>{this.game.crypt[0]}</td>
            <td>{this.game.crypt[1]}</td>
            <td>{this.game.crypt[2]}</td>
            <td>{this.game.crypt[3]}</td>
            {this.game.n > 4 ? <td>{this.game.crypt[4]}</td> : null}
            {this.game.n > 5 ? <td>{this.game.crypt[5]}</td> : null}
          </tr>
        )}
        <tr>
          {this.state.page == 4 ? (
            <td colspan={this.game.n}>
              <input
                class="smallButton"
                type="button"
                value={traduction[this.state.language][20]}
                onClick={() => this.clickSolution()}
              />
            </td>
          ) : (
            <td colspan={this.game.n}>
              <input
                class="smallButton"
                type="button"
                value={traduction[this.state.language][24]}
                onClick={() => {
                  this.setState({ page: 4 });
                }}
              />
              &nbsp;
              <input
                class="smallButton"
                type="button"
                value={traduction[this.state.language][22]}
              />
              &nbsp;
              <input
                class="smallButton"
                type="button"
                value={traduction[this.state.language][23]}
                onClick={() => {
                  this.setState({ page: 10 });
                }}
              />
            </td>
          )}
        </tr>
      </table>
    );
  }

  getPortraitGame() {
    return (
      <table class="mainTab">
        <tr>
          <td colspan={this.game.m == 1 ? 4 : this.game.m == 2 ? 2 : 3}>
            <button
              id="homeBut"
              class="smallButton"
              type="submit"
              onClick={() => this.backHome()}
            >
              <img src={home} width="20" />
            </button>
            {"#" + this.game.hash}
          </td>
        </tr>
        <tr>
          <td id="spot">A</td>
          <td>
            <input class="ind" type="button" value={this.game.ind[0]} />
          </td>
          {this.game.m == 1 ? (
            <td>
              <input class="ind" type="button" value={this.game.fake[0]} />
            </td>
          ) : null}
          {this.game.m != 2 ? (
            <td id={"color" + this.game.color}>{this.game.crypt[0]}</td>
          ) : null}
        </tr>
        <tr>
          <td id="spot">B</td>
          <td>
            <input class="ind" type="button" value={this.game.ind[1]} />
          </td>
          {this.game.m == 1 ? (
            <td>
              <input class="ind" type="button" value={this.game.fake[1]} />
            </td>
          ) : null}
          {this.game.m != 2 ? (
            <td id={"color" + this.game.color}>{this.game.crypt[1]}</td>
          ) : null}
        </tr>
        <tr>
          <td id="spot">C</td>
          <td>
            <input class="ind" type="button" value={this.game.ind[2]} />
          </td>
          {this.game.m == 1 ? (
            <td>
              <input class="ind" type="button" value={this.game.fake[2]} />
            </td>
          ) : null}
          {this.game.m != 2 ? (
            <td id={"color" + this.game.color}>{this.game.crypt[2]}</td>
          ) : null}
        </tr>
        <tr>
          <td id="spot">D</td>
          <td>
            <input class="ind" type="button" value={this.game.ind[3]} />
          </td>
          {this.game.m == 1 ? (
            <td>
              <input class="ind" type="button" value={this.game.fake[3]} />
            </td>
          ) : null}
          {this.game.m != 2 ? (
            <td id={"color" + this.game.color}>{this.game.crypt[3]}</td>
          ) : null}
        </tr>
        {this.game.n > 4 ? (
          <tr>
            <td id="spot">E</td>
            <td>
              <input class="ind" type="button" value={this.game.ind[4]} />
            </td>
            {this.game.m == 1 ? (
              <td>
                <input class="ind" type="button" value={this.game.fake[4]} />
              </td>
            ) : null}
            {this.game.m != 2 ? (
              <td id={"color" + this.game.color}>{this.game.crypt[4]}</td>
            ) : null}
          </tr>
        ) : null}
        {this.game.n > 5 ? (
          <tr>
            <td id="spot">F</td>
            <td>
              <input class="ind" type="button" value={this.game.ind[5]} />
            </td>
            {this.game.m == 1 ? (
              <td>
                <input class="ind" type="button" value={this.game.fake[5]} />
              </td>
            ) : null}
            {this.game.m != 2 ? (
              <td id={"color" + this.game.color}>{this.game.crypt[5]}</td>
            ) : null}
          </tr>
        ) : null}
        {this.game.m == 2 ? (
          <tr id={"color" + this.game.color}>
            <td colspan="2">
              {this.game.sortCrypt[0]} {this.game.sortCrypt[1]}{" "}
              {this.game.sortCrypt[2]} {this.game.sortCrypt[3]}
              {this.game.n > 4 ? " " + this.game.sortCrypt[4] : null}
              {this.game.n > 5 ? " " + this.game.sortCrypt[5] : null}
            </td>
          </tr>
        ) : null}
        <tr>
          {this.state.page == 4 ? (
            <td colspan={this.game.m == 1 ? 4 : this.game.m == 2 ? 2 : 3}>
              <input
                class="smallButton"
                type="button"
                value={traduction[this.state.language][20]}
                onClick={() => this.clickSolution()}
              />
            </td>
          ) : (
            <td colspan={this.game.m == 1 ? 4 : this.game.m == 2 ? 2 : 3}>
              <input
                class="smallButton"
                type="button"
                value={traduction[this.state.language][24]}
                onClick={() => {
                  this.setState({ page: 4 });
                }}
              />
              &nbsp;
              <input
                class="smallButton"
                type="button"
                value={traduction[this.state.language][22]}
              />
              &nbsp;
              <input
                class="smallButton"
                type="button"
                value={traduction[this.state.language][23]}
                onClick={() => {
                  this.setState({ page: 10 });
                }}
              />
            </td>
          )}
        </tr>
      </table>
    );
  }

  getLandscapeSolution() {
    return (
      <table class="mainTab">
        <tr>
          <td colspan={this.game.n}>
            <button
              id="homeBut"
              class="smallButton"
              type="submit"
              onClick={() => this.backHome()}
            >
              <img src={home} width="20" />
            </button>
            {"#" + this.game.hash}
          </td>
        </tr>
        <tr>
          <td colspan={this.game.n}>
            {traduction[this.state.language][25] + " : " + this.game.code}
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
              class="solButton"
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
              class="solButton"
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
              class="solButton"
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
              class="solButton"
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
                class="solButton"
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
                class="solButton"
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
          <td colspan={this.game.n}>
            <input
              class="smallButton"
              type="button"
              value={traduction[this.state.language][21]}
              onClick={() => this.setState({ page: 4 })}
            />
          </td>
        </tr>
      </table>
    );
  }

  getPortraitSolution() {
    return (
      <table class="mainTab">
        <tr>
          <td colspan="3">
            <button
              id="homeBut"
              class="smallButton"
              type="submit"
              onClick={() => this.backHome()}
            >
              <img src={home} width="20" />
            </button>
            {"#" + this.game.hash}
          </td>
        </tr>
        <tr>
          <td colspan="3">
            {traduction[this.state.language][25] + " : " + this.game.code}
          </td>
        </tr>
        <tr>
          <td id="spot">A</td>
          <td colspan="2">
            <button
              id="solBut"
              class="solButton"
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
          <td colspan="2">
            <button
              id="solBut"
              class="solButton"
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
          <td colspan="2">
            <button
              id="solBut"
              class="solButton"
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
          <td colspan="2">
            <button
              id="solBut"
              class="solButton"
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
            <td colspan="2">
              <button
                id="solBut"
                class="solButton"
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
            <td colspan="2">
              <button
                id="solBut"
                class="solButton"
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
          <td colspan="3">
            <input
              class="smallButton"
              type="button"
              value={traduction[this.state.language][21]}
              onClick={() => this.setState({ page: 4 })}
            />
          </td>
        </tr>
      </table>
    );
  }

  getLandscapeAdvancedMenu() {
    return (
      <table class="mainTab">
        <tr>
          <td>
            {this.state.page != 0 ? (
              <button
                id="homeBut"
                class="smallButton"
                type="submit"
                onClick={() => this.backHome()}
              >
                <img src={home} width="20" />
              </button>
            ) : null}
            {this.getAdvancedButton(0, 0, 7)}
          </td>
          <td>{this.getAdvancedButton(1, 0, 9)}</td>
          <td>{this.getAdvancedButton(2, 0, 12)}</td>
          <td>{this.getAdvancedButton(3, 0, 15)}</td>
          <td></td>
        </tr>
        <tr>
          <td>{this.getAdvancedButton(0, 1, 8)}</td>
          <td>{this.getAdvancedButton(1, 1, 10)}</td>
          <td>{this.getAdvancedButton(2, 1, 13)}</td>
          <td>{this.getAdvancedButton(3, 1, 16)}</td>
          <td></td>
        </tr>
        <tr>
          <td></td>
          <td>{this.getAdvancedButton(1, 2, 11)}</td>
          <td>{this.getAdvancedButton(2, 2, 14)}</td>
          <td>{this.getAdvancedButton(3, 2, 17)}</td>
          <td>
            <input
              class="advButton"
              type="button"
              value={traduction[this.state.language][18]}
              onClick={() => this.playAdvanced()}
            />
          </td>
        </tr>
      </table>
    );
  }

  getPortraitAdvancedMenu() {
    return (
      <table class="mainTab">
        <tr>
          <td>
            {this.state.page != 0 ? (
              <button
                id="homeBut"
                class="smallButton"
                type="submit"
                onClick={() => this.backHome()}
              >
                <img src={home} width="20" />
              </button>
            ) : null}
            {this.getAdvancedButton(0, 0, 7)}
          </td>
          <td>{this.getAdvancedButton(0, 1, 8)}</td>
          <td></td>
        </tr>
        <tr>
          <td>{this.getAdvancedButton(1, 0, 9)}</td>
          <td>{this.getAdvancedButton(1, 1, 10)}</td>
          <td>{this.getAdvancedButton(1, 2, 11)}</td>
        </tr>
        <tr>
          <td>{this.getAdvancedButton(2, 0, 12)}</td>
          <td>{this.getAdvancedButton(2, 1, 13)}</td>
          <td>{this.getAdvancedButton(2, 2, 14)}</td>
        </tr>
        <tr>
          <td>{this.getAdvancedButton(3, 0, 15)}</td>
          <td>{this.getAdvancedButton(3, 1, 16)}</td>
          <td>{this.getAdvancedButton(3, 2, 17)}</td>
        </tr>
        <tr>
          <td></td>
          <td></td>
          <td>
            <input
              class="advButton"
              type="button"
              value={traduction[this.state.language][18]}
              onClick={() => this.playAdvanced()}
            />
          </td>
        </tr>
      </table>
    );
  }

  getLandscapeMainPage() {
    return (
      <table class="mainTab">
        <tr>
          <td>
            {this.state.page != 0 ? (
              <button
                id="homeBut"
                class="smallButton"
                type="submit"
                onClick={() => this.backHome()}
              >
                <img src={home} width="20" />
              </button>
            ) : null}
            {this.state.historicalData ? (
              <button
                id="histBut"
                class="smallButton"
                type="submit"
                onClick={() => this.getHistorical()}
              >
                <img src={history} width="20" />
              </button>
            ) : null}
            <img src={box} width={this.state.sizeImage} />
            <br />
            {this.getOptionMenu()}
          </td>
          <td>{this.getMainMenu()}</td>
        </tr>
      </table>
    );
  }

  getPortraitMainPage() {
    return (
      <table class="mainTab">
        <tr>
          <td>
            {this.state.page != 0 ? (
              <button
                id="homeBut"
                class="smallButton"
                type="submit"
                onClick={() => this.backHome()}
              >
                <img src={home} width="20" />
              </button>
            ) : null}
            {this.state.historicalData ? (
              <button
                id="histBut"
                class="smallButton"
                type="submit"
                onClick={() => this.getHistorical()}
              >
                <img src={history} width="20" />
              </button>
            ) : null}
            <img src={box} width={this.state.sizeImage} />
          </td>
        </tr>
        <tr>
          <td>{this.getMainMenu()}</td>
        </tr>
        <tr>
          <td>{this.getOptionMenu()}</td>
        </tr>
      </table>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
