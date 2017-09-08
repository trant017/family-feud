import React from 'react'

const TeamCard = ({team, isActive}) => {
  return (
    <div key={team.name} className={`team${isActive ? ' active' : ''}`}>
      <div className="name">{team.name}</div>
      <div className="score">
        {team.score}
      </div>
    </div>
  )
}

export default TeamCard
