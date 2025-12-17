'use client';

import React, { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Star, Loader2 } from 'lucide-react';
import { useAuth } from '@/app/context/auth/AuthContext';

interface RateMentorProps {
  assignmentId: number;
  mentorName: string;
  campaignTitle: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const RateMentor: React.FC<RateMentorProps> = ({
  assignmentId,
  mentorName,
  campaignTitle,
  onSuccess,
  onCancel,
}) => {
  const { token } = useAuth();
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!token || rating === 0) return;

    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/mentor/assignments/${assignmentId}/rate_assignment`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            rating: rating,
            feedback: feedback,
          }),
        },
      );

      if (response.ok) {
        setSubmitted(true);
        setTimeout(() => {
          onSuccess();
        }, 2000);
      } else {
        const error = await response.json();
        console.error('Error submitting rating:', error);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-8">
        <Star className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Thank You!</h3>
        <p className="text-gray-600">Your feedback has been submitted.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Rate Your Mentor</h3>
        <p className="text-gray-600">
          How was your experience with {mentorName} for "{campaignTitle}"?
        </p>
      </div>

      <div className="space-y-4">
        <div className="text-center">
          <div className="flex justify-center space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="focus:outline-none"
              >
                <Star
                  className={`h-10 w-10 ${
                    star <= (hoverRating || rating)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {rating === 0
              ? 'Select a rating'
              : `${rating} star${rating > 1 ? 's' : ''}`}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Feedback (Optional)
          </label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Share your experience with this mentor..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            rows={4}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <Button variant="outline" onClick={onCancel}>
          Skip
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={rating === 0 || loading}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Submitting...
            </>
          ) : (
            'Submit Feedback'
          )}
        </Button>
      </div>
    </div>
  );
};

export default RateMentor;
