import React, { useState } from 'react';
import { X, Lock, Globe, Users, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { Switch } from '@/app/components/ui/switch';
import { Label } from '@/app/components/ui/label';
import { useAuth } from '@/app/context/auth/AuthContext';
import AlertPopup from '../alertpopup/AlertPopup';

interface CreateConversationModalProps {
  isOpen: boolean;
  onClose: () => void;
  dealRoomId: string;
  onConversationCreated: (conversation: any) => void;
}

export function CreateConversationModal({
  isOpen,
  onClose,
  dealRoomId,
  onConversationCreated,
}: CreateConversationModalProps) {
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    isPrivate: false,
    allowInvites: true,
  });

  // Alert states for CreateConversationModal
  const [showAlert, setShowAlert] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'error' | 'info'>(
    'info',
  );

  const showAlertMessage = (
    title: string,
    message: string,
    type: 'success' | 'error' | 'info' = 'info',
  ) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      showAlertMessage('Error', 'Please enter a conversation title', 'error');
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/deal_rooms/${dealRoomId}/create_conversation`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: formData.title,
            description: formData.description,
            private: formData.isPrivate,
          }),
        },
      );

      if (response.ok) {
        const data = await response.json();
        showAlertMessage(
          'Success',
          'Conversation created successfully',
          'success',
        );
        onConversationCreated(data.conversation);
        onClose();
        resetForm();
      } else {
        const error = await response.json();
        showAlertMessage(
          'Error',
          error.errors?.[0] || 'Failed to create conversation',
          'error',
        );
      }
    } catch (error) {
      console.error('Failed to create conversation:', error);
      showAlertMessage('Error', 'Failed to create conversation', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      isPrivate: false,
      allowInvites: true,
    });
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg w-full max-w-md">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                New Conversation
              </h3>
              <p className="text-sm text-gray-600">
                Start a new discussion in this deal room
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Conversation Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="e.g., Due Diligence Questions"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="What is this conversation about?"
                rows={3}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Private Conversation
                  </Label>
                  <p className="text-sm text-gray-600">
                    Only invited members can see and join
                  </p>
                </div>
                <Switch
                  checked={formData.isPrivate}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isPrivate: checked })
                  }
                />
              </div>

              {!formData.isPrivate && (
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Allow Member Invites
                    </Label>
                    <p className="text-sm text-gray-600">
                      Members can invite others to join
                    </p>
                  </div>
                  <Switch
                    checked={formData.allowInvites}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, allowInvites: checked })
                    }
                  />
                </div>
              )}

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  {formData.isPrivate ? (
                    <>
                      <Lock className="w-4 h-4 text-gray-500" />
                      <span>This will be a private conversation</span>
                    </>
                  ) : (
                    <>
                      <Globe className="w-4 h-4 text-gray-500" />
                      <span>This will be a public conversation</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : (
                  'Create Conversation'
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Alert Popup for CreateConversationModal */}
      <AlertPopup
        title={alertTitle}
        message={alertMessage}
        isOpen={showAlert}
        setIsOpen={setShowAlert}
        onConfirm={() => setShowAlert(false)}
        confirmText="OK"
        showCancelButton={false}
        confirmButtonClass={
          alertType === 'success'
            ? 'bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500'
            : alertType === 'error'
              ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
              : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
        }
        icon={
          alertType === 'success' ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
          ) : alertType === 'error' ? (
            <AlertCircle className="w-6 h-6 text-red-600" />
          ) : (
            <AlertCircle className="w-6 h-6 text-blue-600" />
          )
        }
      />
    </>
  );
}
