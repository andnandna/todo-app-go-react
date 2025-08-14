import React, { useState, useEffect } from 'react'
import type { Task } from '../types/index'

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingTask, setEditingTask] = useState<number | null>(null)
  const [editedTitle, setEditedTitle] = useState('')

  const fetchTasks = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('http://localhost:8080/tasks')
      
      if (!response.ok) {
        throw new Error('タスクの取得に失敗しました')
      }
      
      const data = await response.json()
      setTasks(data)
      setError(null)
    } catch (error) {
      console.error('タスクの取得中にエラーが発生しました:', error)
      setError(error instanceof Error ? error.message : '不明なエラー')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task.id)
    setEditedTitle(task.title)
  }

  const handleSaveTask = async (task: Task) => {
    try {
      const updatedTask = { ...task, title: editedTitle }
      
      const response = await fetch('http://localhost:8080/tasks', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTask)
      })

      if (!response.ok) {
        throw new Error('タスクの更新に失敗しました')
      }

      // ローカルステートを更新
      setTasks(tasks.map(t => 
        t.id === task.id ? { ...t, title: editedTitle } : t
      ))

      // 編集モードを終了
      setEditingTask(null)
    } catch (error) {
      console.error('タスク更新エラー:', error)
      alert('タスクの更新中にエラーが発生しました')
    }
  }

  const handleDeleteTask = async (task: Task) => {
    const confirmDelete = window.confirm(`タスク「${task.title}」を削除しますか？`)
    
    if (!confirmDelete) return

    try {
      const response = await fetch('http://localhost:8080/tasks', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(task)
      })

      if (!response.ok) {
        throw new Error('タスクの削除に失敗しました')
      }

      // ローカルステートから削除
      setTasks(tasks.filter(t => t.id !== task.id))
    } catch (error) {
      console.error('タスク削除エラー:', error)
      alert('タスクの削除中にエラーが発生しました')
    }
  }

  const handleToggleComplete = async (task: Task) => {
    try {
      const updatedTask = { ...task, isCompleted: !task.isCompleted }
      
      const response = await fetch('http://localhost:8080/tasks', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTask)
      })

      if (!response.ok) {
        throw new Error('タスクの状態更新に失敗しました')
      }

      // ローカルステートを更新
      setTasks(tasks.map(t => 
        t.id === task.id ? { ...t, isCompleted: !task.isCompleted } : t
      ))
    } catch (error) {
      console.error('タスク状態更新エラー:', error)
      alert('タスクの状態更新中にエラーが発生しました')
    }
  }

  const handleCancelEdit = () => {
    setEditingTask(null)
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  if (isLoading) {
    return <div>読み込み中...</div>
  }

  if (error) {
    return <div>エラー: {error}</div>
  }

  return (
    <div>
      <h2>タスク一覧</h2>
      {tasks.length === 0 ? (
        <p>タスクがありません</p>
      ) : (
        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task.id} className="task-item">
              {editingTask === task.id ? (
                <div>
                  <input 
                    type="text" 
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    required
                    className="task-input"
                  />
                  <button 
                    onClick={() => handleSaveTask(task)}
                    className="btn btn-edit"
                  >
                    完了
                  </button>
                  <button 
                    onClick={handleCancelEdit}
                    className="btn btn-delete"
                  >
                    キャンセル
                  </button>
                </div>
              ) : (
                <div>
                  <input 
                    type="checkbox" 
                    checked={task.isCompleted}
                    onChange={() => handleToggleComplete(task)}
                    className="task-checkbox"
                  />
                  <span 
                    className={`task-text ${task.isCompleted ? 'completed' : ''}`}
                  >
                    {task.title}
                  </span>
                  <div className="task-buttons">
                    <button 
                      onClick={() => handleEditTask(task)}
                      className="btn btn-edit"
                    >
                      編集
                    </button>
                    <button 
                      onClick={() => handleDeleteTask(task)}
                      className="btn btn-delete"
                    >
                      削除
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default TaskList
