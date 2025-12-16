// app/components/mentor/EditMentorProfile.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { Badge } from '@/app/components/ui/badge';
import { Label } from '@/app/components/ui/label';
import { useAuth } from '@/app/context/auth/AuthContext';
import { X, Plus, Loader2 } from 'lucide-react';

interface MentorProfileProps {
  mentor: {
    id: number;
    professional_title: string;
    bio?: string;
    linkedin_profile?: string;
    hourly_rate?: number;
  };
  expertise: string[];
  onSuccess: () => void;
  onCancel: () => void;
}

const EditMentorProfile: React.FC<MentorProfileProps> = ({
  mentor,
  expertise: initialExpertise,
  onSuccess,
  onCancel
}) => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    professional_title: mentor.professional_title || '',
    bio: mentor.bio || '',
    linkedin_profile: mentor.linkedin_profile || '',
    hourly_rate: mentor.hourly_rate?.toString() || '',
  });
  
  const [expertise, setExpertise] = useState<string[]>(initialExpertise || []);
  const [newExpertise, setNewExpertise] = useState('');
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [toast, setToast] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    type: 'success' | 'error' | 'warning';
  }>({
    isOpen: false,
    title: '',
    description: '',
    type: 'success'
  });

  // Fetch available expertise tags
  useEffect(() => {
    fetchAvailableTags();
  }, []);

  const fetchAvailableTags = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/mentor/mentors?limit=1`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        if (data.filters?.expertise_tags) {
          setAvailableTags(data.filters.expertise_tags);
        }
      }
    } catch (error) {
      console.error('Error fetching tags:', error);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (title: string, description: string, type: 'success' | 'error' | 'warning' = 'success') => {
    setToast({
      isOpen: true,
      title,
      description,
      type
    });

    // Auto-hide toast after 5 seconds
    setTimeout(() => {
      setToast(prev => ({ ...prev, isOpen: false }));
    }, 5000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addExpertise = (tag: string) => {
    if (tag.trim() && !expertise.includes(tag.trim())) {
      setExpertise(prev => [...prev, tag.trim()]);
      setNewExpertise('');
    }
  };

  const removeExpertise = (tagToRemove: string) => {
    setExpertise(prev => prev.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      showToast('Error', 'You must be logged in to update your profile', 'error');
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/mentor/mentors/update_profile`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            mentor: {
              professional_title: formData.professional_title,
              bio: formData.bio,
              linkedin_profile: formData.linkedin_profile,
              hourly_rate: formData.hourly_rate ? parseFloat(formData.hourly_rate) : null,
            },
            expertise_tags: expertise,
          }),
        },
      );

      if (response.ok) {
        showToast('Success', 'Profile updated successfully');
        onSuccess();
      } else {
        const error = await response.json();
        showToast('Error', error.error || 'Failed to update profile', 'error');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      showToast('Error', 'Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Edit Mentor Profile</h2>
        <p className="text-gray-600">Update your mentor information and expertise</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Professional Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Professional Information</h3>
          
          <div className="space-y-2">
            <Label htmlFor="professional_title">Professional Title *</Label>
            <Input
              id="professional_title"
              name="professional_title"
              value={formData.professional_title}
              onChange={handleInputChange}
              placeholder="e.g., Senior Product Manager, Startup Advisor"
              required
            />
            <p className="text-sm text-gray-500">
              This is how entrepreneurs will see you in the marketplace
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              placeholder="Tell entrepreneurs about your background, experience, and mentorship style..."
              rows={4}
            />
            <p className="text-sm text-gray-500">
              Share your story and what makes you a great mentor
            </p>
          </div>
        </div>

        {/* Expertise Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Areas of Expertise</h3>
            <Badge variant="outline">{expertise.length} tags</Badge>
          </div>

          <div className="space-y-3">
            {/* Current Expertise Tags */}
            <div className="flex flex-wrap gap-2">
              {expertise.map((tag, index) => (
                <Badge key={index} className="px-3 py-1 flex items-center gap-1">
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeExpertise(tag)}
                    className="ml-1 hover:text-red-500"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {expertise.length === 0 && (
                <p className="text-sm text-gray-500 italic">No expertise tags added yet</p>
              )}
            </div>

            {/* Add New Expertise */}
            <div className="flex gap-2">
              <Input
                value={newExpertise}
                onChange={(e) => setNewExpertise(e.target.value)}
                placeholder="Add expertise (e.g., Marketing, Product Strategy)"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addExpertise(newExpertise);
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => addExpertise(newExpertise)}
                disabled={!newExpertise.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Available Tags */}
            {availableTags.length > 0 && !loading && (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Popular tags:</p>
                <div className="flex flex-wrap gap-2">
                  {availableTags
                    .filter(tag => !expertise.includes(tag))
                    .slice(0, 10)
                    .map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="cursor-pointer hover:bg-gray-200"
                        onClick={() => addExpertise(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                </div>
              </div>
            )}

            {loading && (
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Loading expertise tags...</span>
              </div>
            )}
          </div>
        </div>

        {/* Contact & Rates */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Contact & Rates</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="linkedin_profile">LinkedIn Profile</Label>
              <Input
                id="linkedin_profile"
                name="linkedin_profile"
                value={formData.linkedin_profile}
                onChange={handleInputChange}
                placeholder="https://linkedin.com/in/yourprofile"
                type="url"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hourly_rate">Hourly Rate ($)</Label>
              <Input
                id="hourly_rate"
                name="hourly_rate"
                value={formData.hourly_rate}
                onChange={handleInputChange}
                placeholder="e.g., 150"
                type="number"
                min="0"
                step="10"
              />
              <p className="text-sm text-gray-500">
                Optional - for paid mentoring sessions
              </p>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={saving}
            className="bg-emerald-600 text-white hover:bg-emerald-700"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </div>
      </form>

      {/* Toast Notification */}
      {toast.isOpen && (
        <div className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
          toast.type === 'success' ? 'bg-green-100 border border-green-200 text-green-800' :
          toast.type === 'error' ? 'bg-red-100 border border-red-200 text-red-800' :
          'bg-yellow-100 border border-yellow-200 text-yellow-800'
        }`}>
          <div className="flex items-start">
            <div className="flex-1">
              <h4 className="font-semibold">{toast.title}</h4>
              <p className="text-sm mt-1">{toast.description}</p>
            </div>
            <button
              onClick={() => setToast(prev => ({ ...prev, isOpen: false }))}
              className="ml-4 text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditMentorProfile;