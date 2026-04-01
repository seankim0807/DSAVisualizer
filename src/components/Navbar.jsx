import React from 'react'
import './Navbar.css'

function Navbar({ activeTab, setActiveTab, tabs }) {
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <h1 className="title">DSAVisualizer</h1>
        <div className="tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
