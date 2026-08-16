export default function PostSkeleton() {
  return (
    <div className="bg-chess-surface border border-chess-border rounded-lg p-5 animate-pulse shadow-sm">
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-8 h-8 rounded-md bg-chess-border" />
        <div className="h-3 w-24 bg-chess-border rounded" />
        <div className="h-3 w-16 bg-chess-border rounded ml-auto" />
      </div>
      <div className="h-4 w-3/4 bg-chess-border rounded mb-2" />
      <div className="h-4 w-1/2 bg-chess-border rounded mb-4" />
      <div className="flex gap-4">
        <div className="h-3 w-8 bg-chess-border rounded" />
        <div className="h-3 w-8 bg-chess-border rounded" />
        <div className="h-3 w-8 bg-chess-border rounded ml-auto" />
      </div>
    </div>
  );
}
