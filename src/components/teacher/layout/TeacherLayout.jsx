import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import TeacherSidebar from './TeacherSidebar.jsx'
import './TeacherLayout.css'

function TeacherLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className="teacherLayoutWrapper">
      <TeacherSidebar isCollapsed={isCollapsed} onToggleCollapse={() => setIsCollapsed((v) => !v)} />
      <main className={isCollapsed ? 'teacherLayoutMain teacherLayoutMainCollapsed' : 'teacherLayoutMain'}>
        <Outlet />
      </main>
    </div>
  )
}

export default TeacherLayout
