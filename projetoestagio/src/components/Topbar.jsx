import "../styles/Topbar.css";

const Topbar = () => (
  <div className="topbar">
    <h1 id="logo">
      <img id="logo-img" src="./public/Brasao_Caratinga.png" alt="" />
    </h1>
    <nav>
      <a href="#home">Home</a>
      <a href="#about">About</a>
      <a href="#services">Services</a>
      <a href="#contact">Contact</a>
    </nav>
  </div>
);

export default Topbar;
