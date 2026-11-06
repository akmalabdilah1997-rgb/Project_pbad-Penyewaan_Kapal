import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Sidebar } from './components/layout/Sidebar'
import { ShipModal } from './components/ships/ShipModal'
import { ShipTable } from './components/ships/ShipTable'
import { StatCard } from './components/ships/StatCard'
import { kapalApi } from './services/api'
import type { Ship } from './types/ship'

function App() {
  const [ships, setShips] = useState<Ship[]>([])
  const [notice, setNotice] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingShip, setEditingShip] = useState<Ship | null>(null)

  const refresh = async () => {
    try {
      setShips(await kapalApi.list())
      setNotice('')
    } catch {
      setShips([])
      setNotice('Tidak dapat terhubung ke API SQLite. Pastikan server berjalan di http://localhost:3000.')
    }
  }

  useEffect(() => { void refresh() }, [])

  const stats = useMemo(() => ({
    total: ships.length,
    available: ships.filter((ship) => ship.status_kapal === 'Tersedia').length,
    unavailable: ships.filter((ship) => ship.status_kapal === 'Tidak Tersedia').length,
    maintenance: ships.filter((ship) => ship.status_kapal === 'Perbaikan').length,
  }), [ships])

  const closeModal = () => {
    setEditingShip(null)
    setModalOpen(false)
  }

  const saveShip = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const body = {
      nama_kapal: form.get('nama_kapal'),
      merek: form.get('merek'),
      jenis: form.get('jenis'),
      harga_sewa: Number(form.get('harga_sewa')),
      status_kapal: editingShip ? form.get('status_kapal') : 'Tersedia',
      catatan: editingShip ? form.get('catatan') : '-',
    }
    try {
      if (editingShip) {
        const updated = await kapalApi.update(editingShip.id_kapal, body)
        setShips((items) => items.map((ship) => ship.id_kapal === updated.id_kapal ? updated : ship))
      } else {
        const created = await kapalApi.create(body)
        setShips((items) => [created, ...items])
      }
    } catch {
      setNotice(`Kapal gagal ${editingShip ? 'diperbarui' : 'disimpan'} ke SQLite. Pastikan server API berjalan lalu coba lagi.`)
      return
    }
    closeModal()
  }

  const deleteShip = async (ship: Ship) => {
    if (!window.confirm(`Hapus kapal "${ship.nama_kapal}"? Data yang dihapus tidak dapat dikembalikan.`)) return
    try {
      await kapalApi.remove(ship.id_kapal)
      setShips((items) => items.filter((item) => item.id_kapal !== ship.id_kapal))
    } catch {
      setNotice('Kapal gagal dihapus dari SQLite. Pastikan server API berjalan lalu coba lagi.')
    }
  }

  return <div className="app-shell">
    <Sidebar />
    <main className="main-content">
      <header className="topbar">
        <div className="mobile-brand"><span className="brand-mark">◒</span> sailora</div>
        <div className="breadcrumb">Workspace <span>/</span> <strong>Armada Kapal</strong></div>
        <div className="top-actions">
          <button className="icon-btn" onClick={() => void refresh()} aria-label="Refresh">↻</button>
          <div className="avatar">WA</div>
          <div><b>Wisnu Abdillah</b><small>Administrator</small></div>
          <span className="chevron">⌄</span>
        </div>
      </header>
      {notice && <div className="notice"><span>●</span>{notice}<button onClick={() => setNotice('')}>×</button></div>}
      <div className="page">
        <div className="page-heading compact">
          <div><p className="eyebrow">MASTER DATA</p><h1>Armada kapal</h1><p className="subtitle">Kelola armada dan pantau status operasional kapal.</p></div>
          <button className="btn primary" onClick={() => { setEditingShip(null); setModalOpen(true) }}>＋ Tambah kapal</button>
        </div>
        <section className="stats-grid">
          <StatCard icon="◈" label="Total armada" value={stats.total} suffix=" kapal" tone="blue" />
          <StatCard icon="♧" label="Kapal tersedia" value={stats.available} suffix=" kapal" tone="green" />
          <StatCard icon="▣" label="Tidak tersedia" value={stats.unavailable} suffix=" kapal" tone="orange" />
          <StatCard icon="◷" label="Perbaikan" value={stats.maintenance} suffix=" kapal" tone="purple" />
        </section>
        <section className="panel recent-panel"><div className="panel-header"><div><h2>Daftar armada</h2><p>Data kapal yang terdaftar dalam sistem</p></div></div><ShipTable ships={ships} onEdit={(ship) => { setEditingShip(ship); setModalOpen(true) }} onDelete={deleteShip} /></section>
      </div>
    </main>
    {modalOpen && <ShipModal ship={editingShip} onClose={closeModal} onSubmit={saveShip} />}
  </div>
}

export default App
