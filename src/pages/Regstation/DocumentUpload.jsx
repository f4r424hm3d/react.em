import React, { useRef, useState, useEffect } from 'react';
import api from '../../api';
import { toast } from "react-toastify";

const DocumentUpload = () => {
  const uploadRef = useRef(null);
  const [documentName, setDocumentName] = useState("");
  const [file, setFile] = useState(null);
  const [documents, setDocuments] = useState([]);

  const fetchDocuments = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/student/documents", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log("Fetched documents:", res.data);
      // Fix: set from correct response path
      if (res.data && res.data.data && res.data.data.student_documents) {
        setDocuments(res.data.data.student_documents);
      } else if (res.data && res.data.student_documents) {
        setDocuments(res.data.student_documents);
      } else {
        setDocuments([]);
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleSave = async () => {
    if (!documentName || !file) {
      toast.warn("Please provide document name and file");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("document_name", documentName);
      formData.append("doc", file);

      await api.post("/student/upload-documents", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Document uploaded successfully");
      setDocumentName("");
      setFile(null);
      fetchDocuments();
    } catch (error) {
      console.error("Error uploading document:", error);
      toast.error("Failed to upload document");
    }
  };

  return (
    <>
      <div ref={uploadRef} className="mb-10">
        <div className="w-full max-w-4xl mx-auto bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-200 p-8">
          <div className="mb-6 ">
            <h2 className="text-2xl font-semibold text-blue-700">📄 Upload Your Documents</h2>
            <p className="text-gray-500 mt-2 text-sm">
              Accepted formats: <span className="font-semibold text-gray-700">.PDF, .JPEG, .PNG</span>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block font-medium text-gray-700 mb-2">Document Name</label>
              <input
                type="text"
                value={documentName}
                onChange={(e) => setDocumentName(e.target.value)}
                placeholder="Enter Document Name..."
                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-2">Upload Document</label>
              <label className="flex flex-col items-center justify-center w-full h-[52px] border-2 border-dashed border-blue-400 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium rounded-xl cursor-pointer transition">
                <span className="flex items-center gap-2 text-sm">
                  <span className="text-lg">📂</span> Browse File
                </span>
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button
              onClick={handleSave}
              className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md transition"
            >
              Save
            </button>
            <button className="px-6 py-2 rounded-xl bg-gray-500 hover:bg-gray-700 text-white shadow-md transition">
              Cancel
            </button>
          </div>
        </div>

        <div className="w-full max-w-4xl mx-auto mt-10">
  <h3 className="text-2xl font-bold text-gray-900 mb-6">
      Uploaded Documents
  </h3>

  <div className="overflow-x-auto rounded-xl shadow-md border border-gray-200">
    <table className="w-full text-sm text-left">
      <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm uppercase tracking-wide">
        <tr>
          <th className="px-6 py-3">S.N.</th>
          <th className="px-6 py-3">Document Name</th>
          <th className="px-6 py-3">Status</th>
          <th className="px-6 py-3">Actions</th>
        </tr>
      </thead>
      <tbody>
        {documents && documents.length > 0 ? (
          documents.map((doc, index) => (
            <tr
              key={doc.id}
              className="border-b hover:bg-gray-50 transition"
            >
              <td className="px-6 py-4 font-medium text-gray-700">
                {index + 1}
              </td>
              <td className="px-6 py-4 text-gray-800">{doc.doc_name}</td>
              <td>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    doc.doc_status === "Approved"
                      ? "bg-emerald-100 text-emerald-700"
                      : doc.doc_status === "Pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {doc.doc_status}
                </span>
              </td>
              <td className="px-6 py-4 flex gap-3">
                <a
                  href={`${doc.upload_source}${doc.imgpath}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-medium shadow hover:bg-blue-700 transition"
                >
                  View
                </a>
                <a
                  href={`${doc.upload_source}${doc.imgpath}`}
                  download
                  className="px-4 py-1.5 rounded-lg bg-gray-900 text-white text-xs font-medium shadow hover:bg-gray-800 transition"
                >
                  Download
                      </a>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-4 py-2 border text-center" colSpan="4">
                    No documents uploaded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
            </div>
        </div>
      </div>
    </>
  );
};

export default DocumentUpload;
