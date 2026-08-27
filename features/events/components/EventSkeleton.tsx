export function EventSkeleton(): JSX.Element {
  return (
    <div className="card" style={{ padding: 16 }}>
      {/* Thumbnail skeleton */}
      <div className="skeleton" style={{ height: 180, width: "100%", borderRadius: 8, marginBottom: 16 }} />
      {/* Category tag skeleton */}
      <div className="skeleton" style={{ height: 20, width: 80, borderRadius: 2, marginBottom: 12 }} />
      {/* Title skeleton */}
      <div className="skeleton" style={{ height: 24, width: "90%", borderRadius: 4, marginBottom: 8 }} />
      <div className="skeleton" style={{ height: 16, width: "70%", borderRadius: 4, marginBottom: 16 }} />
      {/* Metadata skeleton */}
      <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        <div className="skeleton" style={{ height: 14, width: 100, borderRadius: 4 }} />
        <div className="skeleton" style={{ height: 14, width: 120, borderRadius: 4 }} />
      </div>
      {/* Action skeleton */}
      <div className="skeleton" style={{ height: 36, width: "100%", borderRadius: 8 }} />
    </div>
  );
}

export function EventGridSkeleton({ count = 6 }: { count?: number }): JSX.Element {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
        gap: 24,
      }}
    >
      {Array.from({ length: count }).map((_, index) => (
        <EventSkeleton key={index} />
      ))}
    </div>
  );
}
