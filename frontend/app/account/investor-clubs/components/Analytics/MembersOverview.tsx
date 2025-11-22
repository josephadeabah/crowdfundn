import { Card } from "@/app/components/ui/card";
import { Avatar, AvatarFallback } from "@/app/components/ui/avatar";
import { motion } from "framer-motion";

const members = [
  { name: "Sarah Johnson", contribution: "$52,300", percentage: "23.3%", initials: "SJ" },
  { name: "Michael Chen", contribution: "$48,900", percentage: "21.8%", initials: "MC" },
  { name: "Emily Rodriguez", contribution: "$45,100", percentage: "20.1%", initials: "ER" },
  { name: "David Kim", contribution: "$42,700", percentage: "19.0%", initials: "DK" },
  { name: "Lisa Anderson", contribution: "$35,500", percentage: "15.8%", initials: "LA" },
];

export const MembersOverview = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="p-4 md:p-6 border border-border/50">
        <h3 className="text-base md:text-lg font-semibold mb-4">Member Contributions</h3>
        <div className="space-y-4">
          {members.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="flex items-center gap-4"
            >
              <Avatar>
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {member.initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium">{member.name}</p>
                <p className="text-sm text-muted-foreground">{member.percentage} of total</p>
              </div>
              <p className="font-semibold">{member.contribution}</p>
            </motion.div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
};