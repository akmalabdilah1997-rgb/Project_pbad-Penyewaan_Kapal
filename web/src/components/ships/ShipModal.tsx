import type { FormEvent, ReactNode } from 'react'
import type { Ship } from '../../types/ship'

interface ShipModalProps {
  ship: Ship | null
  onClose: () => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

function Field({ label, name, type = 'text', required = false, defaultValue }: { label: string; name: string; type?: string; required?: boolean; defaultValue?: string | number }) {
  return <label className="field">{label}{required && <span> *</span>}<input name={name} type={type} defaultValue={defaultValue} required={required} /></label>
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  return <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><div className="modal"><div className="modal-header"><h2>{title}</h2><button onClick={onClose}>×</button></div>{children}</div></div>
}

export function ShipModal({ ship, onClose, onSubmit }: ShipModalProps) {
  return <Modal title={ship ? 'Edit data kapal' : 'Tambah kapal baru'} onClose={onClose}><form className="form-grid" onSubmit={onSubmit}><Field label="Nama kapal" name="nama_kapal" defaultValue={ship?.nama_kapal} required /><Field label="Merek" name="merek" defaultValue={ship?.merek} /><Field label="Jenis kapal" name="jenis" defaultValue={ship?.jenis} /><Field label="Harga sewa / hari" name="harga_sewa" type="number" defaultValue={ship?.harga_sewa} required />{ship && <><label className="field">Status kapal<select name="status_kapal" defaultValue={ship.status_kapal}><option>Tersedia</option><option>Tidak Tersedia</option><option>Perbaikan</option></select></label><Field label="Catatan" name="catatan" defaultValue={ship.catatan} /></>}<div className="form-actions"><button type="button" className="btn ghost" onClick={onClose}>Batal</button><button className="btn primary">{ship ? 'Simpan perubahan' : 'Simpan kapal'}</button></div></form></Modal>
}
