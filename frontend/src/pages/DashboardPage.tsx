export default function DashboardPage() {
  return (
    <div>
      <h2 className="text-3xl font-semibold mb-4">Dashboard</h2>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl bg-white p-6 shadow-sm">Revenue</div>
        <div className="rounded-3xl bg-white p-6 shadow-sm">Profit</div>
        <div className="rounded-3xl bg-white p-6 shadow-sm">Orders</div>
        <div className="rounded-3xl bg-white p-6 shadow-sm">Low Stock</div>
      </div>
    </div>
  );
}
