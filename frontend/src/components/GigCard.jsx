import { Link } from 'react-router-dom';
import { FiUser, FiClock } from 'react-icons/fi';

const GigCard = ({ gig }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <Link to={`/gig/${gig._id}`}>
      <div className="card-clickable">
        <div className="flex-between mb-3">
          <h3 className="card-title line-clamp-2">{gig.title}</h3>
          <span className={`badge ${gig.status === 'open' ? 'badge-open' : 'badge-assigned'}`}>
            {gig.status}
          </span>
        </div>
        
        <p className="text-body text-sm mb-4 line-clamp-3">{gig.description}</p>
        
        <div className="flex-between text-muted">
          <div className="flex-gap-1">
            <span className="text-price">₹{gig.budget}</span>
          </div>
          
          <div className="flex-gap-1">
            <FiUser />
            <span>{gig.ownerId?.name || 'Unknown'}</span>
          </div>
          
          <div className="flex-gap-1">
            <FiClock />
            <span>{formatDate(gig.createdAt)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default GigCard;
