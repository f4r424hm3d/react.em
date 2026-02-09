import React, { useRef, useState, useEffect } from "react";
import api from "../../api";
import { toast } from "react-toastify";
import { validateRequired } from "../../utils/validation";

const DocumentUpload = () => {
  const uploadRef = useRef(null);
  const [documentName, setDocumentName] = useState("");
  const [file, setFile] = useState(null);
  const [documents, setDocuments] = useState([]);

  // ✅ Validation state
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // ✅ Validate field on blur
  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
    validateField(field);
  };

  // ✅ Field validation logic
  const validateField = (field) => {
    let error = "";

    if (field === "documentName") {
      error = validateRequired(documentName, "document name");
    } else if (field === "file") {
      if (!file) {
        error = "Please select a file to upload";
      }
    }

    setErrors((prev) => ({ ...prev, [field]: error }));
    return error;
  };

  // ✅ Validate form
  const validateForm = () => {
    const newErrors = {};

    newErrors.documentName = validateRequired(documentName, "document name");
    if (!file) {
      newErrors.file = "Please select a file to upload";
    }

    setErrors(newErrors);
    setTouched({ documentName: true, file: true });

    return !Object.values(newErrors).some((error) => error !== "");
  };

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
    // ✅ Validate form before submission
    if (!validateForm()) {
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
          // Let axios set the content-type automatically with boundary
        },
      });

      toast.success("Document uploaded successfully");
      setDocumentName("");
      setFile(null);
      setErrors({});
      setTouched({});
      fetchDocuments();
    } catch (error) {
      console.error(
        "Error uploading document:",
        error.response?.data || error.message,
      );
      const errorMessage =
        error.response?.data?.message || "Failed to upload document";

      if (error.response?.data?.errors) {
        // format validation errors
        const validationErrors = Object.values(error.response.data.errors)
          .flat()
          .join(", ")
          .replace(/2048 kilobytes/gi, "2 MB");
        toast.error(validationErrors || errorMessage);
      } else {
        toast.error(errorMessage);
      }
    }
  };

  return (
    <>
      <div ref={uploadRef} className="mb-10">
        <div className="w-full max-w-4xl mx-auto bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-200 p-4 md:p-8">
          <div className="mb-6 ">
            <h2 className="text-2xl font-semibold text-blue-700">
              📄 Upload Your Documents
            </h2>
            <p className="text-gray-500 mt-2 text-sm">
              Accepted formats:{" "}
              <span className="font-semibold text-gray-700">
                .PDF, .JPEG, .PNG
              </span>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Document Name */}
            <div className="space-y-1">
              <label className="block font-medium text-gray-700 mb-2">
                Document Name
              </label>
              <input
                type="text"
                value={documentName}
                onChange={(e) => {
                  setDocumentName(e.target.value);
                  if (errors.documentName) {
                    setErrors({ ...errors, documentName: "" });
                  }
                }}
                onBlur={() => handleBlur("documentName")}
                placeholder="Enter Document Name..."
                className={`w-full border rounded-xl p-3 focus:ring-2 outline-none transition ${
                  errors.documentName
                    ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                    : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                }`}
              />
              {errors.documentName && (
                <p className="text-red-600 text-xs ml-1 font-medium flex items-center gap-1">
                  <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                  {errors.documentName}
                </p>
              )}
            </div>

            {/* Upload Document */}
            <div className="space-y-1">
              <label className="block font-medium text-gray-700 mb-2">
                Upload Document
              </label>
              <label
                className={`flex flex-col items-center justify-center w-full h-[52px] border-2 border-dashed rounded-xl cursor-pointer transition ${
                  errors.file
                    ? "border-red-400 bg-red-50 hover:bg-red-100 text-red-700"
                    : "border-blue-400 bg-blue-50 hover:bg-blue-100 text-blue-700"
                }`}
              >
                <span className="flex items-center gap-2 text-sm font-medium">
                  <span className="text-lg">📂</span>
                  {file ? file.name : "Browse File"}
                </span>
                <input
                  type="file"
                  accept=".pdf,.jpeg,.jpg,.png"
                  onChange={(e) => {
                    setFile(e.target.files[0]);
                    if (errors.file) {
                      setErrors({ ...errors, file: "" });
                    }
                  }}
                  onBlur={() => handleBlur("file")}
                  className="hidden"
                />
              </label>
              {errors.file && (
                <p className="text-red-600 text-xs ml-1 font-medium flex items-center gap-1">
                  <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                  {errors.file}
                </p>
              )}
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
                  documents.map((doc, index) => {
                    // Safely construct URL
                    let path = doc.imgpath
                      ? doc.imgpath.startsWith("/")
                        ? doc.imgpath.slice(1)
                        : doc.imgpath
                      : "";

                    // User requested specific path format: https://www.educationmalaysia.in/storage/uploads/...
                    // Ignore doc.upload_source if it's not helpful, or use it if it's absolute.
                    // But primarily ensure 'storage' is present for these documents.

                    let source = "https://www.educationmalaysia.in/storage/";

                    // If the path already contains 'storage/', remove it from source or path to avoid duplicate
                    if (path.startsWith("storage/")) {
                      source = "https://www.educationmalaysia.in/";
                    } else if (
                      doc.upload_source &&
                      doc.upload_source.startsWith("http")
                    ) {
                      // If backend provides a full absolute URL source, trust it but check for storage if needed?
                      // User specifically asked to add storage, implying backend might be missing it in source.
                      // Let's stick to the user's explicit request format for the fallback.
                      let tempSource = doc.upload_source.endsWith("/")
                        ? doc.upload_source
                        : `${doc.upload_source}/`;
                      if (
                        !tempSource.includes("/storage/") &&
                        !path.startsWith("storage/")
                      ) {
                        // Attempt to inject storage if missing and domain matches?
                        // To be safe and follow instruction "ye path dalega usme please aise storage add kro":
                        // We will prioritize the constructed URL for this specific component.
                        if (
                          tempSource.includes("educationmalaysia.in") &&
                          !tempSource.includes("storage")
                        ) {
                          tempSource = tempSource + "storage/";
                        }
                      }
                      source = tempSource;
                    }

                    const fullUrl = path ? `${source}${path}` : "#";

                    return (
                      <tr
                        key={doc.id}
                        className="border-b hover:bg-gray-50 transition"
                      >
                        <td className="px-6 py-4 font-medium text-gray-700">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 text-gray-800">
                          {doc.document_name || doc.doc_name || "Document"}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              doc.doc_status === "Approved"
                                ? "bg-emerald-100 text-emerald-700"
                                : doc.doc_status === "Pending" ||
                                    doc.doc_status === "Reviewing"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-red-100 text-red-700"
                            }`}
                          >
                            {doc.doc_status || "Pending"}
                          </span>
                        </td>
                        <td className="px-6 py-4 flex gap-3">
                          {fullUrl !== "#" ? (
                            <>
                              <a
                                href={fullUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-medium shadow hover:bg-blue-700 transition"
                              >
                                View
                              </a>
                              <button
                                onClick={async (e) => {
                                  e.preventDefault();
                                  const toastId =
                                    toast.loading("Downloading...");
                                  try {
                                    // Use relative URL for download to leverage proxy if needed
                                    let downloadUrl = fullUrl;
                                    if (
                                      fullUrl.startsWith(
                                        "https://www.educationmalaysia.in/",
                                      )
                                    ) {
                                      downloadUrl = fullUrl.replace(
                                        "https://www.educationmalaysia.in",
                                        "",
                                      );
                                    }

                                    // fetching without custom headers to avoid CORS preflight issues
                                    const response = await fetch(downloadUrl);
                                    if (!response.ok)
                                      throw new Error(
                                        "Download failed with status: " +
                                          response.status,
                                      );

                                    const blob = await response.blob();
                                    const url =
                                      window.URL.createObjectURL(blob);
                                    const link = document.createElement("a");
                                    link.href = url;

                                    // Extract filename
                                    let filename =
                                      path.split("/").pop() ||
                                      doc.document_name ||
                                      "document";

                                    // Ensure extension matches blob type if missing
                                    if (!filename.includes(".")) {
                                      const type = blob.type;
                                      if (type === "application/pdf")
                                        filename += ".pdf";
                                      else if (type === "image/jpeg")
                                        filename += ".jpg";
                                      else if (type === "image/png")
                                        filename += ".png";
                                    }

                                    link.setAttribute("download", filename);
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
                                    window.URL.revokeObjectURL(url);
                                    toast.update(toastId, {
                                      render: "Downloaded successfully!",
                                      type: "success",
                                      isLoading: false,
                                      autoClose: 3000,
                                    });
                                  } catch (error) {
                                    console.error("Download error:", error);
                                    toast.update(toastId, {
                                      render:
                                        "Download failed. Please click 'View' to access the document.",
                                      type: "error",
                                      isLoading: false,
                                      autoClose: 4000,
                                    });
                                  }
                                }}
                                className="px-4 py-1.5 rounded-lg bg-gray-900 text-white text-xs font-medium shadow hover:bg-gray-800 transition"
                              >
                                Download
                              </button>
                            </>
                          ) : (
                            <span className="text-xs text-gray-500 italic">
                              No file
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
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
