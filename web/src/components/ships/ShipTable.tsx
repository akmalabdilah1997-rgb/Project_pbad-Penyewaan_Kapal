import type { Ship } from '../../types/ship'

const money = (value: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value)

interface ShipTableProps {
  ships: Ship[]
  onEdit: (ship: Ship) => void
  onDelete: (ship: Ship) => void
}

function Badge({ status }: { status: string }) {
  return <span className={`badge ${status.toLowerCase().replace(/ /g, '-')}`}>{status}</span>
}

export function ShipTable({ ships, onEdit, onDelete }: ShipTableProps) {
  return <div className="table-scroll"><table><thead><tr><th>Nama kapal</th><th>Jenis & merek</th><th>Harga sewa / hari</th><th>Status</th><th>Catatan</th><th>Aksi</th></tr></thead><tbody>{ships.map((ship) => <tr key={ship.id_kapal}><td><div className="entity"><div className="entity-icon">⚓</div><div><b>{ship.nama_kapal}</b><small>ID KPL-{String(ship.id_kapal).padStart(3, '0')}</small></div></div></td><td>{ship.jenis || '-'}<small className="muted-block">{ship.merek || '-'}</small></td><td><b>{money(ship.harga_sewa)}</b></td><td><Badge status={ship.status_kapal} /></td><td className="muted-text">{ship.catatan || '-'}</td><td><div className="row-actions"><button className="action-btn edit" onClick={() => onEdit(ship)}>Edit</button><button className="action-btn delete" onClick={() => onDelete(ship)}>Hapus</button></div></td></tr>)}</tbody></table></div>
}
