'use client';

export default function CandidateCard({ candidate, onVote, hasVoted }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      {candidate.image && (
        <img
          src={candidate.image}
          alt={candidate.user?.name}
          className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
        />
      )}
      <h3 className="text-xl font-bold text-center mb-2">
        {candidate.user?.name}
      </h3>
      <p className="text-blue-600 text-center font-semibold mb-2">
        {candidate.position}
      </p>
      {candidate.description && (
        <p className="text-gray-600 text-center mb-4">{candidate.description}</p>
      )}
      <div className="text-center">
        <p className="text-2xl font-bold text-green-600 mb-4">
          {candidate.vote_count} votes
        </p>
        {!hasVoted && (
          <button
            onClick={() => onVote(candidate.id)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            Vote
          </button>
        )}
        {hasVoted && (
          <span className="text-gray-500">Voted</span>
        )}
      </div>
    </div>
  );
}
