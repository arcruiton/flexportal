export default function PageHeader({ crumb, title, children }) {
  return (
    <div className="topbar">
      <div>
        <div className="crumb">FlexPortal / {crumb}</div>
        <h1>{title}</h1>
      </div>
      <div className="topbar-right">{children}</div>
    </div>
  );
}
