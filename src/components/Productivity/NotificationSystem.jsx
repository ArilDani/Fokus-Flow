import { useEffect } from 'react'
import { useStore } from '../../store/useStore'
import { parseISO, differenceInMilliseconds } from 'date-fns'

export default function NotificationSystem() {
  const tasks = useStore(state => state.tasks)

  useEffect(() => {
    // Request permission on mount
    if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      Notification.requestPermission()
    }

    // Register Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(err => console.error('SW registration failed:', err))
    }
  }, [])

  useEffect(() => {
    if (!('serviceWorker' in navigator) || Notification.permission !== 'granted') return

    // Find tasks that have notifications enabled and are not completed
    const upcomingTasks = tasks.filter(t => t.notification?.enabled && !t.completed && t.date)

    // Schedule them via Service Worker
    navigator.serviceWorker.ready.then(registration => {
      upcomingTasks.forEach(task => {
        const taskDate = parseISO(task.date)
        const leadTimeMs = parseInt(task.notification.leadTime || '60') * 60 * 1000
        const triggerTime = new Date(taskDate.getTime() - leadTimeMs)
        
        const delayMs = differenceInMilliseconds(triggerTime, new Date())

        // If the trigger time is in the future (up to 24h away to avoid huge timeouts)
        // and greater than 0
        if (delayMs > 0 && delayMs < 24 * 60 * 60 * 1000) {
          // Send to SW to schedule
          if (navigator.serviceWorker.controller) {
             navigator.serviceWorker.controller.postMessage({
               type: 'SCHEDULE_NOTIFICATION',
               title: `Fokus Flow: Waktunya untuk "${task.title}"`,
               options: {
                 body: `Aktivitas ini akan dimulai dalam ${task.notification.leadTime} menit.`,
                 icon: '/vite.svg', // generic icon
                 vibrate: [200, 100, 200, 100, 200],
                 requireInteraction: true
               },
               delayMs
             })
          }
        }
      })
    })
    
    // As a backup, we also run a local interval to play sound if the tab is open
    const intervalId = setInterval(() => {
      const now = new Date()
      upcomingTasks.forEach(task => {
        const taskDate = parseISO(task.date)
        const leadTimeMs = parseInt(task.notification.leadTime || '60') * 60 * 1000
        const triggerTime = new Date(taskDate.getTime() - leadTimeMs)
        
        // If it's exactly the minute to trigger
        const diff = Math.abs(now - triggerTime)
        if (diff < 60000) { // within 1 minute
          // Check if we already notified for this task (using session storage to prevent spam)
          const notifiedKey = `notified-${task.id}`
          if (!sessionStorage.getItem(notifiedKey)) {
             sessionStorage.setItem(notifiedKey, 'true')
             // Play sound
             if (task.notification.sound === 'bell') {
               const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3')
               // simulate duration by stopping it after X seconds if needed, 
               // but simple bell is short anyway.
               audio.play().catch(e => console.log('Audio blocked by browser:', e))
             }
          }
        }
      })
    }, 30000) // check every 30s

    return () => clearInterval(intervalId)
  }, [tasks])

  return null // Invisible component
}
