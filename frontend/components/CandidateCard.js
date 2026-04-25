export default function CandidateCard({ candidate, onVote, hasVoted }) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition">
      {candidate.image && (
        <div className="h-48 bg-gray-200 flex items-center justify-center">
          <span className="text-6xl">👤</span>
        </div>
      )}
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{candidate.name}</h3>
        <p className="text-blue-600 font-semibold mb-3">{candidate.position}</p>
        <p className="text-gray-600 mb-4">{candidate.description}</p>
        
        {onVote && !hasVoted && (
          <button
            onClick={() => onVote(candidate.id)}
            className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            Vote for {candidate.name}
          </button>
        )}
        
        {hasVoted && (
          <div className="bg-gray-100 text-gray-600 py-2 rounded-lg text-center font-semibold">
            Already Voted
          </div>
        )}
      </div>
    </div>
  );
}
