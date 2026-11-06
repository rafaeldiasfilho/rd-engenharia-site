// Labelled form field used by the internal area forms.

export function AdminFormField({ label, children }) {
  return (
    <label className="admin-field">
      <span>{label}</span>
      {children}
    </label>
  );
}
