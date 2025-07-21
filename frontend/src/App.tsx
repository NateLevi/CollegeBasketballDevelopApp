import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import PlayerDashboard from './components/PlayerDashboard'
import PlayerProfile from '../Pages/PlayerProfile'
import Nav from './components/ui/nav'
import PlayerAvgs from '../Pages/PlayerAvgs'
import StatHelp from '../Pages/StatHelp'

function App() {
  return (
    <Router>
      <Nav />
      <Routes>
        <Route path="/" element={<PlayerDashboard />} />
        <Route path="/player/:pid" element={<PlayerProfile />} />
        <Route path="/player-averages" element={<PlayerAvgs />} />
        <Route path="/stat-help" element={<StatHelp />} />
      </Routes>
    </Router>
  )
}

export default App
