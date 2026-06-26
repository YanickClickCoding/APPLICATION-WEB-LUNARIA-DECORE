export default function ProductCardSkeleton() {
  return (
    <div className="card lun-prodcard lun-skel-card" aria-hidden="true">
      <div className="lun-prodcard-media lun-skel" />
      <div className="lun-prodcard-body">
        <div className="lun-skel lun-skel-line" style={{ width: '40%', height: 11, marginBottom: 12 }} />
        <div className="lun-skel lun-skel-line" style={{ width: '85%', height: 16, marginBottom: 8 }} />
        <div className="lun-skel lun-skel-line" style={{ width: '60%', height: 16, marginBottom: 16 }} />
        <div className="lun-prodcard-foot">
          <div className="lun-skel lun-skel-line" style={{ width: 70, height: 18 }} />
          <div className="lun-skel" style={{ width: 36, height: 36, borderRadius: '50%' }} />
        </div>
      </div>
    </div>
  )
}
