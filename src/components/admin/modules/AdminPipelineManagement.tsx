import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Workflow, 
  Plus, 
  Search,
  DollarSign,
  Calendar,
  Building2,
  ArrowRight,
  MoreVertical,
  Phone,
  Mail,
  User,
  TrendingUp,
  Clock
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface Deal {
  id: string;
  company: string;
  contact: string;
  email: string;
  value: number;
  stage: string;
  probability: number;
  daysInStage: number;
  lastActivity: string;
}

const stages = [
  { id: 'lead', name: 'New Lead', color: 'bg-gray-500' },
  { id: 'qualified', name: 'Qualified', color: 'bg-blue-500' },
  { id: 'proposal', name: 'Proposal', color: 'bg-purple-500' },
  { id: 'negotiation', name: 'Negotiation', color: 'bg-orange-500' },
  { id: 'closed', name: 'Closed Won', color: 'bg-green-500' },
];

const initialDeals: Deal[] = [
  { id: '1', company: 'TechCorp India', contact: 'Rahul Sharma', email: 'rahul@techcorp.in', value: 150000, stage: 'lead', probability: 20, daysInStage: 2, lastActivity: '1 hour ago' },
  { id: '2', company: 'StartupXYZ', contact: 'Priya Patel', email: 'priya@startupxyz.com', value: 85000, stage: 'lead', probability: 15, daysInStage: 5, lastActivity: '3 hours ago' },
  { id: '3', company: 'GlobalFinance Ltd', contact: 'Amit Kumar', email: 'amit@globalfin.com', value: 320000, stage: 'qualified', probability: 40, daysInStage: 3, lastActivity: 'Yesterday' },
  { id: '4', company: 'HealthPlus', contact: 'Dr. Meera Reddy', email: 'meera@healthplus.in', value: 175000, stage: 'qualified', probability: 45, daysInStage: 7, lastActivity: '2 days ago' },
  { id: '5', company: 'RetailMax', contact: 'Vikram Singh', email: 'vikram@retailmax.in', value: 250000, stage: 'proposal', probability: 60, daysInStage: 4, lastActivity: '5 hours ago' },
  { id: '6', company: 'EduTech Solutions', contact: 'Sneha Gupta', email: 'sneha@edutech.in', value: 120000, stage: 'proposal', probability: 55, daysInStage: 8, lastActivity: 'Yesterday' },
  { id: '7', company: 'LogiTrans', contact: 'Ravi Verma', email: 'ravi@logitrans.com', value: 280000, stage: 'negotiation', probability: 75, daysInStage: 6, lastActivity: '4 hours ago' },
  { id: '8', company: 'ManuFacture Pro', contact: 'Suresh Iyer', email: 'suresh@mfpro.in', value: 420000, stage: 'negotiation', probability: 80, daysInStage: 10, lastActivity: 'Just now' },
  { id: '9', company: 'CloudWorks', contact: 'Ananya Das', email: 'ananya@cloudworks.in', value: 195000, stage: 'closed', probability: 100, daysInStage: 0, lastActivity: 'Today' },
  { id: '10', company: 'AgriSmart', contact: 'Kiran Rao', email: 'kiran@agrismart.in', value: 145000, stage: 'closed', probability: 100, daysInStage: 0, lastActivity: 'Yesterday' },
];

export const AdminPipelineManagement = () => {
  const [deals, setDeals] = useState<Deal[]>(initialDeals);
  const [searchTerm, setSearchTerm] = useState('');
  const [draggedDeal, setDraggedDeal] = useState<Deal | null>(null);

  const handleDragStart = (deal: Deal) => {
    setDraggedDeal(deal);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (stageId: string) => {
    if (draggedDeal) {
      setDeals(deals.map(d => 
        d.id === draggedDeal.id ? { ...d, stage: stageId, daysInStage: 0 } : d
      ));
      setDraggedDeal(null);
    }
  };

  const getStageDeals = (stageId: string) => {
    return deals.filter(d => 
      d.stage === stageId && 
      (d.company.toLowerCase().includes(searchTerm.toLowerCase()) || 
       d.contact.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  const getStageTotalValue = (stageId: string) => {
    return getStageDeals(stageId).reduce((acc, d) => acc + d.value, 0);
  };

  const getWeightedValue = (stageId: string) => {
    return getStageDeals(stageId).reduce((acc, d) => acc + (d.value * d.probability / 100), 0);
  };

  const totalPipelineValue = deals.reduce((acc, d) => acc + d.value, 0);
  const totalWeightedValue = deals.reduce((acc, d) => acc + (d.value * d.probability / 100), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-primary/10">
            <Workflow className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold text-foreground">Sales Pipeline</h1>
            <p className="text-muted-foreground">Drag deals between stages to update progress</p>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search deals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Deal
          </Button>
        </div>
      </div>

      {/* Pipeline Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <DollarSign className="w-4 h-4" />
              <span className="text-xs font-medium">Total Pipeline</span>
            </div>
            <p className="text-2xl font-bold text-foreground">₹{(totalPipelineValue / 100000).toFixed(1)}L</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs font-medium">Weighted Value</span>
            </div>
            <p className="text-2xl font-bold text-foreground">₹{(totalWeightedValue / 100000).toFixed(1)}L</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Building2 className="w-4 h-4" />
              <span className="text-xs font-medium">Active Deals</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{deals.filter(d => d.stage !== 'closed').length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Clock className="w-4 h-4" />
              <span className="text-xs font-medium">Avg. Cycle</span>
            </div>
            <p className="text-2xl font-bold text-foreground">23 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {stages.map((stage) => (
          <div
            key={stage.id}
            className="flex-shrink-0 w-[300px]"
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(stage.id)}
          >
            <Card className="h-full">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                    <CardTitle className="text-sm">{stage.name}</CardTitle>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {getStageDeals(stage.id).length}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>₹{(getStageTotalValue(stage.id) / 1000).toFixed(0)}K</span>
                  <span>•</span>
                  <span>₹{(getWeightedValue(stage.id) / 1000).toFixed(0)}K weighted</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 max-h-[500px] overflow-y-auto">
                {getStageDeals(stage.id).map((deal) => (
                  <Card
                    key={deal.id}
                    className="cursor-grab active:cursor-grabbing hover:border-primary/50 transition-colors"
                    draggable
                    onDragStart={() => handleDragStart(deal)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium text-sm">{deal.company}</p>
                          <p className="text-xs text-muted-foreground">{deal.contact}</p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <MoreVertical className="w-3 h-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Phone className="w-3 h-3 mr-2" /> Call
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Mail className="w-3 h-3 mr-2" /> Email
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <User className="w-3 h-3 mr-2" /> View Details
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-lg font-bold text-primary">
                          ₹{(deal.value / 1000).toFixed(0)}K
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {deal.probability}%
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{deal.daysInStage}d in stage</span>
                        <span>{deal.lastActivity}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {getStageDeals(stage.id).length === 0 && (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    No deals in this stage
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPipelineManagement;