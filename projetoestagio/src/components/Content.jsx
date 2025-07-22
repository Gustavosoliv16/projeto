import "../styles/Content.css";

const Content = () => (
  <main className="main-content">
    <h2>Bem-vindo ao site de assitencia</h2>
    <p>pesquisar produto</p>
    <div id="contentbox">
      <table>
        <thead>
          <tr>
            <th id="title">Peças recentes</th>
            <th>Modelo</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>peça 1 - monitor</td>
            <td>asus 144hz</td>
          </tr>
        </tbody>
      </table>
    </div>
  </main>
);

export default Content;
