import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../services/api';
import { ShieldCheck, ShieldAlert, Award, Calendar, User, Search } from 'lucide-react';

const CertificateVerify = () => {
  const { key } = useParams();
  const [searchKey, setSearchKey] = useState(key || '');
  const [cert, setCert] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (key) {
      handleVerify(key);
    }
  }, [key]);

  const handleVerify = async (verifyKey) => {
    setLoading(true);
    setError('');
    setCert(null);
    setSearched(true);
    try {
      const data = await api.get(`/certificates/verify/${verifyKey}`);
      setCert(data);
    } catch (err) {
      setError(err.message || 'Invalid certificate verification key');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (searchKey.trim()) {
      handleVerify(searchKey.trim());
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 p-6 md:p-12 max-w-4xl mx-auto w-full flex flex-col justify-center">
        
        {/* Verification Checker Box */}
        <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-2xl glass-panel space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-black text-slate-100 flex items-center justify-center gap-2">
              <ShieldCheck className="w-7 h-7 text-indigo-400" />
              <span>SkillBridge Credentials Verification</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1.5">
              Enter unique scan keys to check authenticity of issued digital certificates
            </p>
          </div>

          {/* Search bar */}
          <form onSubmit={onSubmit} className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="e.g. CERT-XXXXXXX-XXXXXXX"
              value={searchKey}
              onChange={e => setSearchKey(e.target.value)}
              className="w-full pl-10 pr-24 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none transition-all"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition-all"
            >
              Verify
            </button>
          </form>

          {/* Result view */}
          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <div className="p-6 rounded-xl bg-rose-600/10 border border-rose-500/20 text-center space-y-3">
              <ShieldAlert className="w-10 h-10 text-rose-500 mx-auto" />
              <div>
                <p className="text-sm font-bold text-rose-450">Verification Failed</p>
                <p className="text-xs text-slate-400 mt-1">{error}</p>
              </div>
            </div>
          ) : cert ? (
            <div className="p-8 rounded-xl bg-slate-950/40 border border-slate-850 space-y-6">
              
              {/* Status Banner */}
              <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-600/10 border border-emerald-500/20 text-emerald-400">
                <ShieldCheck className="w-6 h-6 flex-shrink-0" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider">Verifiable Credentials Secured</p>
                  <p className="text-sm font-black text-slate-100 mt-0.5">AUTHENTIC CERTIFICATE OF GRADUATION</p>
                </div>
              </div>

              {/* Certificate Metadata fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-400 py-2">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <User className="w-4 h-4 text-indigo-400 mt-0.5" />
                    <div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase">Graduated Student</p>
                      <p className="text-sm font-bold text-slate-200 mt-0.5">{cert.studentName}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Award className="w-4 h-4 text-indigo-400 mt-0.5" />
                    <div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase">Vocational Course</p>
                      <p className="text-sm font-bold text-slate-200 mt-0.5">{cert.courseName}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-4 h-4 text-indigo-400 mt-0.5" />
                    <div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase">Date of Issuance</p>
                      <p className="text-sm font-bold text-slate-200 mt-0.5">
                        {new Date(cert.issueDate).toLocaleDateString(undefined, { dateStyle: 'long' })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <User className="w-4 h-4 text-indigo-400 mt-0.5" />
                    <div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase">Evaluated & Signed By</p>
                      <p className="text-sm font-bold text-slate-200 mt-0.5">
                        {cert.instructorName} {cert.companyName ? `(${cert.companyName})` : ''}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Unique Sign Key footer */}
              <div className="pt-4 border-t border-slate-850 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
                <div>
                  <p className="font-bold">Credential Scan Key:</p>
                  <p className="font-mono text-slate-400 mt-0.5 select-all">{cert.certificateId}</p>
                </div>
                {cert.qrCodeUrl && (
                  <div className="p-1 bg-white rounded-lg">
                    <img src={cert.qrCodeUrl} alt="QR Verification" className="w-16 h-16" />
                  </div>
                )}
              </div>
            </div>
          ) : searched ? (
            <p className="text-center text-xs text-slate-500">Processing verification...</p>
          ) : null}
        </div>
      </main>
    </div>
  );
};

export default CertificateVerify;
