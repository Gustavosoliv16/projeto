import "../styles/Content.css";

const Content = () => (
  <main className="main-content">
   <div className="search-container"> 
    <input id="inputsearch" type="text" placeholder="pesquisar"/>
    <button id="search-button" type="submit">Pesquisar</button>
</div>
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
