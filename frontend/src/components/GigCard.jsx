import { Link } from 'react-router-dom';
import { FiDollarSign, FiUser, FiClock } from 'react-icons/fi';

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
      <div className="card hover:border-primary-500 border-2 border-transparent cursor-pointer">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">{gig.title}</h3>
          <span
            className={`px-2 py-1 text-xs rounded-full ${
              gig.status === 'open'
                ? 'bg-green-100 text-green-700'
                : 'bg-yellow-100 text-yellow-700'
            }`}
          >
            {gig.status}
          </span>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{gig.description}</p>
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <FiDollarSign className="text-green-600" />
            <span className="font-semibold text-green-600">${gig.budget}</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <FiUser />
            <span>{gig.ownerId?.name || 'Unknown'}</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <FiClock />
            <span>{formatDate(gig.createdAt)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default GigCard;
