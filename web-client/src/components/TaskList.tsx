import React, { useState, useEffect } from 'react'
import type { Task } from '../types/index'

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([])

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('http://localhost:8080/tasks')
        const data = await response.json()
        setTasks(data)
      } catch (error) {
        console.error('タスクの取得中にエラーが発生しました:', error)
      }
    }

    fetchTasks()
  }, [])

  return (
    <div>
      <h1>タスク一覧</h1>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            {task.title} - {task.isCompleted ? '完了' : '未完了'}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default TaskList
