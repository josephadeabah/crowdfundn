import React, { useState } from 'react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Plus, Trash2, Edit2, User } from 'lucide-react';
import { Input } from '@/app/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/app/components/ui/avatar';
import { useDropzone } from 'react-dropzone';
import { CampaignTeamMember } from '@/app/types/equityCampaigns.types';

interface PitchTeamProps {
  teamMembers: CampaignTeamMember[];
  setTeamMembers: (members: CampaignTeamMember[]) => void;
}

const PitchTeam = ({ teamMembers, setTeamMembers }: PitchTeamProps) => {
  const [newMember, setNewMember] = useState<
    Omit<CampaignTeamMember, 'id' | 'created_at'>
  >({
    user_id: 0, // Initialize with default value
    name: '',
    email: '',
    role: 'employee',
    title: '',
    description: '',
    equity_percentage: 0,
    avatar_url: undefined,
  });

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.png', '.jpg'],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        const url = URL.createObjectURL(file);
        setNewMember((prev) => ({ ...prev, avatar_url: url }));
      }
    },
  });

  const handleAddMember = () => {
    if (newMember.name && newMember.email && newMember.title) {
      if (editingIndex !== null) {
        // Update existing member
        const updatedMembers = [...teamMembers];
        updatedMembers[editingIndex] = {
          ...updatedMembers[editingIndex],
          ...newMember,
          id: teamMembers[editingIndex].id, // Preserve the ID
        };
        setTeamMembers(updatedMembers);
        setEditingIndex(null);
      } else {
        // Add new member (temporary ID for UI)
        setTeamMembers([
          ...teamMembers,
          {
            ...newMember,
            id: Date.now(),
            created_at: new Date().toISOString(),
          },
        ]);
      }
      resetForm();
    }
  };

  const handleEditMember = (index: number) => {
    setNewMember(teamMembers[index]);
    setEditingIndex(index);
    setIsAdding(true);
  };

  const handleRemoveMember = (index: number) => {
    const updatedMembers = [...teamMembers];
    updatedMembers.splice(index, 1);
    setTeamMembers(updatedMembers);
  };

  const resetForm = () => {
    setNewMember({
      user_id: 0,
      name: '',
      email: '',
      role: 'employee',
      title: '',
      description: '',
      equity_percentage: 0,
      avatar_url: undefined,
    });
    setIsAdding(false);
    setEditingIndex(null);
  };

  return (
    <Card className="border-none shadow-sm">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Team Members</h3>
          <Button
            variant="outline"
            onClick={() => setIsAdding(!isAdding)}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            {isAdding ? 'Cancel' : 'Add Member'}
          </Button>
        </div>

        {isAdding && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="font-medium mb-4">
              {editingIndex !== null
                ? 'Edit Team Member'
                : 'Add New Team Member'}
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Avatar Upload */}
              <div
                {...getRootProps()}
                className="col-span-2 flex items-center gap-4 cursor-pointer"
              >
                <input {...getInputProps()} />
                <Avatar className="h-16 w-16">
                  <AvatarImage src={newMember.avatar_url} />
                  <AvatarFallback className="bg-gray-200">
                    <User className="h-8 w-8 text-gray-500" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">Profile Photo</p>
                  <p className="text-xs text-gray-500">
                    Click to upload or drag and drop
                  </p>
                </div>
              </div>

              {/* Basic Info */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Full Name*
                </label>
                <Input
                  value={newMember.name}
                  onChange={(e) =>
                    setNewMember((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email*</label>
                <Input
                  type="email"
                  value={newMember.email}
                  onChange={(e) =>
                    setNewMember((prev) => ({ ...prev, email: e.target.value }))
                  }
                  placeholder="john@company.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Role*</label>
                <Select
                  value={newMember.role}
                  onValueChange={(value) =>
                    setNewMember((prev) => ({
                      ...prev,
                      role: value as 'founder' | 'advisor' | 'employee',
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="founder">Founder</SelectItem>
                    <SelectItem value="advisor">Advisor</SelectItem>
                    <SelectItem value="employee">Employee</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Title*</label>
                <Input
                  value={newMember.title}
                  onChange={(e) =>
                    setNewMember((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="CEO, CTO, etc."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Equity %
                </label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={newMember.equity_percentage}
                  onChange={(e) =>
                    setNewMember((prev) => ({
                      ...prev,
                      equity_percentage: Number(e.target.value),
                    }))
                  }
                  placeholder="0"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">
                  Bio/Description
                </label>
                <Input
                  value={newMember.description || ''}
                  onChange={(e) =>
                    setNewMember((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Brief description of their role and background..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button onClick={handleAddMember} variant="outline" className="bg-fundify-primary">
                {editingIndex !== null ? 'Update Member' : 'Add Member'}
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {teamMembers.length > 0 ? (
            teamMembers.map((member, index) => (
              <div
                key={member.id}
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={member.avatar_url} />
                    <AvatarFallback className="bg-gray-200">
                      {member.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div>
                        <h4 className="font-medium">{member.name}</h4>
                        <p className="text-sm text-gray-600 capitalize">
                          {member.role} • {member.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          User ID: {member.user_id}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditMember(index)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveMember(index)}
                          className="text-gray-500 hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    {member.equity_percentage > 0 && (
                      <div className="mt-1">
                        <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full">
                          {member.equity_percentage}% Equity
                        </span>
                      </div>
                    )}
                    {member.description && (
                      <p className="mt-2 text-sm text-gray-600">
                        {member.description}
                      </p>
                    )}
                    <p className="mt-2 text-sm text-gray-500">{member.email}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <User className="mx-auto h-8 w-8 text-gray-400" />
              <h4 className="mt-2 text-sm font-medium text-gray-900">
                No team members
              </h4>
              <p className="mt-1 text-sm text-gray-500">
                Add your team members to build investor confidence.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setIsAdding(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Team Member
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PitchTeam;
