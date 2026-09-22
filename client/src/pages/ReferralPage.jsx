import { useState } from 'react';
import { useGetReferralLinkQuery } from '../store/api/apiSlice';
import { HiOutlineLink, HiOutlineClipboardCopy, HiOutlineCheck } from 'react-icons/hi';

export default function ReferralPage() {
  const { data: referralData, isLoading } = useGetReferralLinkQuery();
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-3xl">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <HiOutlineLink className="w-5 h-5 text-primary" />
          </div>
          My Referral Link
        </h2>
        <p className="text-base-content/60 mt-2 ml-13">
          Share this link with users so they can register directly.
        </p>
      </div>

      {/* Referral Link Card */}
      <div className="card bg-base-100 border border-base-content/5 shadow-sm">
        <div className="card-body">
          <h3 className="text-sm font-semibold text-base-content/50 uppercase tracking-wider mb-3">
            Your Referral Link
          </h3>
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-base-200 rounded-xl px-5 py-4 font-mono text-sm break-all border border-base-content/5">
              {referralData?.referralLink}
            </div>
            <button
              onClick={() => copyToClipboard(referralData?.referralLink)}
              className={`btn ${copied ? 'btn-success' : 'btn-primary'} btn-square`}
              title="Copy to clipboard"
            >
              {copied ? (
                <HiOutlineCheck className="w-5 h-5" />
              ) : (
                <HiOutlineClipboardCopy className="w-5 h-5" />
              )}
            </button>
          </div>

          <div className="divider"></div>

          <h3 className="text-sm font-semibold text-base-content/50 uppercase tracking-wider mb-3">
            Referral Code
          </h3>
          <div className="flex items-center gap-3">
            <div className="badge badge-primary badge-lg font-mono text-lg px-6 py-4">
              {referralData?.referralCode}
            </div>
            <button
              onClick={() => copyToClipboard(referralData?.referralCode)}
              className="btn btn-ghost btn-sm"
            >
              <HiOutlineClipboardCopy className="w-4 h-4" />
              Copy Code
            </button>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="card bg-base-100 border border-base-content/5 shadow-sm">
        <div className="card-body">
          <h3 className="font-semibold mb-3">How it works</h3>
          <ul className="steps steps-vertical text-sm">
            <li className="step step-primary">Copy your referral link above</li>
            <li className="step step-primary">Share it with users via WhatsApp, Email, etc.</li>
            <li className="step step-primary">Users open the link and fill the registration form</li>
            <li className="step step-primary">Registered users appear in "All Users" tab</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
