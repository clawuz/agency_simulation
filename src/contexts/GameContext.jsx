import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../auth/AuthProvider'
import { INITIAL_GAME_STATE, tickDay } from '../game/gameLoop'
import { advanceProject, isProjectComplete, generateProject } from '../game/projectEngine'
import { CLIENTS } from '../data/clients'
import { PROJECT_TYPES, BILLING_STRUCTURES } from '../data/projectTypes'
import { RANDOM_EVENTS, EVENT_CHANCE_PER_DAY } from '../data/events'
import { AWARDS, AWARD_CHANCE } from '../data/awards'

const GameContext = createContext(null)
const GAME_SPEED_MS = 2000
const AUTOSAVE_INTERVAL = 30000

export function GameProvider({ children }) {
  const { user } = useAuth()
  const [gameState, setGameState] = useState(INITIAL_GAME_STATE)
  const [loaded, setLoaded] = useState(false)
  const stateRef = useRef(gameState)
  stateRef.current = gameState

  // Load from Firestore
  useEffect(() => {
    if (!user) return
    getDoc(doc(db, 'users', user.uid)).then(snap => {
      if (snap.exists() && snap.data().gameState) {
        setGameState(snap.data().gameState)
      }
      setLoaded(true)
    })
  }, [user])

  // Autosave
  useEffect(() => {
    if (!user || !loaded) return
    const id = setInterval(() => {
      setDoc(doc(db, 'users', user.uid), { gameState: stateRef.current }, { merge: true })
    }, AUTOSAVE_INTERVAL)
    return () => clearInterval(id)
  }, [user, loaded])

  // Game loop
  useEffect(() => {
    if (!loaded) return
    const id = setInterval(() => {
      setGameState(prev => {
        let next = tickDay(prev)

        // Advance projects
        next = {
          ...next,
          projects: next.projects.map(p => {
            if (p.status !== 'in_progress') return p
            const advanced = advanceProject(p)
            return { ...advanced, status: isProjectComplete(advanced) ? 'completed_unbilled' : 'in_progress' }
          }),
        }

        // Random event
        if (Math.random() < EVENT_CHANCE_PER_DAY) {
          const event = RANDOM_EVENTS[Math.floor(Math.random() * RANDOM_EVENTS.length)]
          next = {
            ...next,
            budget: next.budget + (event.budgetDelta ?? 0),
            reputation: next.reputation + (event.reputationDelta ?? 0),
            eventLog: [{ ...event, day: next.currentTotalDays }, ...next.eventLog.slice(0, 19)],
          }
        }

        return next
      })
    }, GAME_SPEED_MS)
    return () => clearInterval(id)
  }, [loaded])

  function acceptProject(projectId) {
    setGameState(prev => ({
      ...prev,
      projects: prev.projectOpportunities
        .filter(p => p.id === projectId)
        .map(p => ({ ...p, status: 'in_progress' }))
        .concat(prev.projects),
      projectOpportunities: prev.projectOpportunities.filter(p => p.id !== projectId),
    }))
  }

  function findNewProject() {
    setGameState(prev => {
      if (prev.projectOpportunities.length >= 5) return prev
      const project = generateProject(CLIENTS, PROJECT_TYPES, BILLING_STRUCTURES, prev.nextProjectId)
      return {
        ...prev,
        projectOpportunities: [...prev.projectOpportunities, project],
        nextProjectId: prev.nextProjectId + 1,
      }
    })
  }

  function processBilling(projectId) {
    setGameState(prev => {
      const project = prev.projects.find(p => p.id === projectId)
      if (!project || project.status !== 'completed_unbilled') return prev
      const awardRoll = Math.random()
      let award = null
      let reputationDelta = 0
      if (awardRoll < AWARD_CHANCE) {
        award = AWARDS[Math.floor(Math.random() * AWARDS.length)]
        reputationDelta = award.reputationBonus
      }
      return {
        ...prev,
        reputation: prev.reputation + reputationDelta,
        projects: prev.projects.map(p =>
          p.id === projectId ? { ...p, status: 'billed', award } : p
        ),
      }
    })
  }

  return (
    <GameContext.Provider value={{ gameState, setGameState, loaded, acceptProject, findNewProject, processBilling }}>
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  return useContext(GameContext)
}
