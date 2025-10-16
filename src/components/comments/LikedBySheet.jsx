import React from "react";

export default function LikedBySheet({ open, onClose, users = [] }) {
  if (!open) return null;

  return (
    // Wrapper so we can tag all sheet clicks
    <div data-liked-by-sheet className="fixed inset-0 z-[200]">
      {/* Backdrop — clicking this closes ONLY the like sheet */}
      <div
        data-liked-by-sheet
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Bottom Drawer */}
      <section
        data-liked-by-sheet
        className="absolute inset-x-0 bottom-0 z-[201] rounded-t-2xl border-t border-neutral-800 bg-neutral-900 pb-5"
        role="dialog"
        aria-modal="true"
      >
        {/* Grab handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="h-1 w-12 rounded-full bg-neutral-700" />
        </div>

        {/* Header */}
        <div className="px-4 py-4">
          <h3 className="text-neutral-100 text-base font-semibold">Liked by</h3>
          <p className="text-neutral-400 text-xs mt-0.5">
            {users?.length ?? 0} {users?.length === 1 ? "person" : "people"}
          </p>
        </div>

        {/* List */}
        <div className="max-h-[55vh] overflow-y-auto px-2 pb-4">
          {(!users || users.length === 0) ? (
            <div className="px-4 py-8 text-center text-neutral-400">
              No likes yet.
            </div>
          ) : (
            <ul className="divide-y divide-neutral-800">
              {users.map((u) => {
                const name = u?.firstName || u?.username || "stanceuser";
                const initials = name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase();

                return (
                  <li
                    key={u?.id ?? Math.random()}
                    className="flex items-center gap-3 px-3 py-3"
                  >
                    {/* Avatar */}
                    {u?.profilePicture ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={u.profilePicture}
                        alt={name}
                        className="h-9 w-9 rounded-full object-cover border border-neutral-700"
                      />
                    ) : (
                      <div className="h-9 w-9 rounded-full bg-neutral-800 text-neutral-200 flex items-center justify-center border border-neutral-700">
                        <span className="text-xs font-semibold">{initials}</span>
                      </div>
                    )}

                    {/* Text */}
                    <div className="flex-1 min-w-0 px-3">
                      <p className="text-sm text-left text-neutral-100 truncate">{name}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
