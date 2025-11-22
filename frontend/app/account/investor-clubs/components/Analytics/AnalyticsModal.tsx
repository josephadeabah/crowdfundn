import React from 'react';
import { TrendingUp, DollarSign, Users, Percent, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";
import Modal from '@/app/components/modal/Modal';
import { Button } from "@/app/components/ui/button";
import { PerformanceChart } from "./PerformanceChart";
import { TopAssets } from "./TopAssets";
import { PortfolioChart } from "./PortfolioChart";
import { MembersOverview } from "./MembersOverview";
import { StatsCard } from "./StatsCard";

interface AnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AnalyticsModal: React.FC<AnalyticsModalProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="huge"
      closeOnBackdropClick={true}
    >
      <div className="max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-card/95 backdrop-blur-sm border-b border-border/50 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl md:text-3xl bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent font-bold">
              Investment Club Analytics
            </h2>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-4 md:p-6 space-y-6">
          {/* Stats Grid */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            <StatsCard
              title="Total Portfolio Value"
              value="$224,500"
              change="+$18,200 (8.8%)"
              changeType="positive"
              icon={DollarSign}
            />
            <StatsCard
              title="Annual Return"
              value="16.4%"
              change="+2.3% vs last year"
              changeType="positive"
              icon={Percent}
            />
            <StatsCard
              title="Total Members"
              value="5"
              change="No change"
              changeType="neutral"
              icon={Users}
            />
            <StatsCard
              title="YTD Growth"
              value="$52,100"
              change="+30.2%"
              changeType="positive"
              icon={TrendingUp}
            />
          </motion.div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            <PortfolioChart />
            <PerformanceChart />
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            <TopAssets />
            <MembersOverview />
          </div>
        </div>
      </div>
    </Modal>
  );
};