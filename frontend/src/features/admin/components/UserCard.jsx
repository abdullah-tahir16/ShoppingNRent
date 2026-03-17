import { StatusBadge } from "../../../shared/components/ui/StatusBadge";

export function UserCard({ user, onToggleApproval, onCopyId, busy }) {
  return (
    <article className="rounded-3xl border border-stone-200 bg-stone-50 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-stone-950">{user.name}</h3>
          <p className="mt-1 text-sm text-stone-500">@{user.username}</p>
        </div>
        <StatusBadge tone={user.approved ? "success" : "warning"}>
          {user.approved ? "Approved" : "Pending"}
        </StatusBadge>
      </div>
      <dl className="mt-4 grid gap-3 text-sm text-stone-600">
        <div className="flex justify-between gap-4">
          <dt>Email</dt>
          <dd className="font-medium text-stone-900">{user.email}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt>City</dt>
          <dd className="font-medium text-stone-900">{user.city}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt>Role</dt>
          <dd className="font-medium text-stone-900">{user.role}</dd>
        </div>
      </dl>
      <div className="mt-5 flex flex-wrap gap-3">
        <button className="primary-button flex-1" type="button" disabled={busy} onClick={() => onToggleApproval(user)}>
          {user.approved ? "Mark Pending" : "Approve User"}
        </button>
        <button className="secondary-button" type="button" onClick={() => onCopyId(user._id)}>
          Use ID
        </button>
      </div>
    </article>
  );
}
