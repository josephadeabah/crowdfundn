'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { usePledgesContext } from '@/app/context/pledges/PledgesContext';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/app/components/ui/select';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/app/components/ui/tabs';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/app/components/ui/accordion';
import { 
  Package, 
  Truck, 
  Clock, 
  CheckCircle, 
  Search, 
  Filter, 
  Download 
} from 'lucide-react';
import ErrorPage from '../components/errorpage/ErrorPage';
import PledgeListPageLoader from '../loaders/PledgeListPageLoader ';
import { Badge } from '../components/ui/badge';

const PledgesListPage = () => {
  const { pledges, loading, error, fetchPledges, deletePledge } = usePledgesContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [shippingFilter, setShippingFilter] = useState("all");

  useEffect(() => {
    fetchPledges();
  }, [fetchPledges]);

  // Flatten pledges for easier processing
  const allPledges = pledges.flatMap(campaign => 
    campaign.pledges.map(pledge => ({
      ...pledge,
      campaign_name: campaign.campaign_name
    }))
  );

  // Calculate statistics
  const stats = {
    total: allPledges.length,
    pending: allPledges.filter(p => p.status === "pending").length,
    readyToShip: allPledges.filter(p => p.status === "success" && p.shipping_status === "not_shipped").length,
    shipped: allPledges.filter(p => p.shipping_status === "shipped").length,
    totalValue: allPledges.reduce((sum, pledge) => 
      sum + pledge.selected_rewards.reduce((rewardSum, reward) => rewardSum + reward.amount, 0), 0
    )
  };

  // Filter pledges
  const filteredPledges = allPledges.filter(pledge => {
    const matchesSearch = pledge.shipping_data?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pledge.shipping_data?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pledge.id.toString().toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || pledge.status === statusFilter;
    const matchesShipping = shippingFilter === "all" || pledge.shipping_status === shippingFilter;
    
    return matchesSearch && matchesStatus && matchesShipping;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge className="bg-tab-success text-white">Confirmed</Badge>;
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getShippingBadge = (status: string) => {
    switch (status) {
      case "shipped":
        return <Badge className="bg-tab-success text-white">Shipped</Badge>;
      case "not_shipped":
        return <Badge variant="outline">Not Shipped</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8 px-2">
        <PledgeListPageLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 px-2">
        <ErrorPage />
      </div>
    );
  }

  // Check if pledges are empty
  if (pledges.length === 0) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-tab-primary to-tab-secondary bg-clip-text text-gray-600">
              Pledge Management
            </h2>
            <p className="text-muted-foreground">Track and fulfill your supporter pledges</p>
            <p className="text-sm text-muted-foreground mt-1">
              All shipping or delivery is done by you. <span className="font-semibold">Bantu Hive disclaims any responsibility.</span>
            </p>
          </div>
        </div>
        <div className="text-center py-16">
          <p className="text-gray-600 dark:text-neutral-400 text-lg">
            You have not received any pledges yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-tab-primary to-tab-secondary bg-clip-text text-gray-600">
            Pledge Management
          </h2>
          <p className="text-muted-foreground">Track and fulfill your supporter pledges</p>
          <p className="text-sm text-muted-foreground mt-1">
            All shipping or delivery is done by you. <span className="font-semibold">Bantu Hive disclaims any responsibility.</span>
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button className="bg-gradient-to-r from-tab-primary to-tab-secondary">
            Process Pledges
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-tab-primary/10 to-tab-primary/5">
          <CardContent className="p-6 text-center">
            <Package className="h-8 w-8 mx-auto mb-2 text-tab-primary" />
            <p className="text-2xl font-bold">{stats.total}</p>
            <p className="text-sm text-muted-foreground">Total Pledges</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-tab-secondary/10 to-tab-secondary/5">
          <CardContent className="p-6 text-center">
            <Clock className="h-8 w-8 mx-auto mb-2 text-tab-secondary" />
            <p className="text-2xl font-bold">{stats.readyToShip}</p>
            <p className="text-sm text-muted-foreground">Ready to Ship</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-tab-success/10 to-tab-success/5">
          <CardContent className="p-6 text-center">
            <Truck className="h-8 w-8 mx-auto mb-2 text-tab-success" />
            <p className="text-2xl font-bold">{stats.shipped}</p>
            <p className="text-sm text-muted-foreground">Shipped</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-tab-accent/10 to-tab-accent/5">
          <CardContent className="p-6 text-center">
            <CheckCircle className="h-8 w-8 mx-auto mb-2 text-tab-accent" />
            <p className="text-2xl font-bold">₵{stats.totalValue.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Total Value</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by backer name or pledge ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Payment Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="success">Confirmed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={shippingFilter} onValueChange={setShippingFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Shipping Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Shipping</SelectItem>
                <SelectItem value="not_shipped">Not Shipped</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="detailed">Detailed View</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Pledge Queue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredPledges.map((pledge) => (
                  <div key={pledge.id} className="flex items-center justify-between p-4 border border-tab-border rounded-lg hover:bg-tab-hover transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium">{pledge.id}</h4>
                        {getStatusBadge(pledge.status)}
                        {getShippingBadge(pledge.shipping_status)}
                      </div>
                      <p className="text-sm font-medium">
                        {pledge.shipping_data?.firstName} {pledge.shipping_data?.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">{pledge.campaign_name}</p>
                    </div>
                    <div className="text-right mr-4">
                      <p className="font-medium text-lg">
                        ₵{pledge.selected_rewards.reduce((sum, reward) => sum + reward.amount, 0)}
                      </p>
                      <p className="text-xs text-muted-foreground">{pledge.delivery_option}</p>
                    </div>
                    <div className="flex gap-2">
                      {pledge.status === "success" && pledge.shipping_status === "not_shipped" && (
                        <Button size="sm" className="bg-tab-success text-white">
                          <Truck className="h-4 w-4 mr-1" />
                          Ship Now
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="detailed">
          <Accordion type="single" collapsible>
            {pledges.map((campaign) => (
              <AccordionItem key={campaign.campaign_id} value={campaign.campaign_id.toString()}>
                <AccordionTrigger className="text-lg font-semibold">
                  {campaign.campaign_name} ({campaign.pledges.length} pledges)
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-6">
                    {campaign.pledges.map((pledge) => (
                      <Card key={pledge.id} className="border-tab-border">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">
                              {pledge.id} - {pledge.shipping_data?.firstName} {pledge.shipping_data?.lastName}
                            </CardTitle>
                            <div className="flex gap-2">
                              {getStatusBadge(pledge.status)}
                              {getShippingBadge(pledge.shipping_status)}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Shipping Information */}
                            <div>
                              <h4 className="font-semibold mb-3">Shipping Information</h4>
                              <div className="space-y-2 text-sm">
                                <p>
                                  <span className="font-medium">Address:</span> {pledge.shipping_data?.shippingAddress}
                                </p>
                                <p>
                                  <span className="font-medium">Delivery Option:</span> {pledge.delivery_option}
                                </p>
                              </div>
                            </div>
                            
                            {/* Reward Details */}
                            <div>
                              <h4 className="font-semibold mb-3">Selected Rewards</h4>
                              <div className="space-y-3">
                                {pledge.selected_rewards.map((reward) => (
                                  <div key={reward.id} className="flex items-start gap-3 p-3 bg-tab-muted rounded-lg">
                                    <div className="relative w-16 h-16">
                                      <Image
                                        src={reward.image || '/avatar-default.png'}
                                        alt={reward.title || 'Reward image'}
                                        fill
                                        className="object-cover rounded-md"
                                        onError={(e) => {
                                          const target = e.target as HTMLImageElement;
                                          target.src = '/avatar-default.png';
                                        }}
                                      />
                                    </div>
                                    <div className="flex-1">
                                      <h5 className="font-medium">{reward.title}</h5>
                                      <p className="text-sm text-muted-foreground">{reward.description}</p>
                                      <p className="text-sm font-medium text-tab-primary">₵{reward.amount}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="flex gap-3 mt-6 pt-4 border-t">
                            {pledge.status === "success" && pledge.shipping_status === "not_shipped" && (
                              <Button className="bg-tab-success text-white">
                                <Truck className="h-4 w-4 mr-2" />
                                Mark as Shipped
                              </Button>
                            )}
                            <Button variant="outline">Edit Details</Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => deletePledge(pledge.id)}
                            >
                              Delete Pledge
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PledgesListPage;