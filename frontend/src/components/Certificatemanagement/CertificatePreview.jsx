import React from "react";

export default function CertificatePreview({ student, course, score, fields, signatories }) {
  return (
    <div className="w-full max-w-4xl border-4 border-gray-300 shadow-xl bg-white p-10 text-center">
      <h1 className="text-3xl font-bold">CERTIFICATE</h1>
      <p className="italic text-gray-600">OF COMPLETION</p>

      <p className="mt-6">THIS CERTIFICATE HAS BEEN AWARDED TO:</p>
      <h2 className="text-2xl font-semibold mt-2">{student?.name}</h2>

      <p className="mt-6">FOR COMPLETION OF THE FOLLOWING COURSE:</p>
      <h3 className="text-xl mt-2">{course?.title}</h3>

      <p className="mt-6">SCORE: {score}%</p>
      <p className="mt-2">Certificate ID: {fields?.certificateId}</p>

      {/* Signatories */}
      <div className="flex justify-evenly mt-12">
        {signatories.map((sig, i) => (
          <div key={i} className="flex flex-col items-center text-sm flex-1 mx-2">
            {sig.imageUrl && <img src={sig.imageUrl} alt="signature" className="h-12 mb-2" />}
            <span className="font-bold">{sig.name}</span>
            <span>{sig.role}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
