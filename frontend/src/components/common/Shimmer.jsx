export default function Shimmer({ type = 'card', count = 1 }) {
  const shimmerClass = "animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]";

  const renderShimmer = () => {
    switch (type) {
      case 'table':
        return (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    {[...Array(5)].map((_, i) => (
                      <th key={i} className="px-6 py-3">
                        <div className={`h-4 ${shimmerClass} rounded`}></div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...Array(count)].map((_, rowIndex) => (
                    <tr key={rowIndex} className="border-t">
                      {[...Array(5)].map((_, colIndex) => (
                        <td key={colIndex} className="px-6 py-4">
                          <div className={`h-4 ${shimmerClass} rounded`}></div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'card':
        return (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(count)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center mb-4">
                  <div className={`w-16 h-16 ${shimmerClass} rounded-full`}></div>
                  <div className="ml-4 flex-1">
                    <div className={`h-5 ${shimmerClass} rounded mb-2 w-3/4`}></div>
                    <div className={`h-4 ${shimmerClass} rounded w-1/2`}></div>
                  </div>
                </div>
                <div className={`h-4 ${shimmerClass} rounded mb-2`}></div>
                <div className={`h-4 ${shimmerClass} rounded mb-2 w-5/6`}></div>
                <div className={`h-4 ${shimmerClass} rounded mb-4 w-4/6`}></div>
                <div className="flex space-x-2">
                  <div className={`h-8 ${shimmerClass} rounded flex-1`}></div>
                  <div className={`h-8 ${shimmerClass} rounded flex-1`}></div>
                </div>
              </div>
            ))}
          </div>
        );

      case 'stats':
        return (
          <div className="grid md:grid-cols-3 gap-6">
            {[...Array(count)].map((_, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <div className={`h-5 ${shimmerClass} rounded mb-3 w-2/3`}></div>
                <div className={`h-10 ${shimmerClass} rounded w-1/2`}></div>
              </div>
            ))}
          </div>
        );

      case 'list':
        return (
          <div className="space-y-4">
            {[...Array(count)].map((_, index) => (
              <div key={index} className="border-b pb-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex-1">
                    <div className={`h-6 ${shimmerClass} rounded mb-2 w-1/2`}></div>
                    <div className={`h-4 ${shimmerClass} rounded w-1/3`}></div>
                  </div>
                  <div className="text-right">
                    <div className={`h-8 ${shimmerClass} rounded w-16 mb-1`}></div>
                    <div className={`h-3 ${shimmerClass} rounded w-12`}></div>
                  </div>
                </div>
                <div className={`w-full h-4 ${shimmerClass} rounded-full`}></div>
              </div>
            ))}
          </div>
        );

      default:
        return (
          <div className={`h-32 ${shimmerClass} rounded`}></div>
        );
    }
  };

  return <>{renderShimmer()}</>;
}
