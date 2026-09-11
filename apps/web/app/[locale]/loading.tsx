export default function Loading() {
  return (
    <div className="route-loading" role="status" aria-live="polite">
      <span className="route-loading__mark" aria-hidden="true" />
      <strong>نَسَق · NASAQ</strong>
      <span>تهيئة مساحة العمل · Preparing workspace</span>
    </div>
  );
}
