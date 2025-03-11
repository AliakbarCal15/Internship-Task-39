import React, { useState } from 'react';
import { Star, X } from 'lucide-react';
import clsx from 'clsx';

interface ReviewFormData {
  rating: number;
  comment: string;
  images: string[];
}

interface Review {
  id: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
  isVerified: boolean;
  images?: string[];
}

interface ReviewsProps {
  productId: string;
  reviews: Review[];
  onAddReview?: (review: ReviewFormData) => void;
}

export function Reviews({ productId, reviews, onAddReview }: ReviewsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<ReviewFormData>({
    rating: 5,
    comment: '',
    images: [],
  });
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);

  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
  const ratingCounts = reviews.reduce((acc, review) => {
    acc[review.rating] = (acc[review.rating] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onAddReview) {
      onAddReview(formData);
      setFormData({ rating: 5, comment: '', images: [] });
      setIsModalOpen(false);
    }
  };

  const renderStars = (rating: number, interactive = false) => {
    return Array.from({ length: 5 }, (_, index) => {
      const starValue = index + 1;
      const filled = interactive
        ? (hoveredStar || formData.rating) >= starValue
        : rating >= starValue;

      return (
        <Star
          key={index}
          className={clsx(
            'w-5 h-5 transition-colors',
            filled ? 'text-yellow-400 fill-current' : 'text-gray-300'
          )}
          onMouseEnter={() => interactive && setHoveredStar(starValue)}
          onMouseLeave={() => interactive && setHoveredStar(null)}
          onClick={() => interactive && setFormData({ ...formData, rating: starValue })}
        />
      );
    });
  };

  return (
    <div className="space-y-6">
      {/* Reviews Summary */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Customer Reviews</h3>
            <div className="flex items-center mt-2">
              <div className="flex">{renderStars(averageRating)}</div>
              <span className="ml-2 text-gray-600">
                {averageRating.toFixed(1)} out of 5
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Based on {reviews.length} reviews
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Write a Review
          </button>
        </div>

        {/* Rating Distribution */}
        <div className="mt-6 space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center">
              <span className="w-12 text-sm text-gray-600">{rating} star</span>
              <div className="flex-1 h-2 mx-4 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400 rounded-full"
                  style={{
                    width: `${((ratingCounts[rating] || 0) / reviews.length) * 100}%`,
                  }}
                />
              </div>
              <span className="w-12 text-sm text-gray-600">
                {((ratingCounts[rating] || 0) / reviews.length * 100).toFixed(0)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Review List */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center">
                  <span className="font-medium text-gray-900">{review.user}</span>
                  {review.isVerified && (
                    <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded">
                      Verified Purchase
                    </span>
                  )}
                </div>
                <div className="flex items-center mt-1">
                  <div className="flex">{renderStars(review.rating)}</div>
                  <span className="ml-2 text-sm text-gray-500">
                    {new Date(review.date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            <p className="mt-4 text-gray-700">{review.comment}</p>
            {review.images && review.images.length > 0 && (
              <div className="mt-4 flex gap-2">
                {review.images.map((image, index) => (
                  <div
                    key={index}
                    className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100"
                  >
                    <img
                      src={image}
                      alt={`Review ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Write a Review</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rating
                </label>
                <div className="flex gap-1">
                  {renderStars(formData.rating, true)}
                </div>
              </div>
              <div>
                <label
                  htmlFor="comment"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Review
                </label>
                <textarea
                  id="comment"
                  rows={4}
                  value={formData.comment}
                  onChange={(e) =>
                    setFormData({ ...formData, comment: e.target.value })
                  }
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Share your experience with this product..."
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}