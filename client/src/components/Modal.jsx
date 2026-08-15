export default function Modal({ title, onClose, children, width }) {
  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal" style={width ? { maxWidth: width } : undefined}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <h2>{title}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close" style={{ position: 'static' }}>&times;</button>
        </div>
        {children}
      </div>
    </div>
  );
}
