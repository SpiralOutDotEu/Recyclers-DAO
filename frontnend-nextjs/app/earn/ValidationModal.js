import React, { useState } from 'react';
import Image from 'next/image';

const ValidationModal = ({ rowData, onClose }) => {
  const [comment, setComment] = useState('');

  // Handle approve action
  const handleApprove = () => {
    // Implement your logic for approve action here
    // You can use the comment state as well as rowData to send data to your backend
    // Don't forget to close the modal afterwards
    onClose();
  };

  // Handle reject action
  const handleReject = () => {
    // Implement your logic for reject action here
    // You can use the comment state as well as rowData to send data to your backend
    // Don't forget to close the modal afterwards
    onClose();
  };

  const displayImage = rowData.imagecid ? (
    <div className="text-center mt-4">
      <Image
        src={`https://gateway.lighthouse.storage/ipfs/${rowData.imagecid}`}
        alt="Image"
        width={250}
        height={250}
        className="max-w-full h-auto mx-auto"
      />
    </div>
  ) : null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="modal-bg absolute inset-0 bg-gray-900 opacity-50"></div>
      <div className="modal-content bg-white p-4 max-w-xl mx-auto overflow-y-auto shadow-lg rounded-lg z-50">
        <div className="text-center mb-4">
          <h2 className="text-lg font-semibold">Validation Details</h2>
        </div>
        <div className="overflow-x-auto max-h-96">
          <table className="table-auto w-full">
            <tbody>
              {Object.entries(rowData).map(([key, value]) => (
                <tr key={key}>
                  <td className="font-semibold pr-2">{key}:</td>
                  <td>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {displayImage}
        </div>
        <div className="mt-4">
          <label className="block font-semibold">Comment:</label>
          <textarea
            className="w-full h-24 px-3 py-2 border rounded-md"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          ></textarea>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 mr-2"
            onClick={handleApprove}
          >
            Approve
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            onClick={handleReject}
          >
            Reject
          </button>
          <button
            className="px-4 py-2 ml-2 text-gray-600 border rounded-md hover:bg-gray-100"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ValidationModal;
