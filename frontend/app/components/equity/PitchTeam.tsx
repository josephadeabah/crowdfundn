import React, { useState } from 'react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { Input } from '@/app/components/ui/input';

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  photo?: string;
}

interface PitchTeamProps {
  teamMembers: TeamMember[];
  setTeamMembers: (members: TeamMember[]) => void;
}

const PitchTeam = ({ teamMembers, setTeamMembers }: PitchTeamProps) => {
  const [newMember, setNewMember] = useState<TeamMember>({
    name: '',
    role: '',
    bio: '',
  });

  const handleAddMember = () => {
    if (newMember.name && newMember.role) {
      setTeamMembers([...teamMembers, newMember]);
      setNewMember({ name: '', role: '', bio: '' });
    }
  };

  const handleRemoveMember = (index: number) => {
    const updatedMembers = [...teamMembers];
    updatedMembers.splice(index, 1);
    setTeamMembers(updatedMembers);
  };

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="font-semibold mb-3">Team</h3>
        <div className="space-y-4">
          {teamMembers.map((member, index) => (
            <div key={index} className="border p-3 rounded-md">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{member.name}</h4>
                  <p className="text-sm text-gray-600">{member.role}</p>
                  {member.bio && <p className="mt-2 text-sm">{member.bio}</p>}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveMember(index)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </div>
          ))}

          <div className="space-y-3">
            <Input
              placeholder="Name"
              value={newMember.name}
              onChange={(e) =>
                setNewMember({ ...newMember, name: e.target.value })
              }
            />
            <Input
              placeholder="Role"
              value={newMember.role}
              onChange={(e) =>
                setNewMember({ ...newMember, role: e.target.value })
              }
            />
            <Input
              placeholder="Bio (optional)"
              value={newMember.bio}
              onChange={(e) =>
                setNewMember({ ...newMember, bio: e.target.value })
              }
            />
            <Button
              variant="outline"
              className="w-full"
              onClick={handleAddMember}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Team Member
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PitchTeam;
