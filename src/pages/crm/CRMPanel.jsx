import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  BarChart2, Users, PhoneCall, Mail, CheckSquare,
  Clock, AlertTriangle, TrendingUp, LogOut,
  MessageSquare, Bell, Filter, ChevronDown,
} from 'lucide-react'
import useAuthStore from '../../store/useAuthStore'

const DEMO_PIPELINE = [
  { id: 1, client: 'Игорь Воронов', phone: '+7 916 123-45-67', tour: 'Турция: Анталья', budget: 90000, stage: 'new', manager: 'Анна К.', note: 'Звонил 22 июня, интересует AI' },
  { id: 2, client: 'Светлана Миронова', phone: '+7 926 234-56-78', tour: 'Дубай: город золота', budget: 180000, stage: 'negotiation', manager: 'Павел Р.', note: 'Ждёт спецпредложение к пятнице' },
  { id: 3, client: 'Роман Белов', phone: '+7 903 345-67-89', tour: 'Мальдивы', budget: 370000, stage: 'proposal', manager: 'Анна К.', note: 'Хочет бунгало над водой на 7 ноч.' },
  { id: 4, client: 'Юлия Горбунова', phone: '+7 985 456-78-90', tour: 'Греция', budget: 120000, stage: 'won', manager: 'Павел Р.', note: 'Оплатила 100%' },
  { id: 5, client: 'Артём Фролов', phone: '+7 915 567-89-01', tour: 'Египет', budget: 85000, stage: 'lost', manager: 'Анна К.', note: 'Ушёл к конкуренту' },
]

