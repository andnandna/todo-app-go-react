import React, { useState, FormEvent } from 'react'
import type { Task } from '../types/index'

interface TaskFormProps {
  onTaskCreated: () => void
}

const TaskForm: React.FC<TaskFormProps> = ({ onTaskCreated }) => {
  const [title, setTitle] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!title.trim()) return

    try {
      const response = await fetch('http://localhost:8080/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title })
      })

      if (!response.ok) {
        throw new Error('タスクの作成に失敗しました')
      }

      // フォームをリセット
      setTitle('')
      // 親コンポーネントに通知
      onTaskCreated()
    } catch (error) {
      console.error('タスク作成エラー:', error)
      alert('タスクの作成中にエラーが発生しました')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <input 
        type="text" 
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="新しいタスクを入力"
        required
        className="task-input"
      />
      <button 
        type="submit" 
        className="task-submit"
      >
        追加
      </button>
    </form>
  )
}

export default TaskForm
