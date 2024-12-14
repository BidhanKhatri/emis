import React from "react";

function ViewPermissionsPop({ permissionData }) {
  console.log(permissionData);
  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
        <div className="max-h-80 overflow-y-auto">
          {" "}
          {/* Fixed height for scrolling */}
          <table className="min-w-full bg-white">
            <thead>
              <tr className="w-full bg-blue-500 text-white uppercase text-sm leading-normal">
                <th className="text-left px-4 py-2 border border-gray-300">
                  Permission ID
                </th>
                <th className="text-left px-4 py-2 border border-gray-300">
                  Permission Name
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {permissionData.permissionId.map((id, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-200 bg-white even:bg-gray-100  transition duration-150"
                >
                  <td className="py-3 px-6 text-left font-medium border border-gray-300">
                    {id}
                  </td>
                  <td className="py-3 px-6 text-left font-medium border border-gray-300">
                    {permissionData.permissionName[index]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ViewPermissionsPop;
