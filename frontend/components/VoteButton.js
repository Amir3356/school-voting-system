export default function VoteButton({ onClick, disabled, loading }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`w-full py-3 rounded-lg font-semibold transition ${
        disabled
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
          : 'bg-green-600 text-white hover:bg-green-700'
      }`}
    >
      {loading ? 'Submitting...' : disabled ? 'Already Voted' : 'Vote Now'}
    </button>
  );
}
