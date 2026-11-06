export type ShipStatus = 'Tersedia' | 'Tidak Tersedia' | 'Perbaikan'

export interface Ship {
  id_kapal: number
  nama_kapal: string
  merek?: string
  jenis?: string
  harga_sewa: number
  status_kapal: ShipStatus
  catatan?: string
}