const STAGES = {
  new:         { label: 'Новые', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  negotiation: { label: 'В работе', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
  proposal:    { label: 'КП отправлено', color: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400' },
  won:         { label: 'Выиграно ✓', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  lost:        { label: 'Отказ', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
}

const TASKS = [
  { id: 1, text: 'Перезвонить Светлане до 18:00', priority: 'high', done: false, client: 'Светлана М.' },
  { id: 2, text: 'Отправить КП по Мальдивам', priority: 'high', done: false, client: 'Роман Б.' },
  { id: 3, text: 'Уточнить даты вылета', priority: 'medium', done: true, client: 'Игорь В.' },
  { id: 4, text: 'Подтвердить бронь отеля', priority: 'low', done: true, client: 'Юлия Г.' },
]

const TABS = [
  { id: 'pipeline', label: 'Воронка продаж', icon: TrendingUp },
  { id: 'tasks', label: 'Задачи', icon: CheckSquare },
  { id: 'clients', label: 'Клиенты', icon: Users },
  { id: 'alerts', label: 'Алерты цен', icon: Bell },
]

export default function CRMPanel() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [tab, setTab] = useState('pipeline')
  const [tasks, setTasks] = useState(TASKS)
  const [leads, setLeads] = useState(DEMO_PIPELINE)

  useEffect(() => { document.title = 'CRM — ReTravel' }, [])

  const handleLogout = async () => { await logout(); navigate('/') }

  const toggleTask = (id) => setTasks((ts) => ts.map((t) => t.id === id ? { ...t, done: !t.done } : t))

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-950 flex">
      {/* sidebar */}
      <aside className="w-60 shrink-0 bg-white dark:bg-dark-900 border-r border-gray-100 dark:border-dark-800 flex flex-col">
        <div className="p-5 border-b border-gray-100 dark:border-dark-800">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-violet-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-sm">RT</span>
            </div>
            <div>
              <div className="font-black text-gray-900 dark:text-white text-sm">ReTravel</div>
              <div className="text-[10px] text-violet-500 font-semibold uppercase">CRM</div>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-0.5">
          {TABS.map((t) => {
            const Icon = t.icon
            const count = t.id === 'tasks' ? tasks.filter((x) => !x.done).length : null
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={[
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left',
                  tab === t.id
                    ? 'bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-800',
                ].join(' ')}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="flex-1">{t.label}</span>
                {count > 0 && (
                  <span className="bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{count}</span>
                )}
              </button>
            )
          })}
        </nav>

        <div className="p-3 border-t border-gray-100 dark:border-dark-800">
          <div className="px-3 py-2 mb-1">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{user?.name}</p>
            <p className="text-[10px] text-gray-400">Менеджер CRM</p>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-colors">
            <LogOut className="w-4 h-4" /> Выйти
          </button>
        </div>
      </aside>

      {/* main */}
      <main className="flex-1 min-w-0 overflow-auto p-8">
        {tab === 'pipeline' && <Pipeline leads={leads} setLeads={setLeads} />}
        {tab === 'tasks' && <Tasks tasks={tasks} toggleTask={toggleTask} />}
        {tab === 'clients' && <Clients />}
        {tab === 'alerts' && <PriceAlerts />}
      </main>
    </div>
  )
}

// ─── PIPELINE ────────────────────────────────────────────────
function Pipeline({ leads, setLeads }) {
  const stageKeys = Object.keys(STAGES)
  const won = leads.filter((l) => l.stage === 'won').reduce((s, l) => s + l.budget, 0)
  const pipeline = leads.filter((l) => !['won', 'lost'].includes(l.stage)).reduce((s, l) => s + l.budget, 0)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">Воронка продаж</h1>
        <div className="flex gap-4 text-sm">
          <div className="card px-4 py-2 text-center">
            <p className="text-xs text-gray-400">В работе</p>
            <p className="font-black text-gray-900 dark:text-white">{pipeline.toLocaleString('ru')} ₽</p>
          </div>
          <div className="card px-4 py-2 text-center">
            <p className="text-xs text-gray-400">Выиграно</p>
            <p className="font-black text-green-600">{won.toLocaleString('ru')} ₽</p>
          </div>
        </div>
      </div>

      {/* kanban */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {stageKeys.map((stage) => {
          const stageLeads = leads.filter((l) => l.stage === stage)
          return (
            <div key={stage} className="shrink-0 w-64">
              <div className="flex items-center gap-2 mb-3">
                <span className={`badge text-xs ${STAGES[stage].color}`}>{STAGES[stage].label}</span>
                <span className="text-xs text-gray-400">{stageLeads.length}</span>
              </div>
              <div className="space-y-3">
                {stageLeads.map((lead) => (
                  <div key={lead.id} className="card p-4 cursor-pointer hover:shadow-md transition-shadow">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm mb-1">{lead.client}</p>
                    <p className="text-xs text-primary-500 mb-2">{lead.tour}</p>
                    <p className="text-xs text-gray-400 mb-3 line-clamp-2">{lead.note}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-accent-500">{lead.budget.toLocaleString('ru')} ₽</span>
                      <div className="flex gap-1">
                        <a href={`tel:${lead.phone}`} className="p-1 text-gray-400 hover:text-green-500 rounded transition-colors"><PhoneCall className="w-3 h-3" /></a>
                        <button className="p-1 text-gray-400 hover:text-blue-500 rounded transition-colors"><MessageSquare className="w-3 h-3" /></button>
                      </div>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-2">{lead.manager}</p>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── TASKS ───────────────────────────────────────────────────
function Tasks({ tasks, toggleTask }) {
  const priorityBadge = {
    high: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
    medium: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
    low: 'bg-gray-100 text-gray-500 dark:bg-dark-700 dark:text-gray-400',
  }

  const pending = tasks.filter((t) => !t.done)
  const done = tasks.filter((t) => t.done)

  return (
    <div>
      <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-6">Задачи ({pending.length} активных)</h1>
      <div className="max-w-2xl space-y-3">
        {[...pending, ...done].map((task) => (
          <div
            key={task.id}
            className={`card p-4 flex items-center gap-4 transition-opacity ${task.done ? 'opacity-50' : ''}`}
          >
            <button
              onClick={() => toggleTask(task.id)}
              className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${task.done ? 'bg-green-500 border-green-500' : 'border-gray-300 dark:border-dark-600 hover:border-green-400'}`}
            >
              {task.done && <span className="text-white text-xs">✓</span>}
            </button>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium ${task.done ? 'line-through text-gray-400' : 'text-gray-900 dark:text-white'}`}>{task.text}</p>
              <p className="text-xs text-gray-400">{task.client}</p>
            </div>
            <span className={`badge text-xs shrink-0 ${priorityBadge[task.priority]}`}>
              {task.priority === 'high' ? 'Срочно' : task.priority === 'medium' ? 'Средний' : 'Низкий'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── CLIENTS ─────────────────────────────────────────────────
function Clients() {
  const clients = [
    { name: 'Игорь Воронов', phone: '+7 916 123-45-67', email: 'igor@mail.ru', orders: 2, ltv: 175000, last: '2026-06-22' },
    { name: 'Светлана Миронова', phone: '+7 926 234-56-78', email: 'sveta@gmail.com', orders: 5, ltv: 890000, last: '2026-06-21' },
    { name: 'Роман Белов', phone: '+7 903 345-67-89', email: 'roman@inbox.ru', orders: 1, ltv: 370000, last: '2026-06-20' },
    { name: 'Юлия Горбунова', phone: '+7 985 456-78-90', email: 'yulia@mail.ru', orders: 4, ltv: 420000, last: '2026-06-18' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-6">Клиентская база</h1>
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-dark-800">
            <tr>
              {['Клиент', 'Контакт', 'Заказов', 'LTV', 'Последний заказ', ''].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-dark-700">
            {clients.map((c) => (
              <tr key={c.name} className="hover:bg-gray-50 dark:hover:bg-dark-800 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">{c.name[0]}</div>
                    <span className="font-medium text-gray-900 dark:text-white">{c.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <p className="text-gray-600 dark:text-gray-300 text-xs">{c.phone}</p>
                  <p className="text-gray-400 text-xs">{c.email}</p>
                </td>
                <td className="px-4 py-3 text-gray-900 dark:text-white font-medium">{c.orders}</td>
                <td className="px-4 py-3 font-bold text-accent-500">{c.ltv.toLocaleString('ru')} ₽</td>
                <td className="px-4 py-3 text-xs text-gray-400">{new Date(c.last).toLocaleDateString('ru-RU')}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <a href={`tel:${c.phone}`} className="p-1.5 text-gray-400 hover:text-green-500 rounded-lg transition-colors"><PhoneCall className="w-4 h-4" /></a>
                    <a href={`mailto:${c.email}`} className="p-1.5 text-gray-400 hover:text-blue-500 rounded-lg transition-colors"><Mail className="w-4 h-4" /></a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── PRICE ALERTS ─────────────────────────────────────────────
function PriceAlerts() {
  const alerts = [
    { email: 'igor@mail.ru', tour: 'Дубай: город золота', price_subscribed: 92000, price_now: 89500, date: '2026-06-10' },
    { email: 'sveta@gmail.com', tour: 'Мальдивы: бунгало', price_subscribed: 195000, price_now: 185000, date: '2026-06-15' },
    { email: 'anna@mail.ru', tour: 'Греция: Санторини', price_subscribed: 98000, price_now: 96000, date: '2026-06-18' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-6">Алерты снижения цен</h1>
      <div className="space-y-4 max-w-2xl">
        {alerts.map((a, i) => {
          const drop = a.price_subscribed - a.price_now
          const pct = Math.round((drop / a.price_subscribed) * 100)
          return (
            <div key={i} className="card p-5 border-l-4 border-green-400">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{a.email}</p>
                  <p className="text-sm text-primary-500">{a.tour}</p>
                  <p className="text-xs text-gray-400 mt-1">Подписан: {new Date(a.date).toLocaleDateString('ru-RU')}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm line-through text-gray-400">{a.price_subscribed.toLocaleString('ru')} ₽</p>
                  <p className="text-lg font-black text-green-600">{a.price_now.toLocaleString('ru')} ₽</p>
                  <p className="text-xs text-green-600 font-medium">↓ {drop.toLocaleString('ru')} ₽ (-{pct}%)</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
