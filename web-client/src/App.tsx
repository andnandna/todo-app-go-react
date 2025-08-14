import React, { useState } from 'react'
import TaskList from './components/TaskList'
import TaskForm from './components/TaskForm'
import './App.css'

function App() {
  const [refreshTasks, setRefreshTasks] = useState(0)

  const handleTaskCreated = () => {
    // タスクリストを更新するためのステート変更
    setRefreshTasks(prev => prev + 1)
  }

  return (
    <div className="app-container">
      <h1 className="app-title">ToDoアプリ</h1>
      <TaskForm onTaskCreated={handleTaskCreated} />
      <TaskList key={refreshTasks} />
    </div>
  )
}

export default App
