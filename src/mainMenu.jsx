import { Component } from "react";
import traduction from "./language";

class mainMenu extends Component {
  render() {
    return (
      <table className="mainTab">
        <tbody>
          <tr>
            <td>
              {this.state.page === 0 ? (
                <table className="mainTab">
                  <tbody>
                    <tr>
                      <td>
                        <input
                          className="button"
                          type="button"
                          value={traduction[this.state.language][1]}
                          onClick={() => this.quickGame()}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <input
                          className="button"
                          type="button"
                          value={traduction[this.state.language][2]}
                          onClick={() => this.gameOfTheDay()}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <input
                          className="button"
                          type="button"
                          value={traduction[this.state.language][3]}
                          onClick={() => this.advancedGame()}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <button className="button" type="button">
                          <PrintIcon />
                          &nbsp;
                          {traduction[this.state.language][26]}
                          &nbsp;
                          <PrintIcon />
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              ) : null}
              {this.state.page === 1 ? (
                <table className="mainTab">
                  <tbody>
                    <tr>
                      <td>
                        <input
                          autoFocus
                          className="text"
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
                          className="button"
                          type="button"
                          value={traduction[this.state.language][5]}
                          onClick={() => this.hashGame()}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              ) : null}
            </td>
          </tr>
        </tbody>
      </table>
    );
  }
}

export default mainMenu;
