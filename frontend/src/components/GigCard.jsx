import { Link } from 'react-router-dom';
import { FiUser, FiClock, FiArrowRight } from 'react-icons/fi';

const GigCard = ({ gig }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Link to={`/gig/${gig._id}`} className="block group">
      <div className="card-clickable h-full flex flex-col">
        <div className="flex-between mb-4">
          <span className={`badge ${gig.status === 'open' ? 'badge-open' : 'badge-assigned'}`}>
            {gig.status}
          </span>
          <span className="text-muted">{formatDate(gig.createdAt)}</span>
        </div>

        <h3 className="card-title line-clamp-2 mb-3 group-hover:text-primary-600 transition-colors">
          {gig.title}
        </h3>
        
        <p className="text-body text-sm mb-5 line-clamp-2 flex-grow">{gig.description}</p>
        
        <div className="pt-4 border-t border-gray-100">
          <div className="flex-between">
            <div className="text-price text-xl">₹{gig.budget?.toLocaleString()}</div>
            
            <div className="flex-gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex-center">
                <FiUser className="text-gray-500 text-sm" />
              </div>
              <span className="text-sm text-gray-600 font-medium">{gig.ownerId?.name || 'Unknown'}</span>
            </div>
          </div>
        </div>

        <div className="mt-4 flex-center gap-2 text-primary-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
          <span>View Details</span>
          <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
};

export default GigCard;
