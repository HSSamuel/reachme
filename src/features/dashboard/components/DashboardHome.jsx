import { Card } from "../../../components/ui/Card";

export function DashboardHome() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-heading font-bold text-dark-900">
          Dashboard
        </h1>
        <p className="text-slate-500">Welcome back! Here is your overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">
            Total Views
          </div>
          <div className="text-3xl font-bold text-dark-900 mt-2">1,234</div>
        </Card>
        <Card>
          <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">
            Link Clicks
          </div>
          <div className="text-3xl font-bold text-dark-900 mt-2">856</div>
        </Card>
        <Card>
          <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">
            CTR
          </div>
          <div className="text-3xl font-bold text-brand-600 mt-2">42%</div>
        </Card>
      </div>
    </div>
  );
}
