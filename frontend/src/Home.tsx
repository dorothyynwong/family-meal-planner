import SideMenu from "./Components/SideMenu/SideMenu"
import "../src/styles/global.scss"
import HeaderMenu from "./Components/HeaderMenu/HeaderMenu"

function Home() {

  return (
    <div className="custom-background">
      <HeaderMenu name="Evie Cheng" />
      <SideMenu />
    </div>
  )
}

export default Home
