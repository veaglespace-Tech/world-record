import { useState } from 'react';
import { useGetReferralLinkQuery } from '../store/api/apiSlice';
import { HiOutlineLink, HiOutlineClipboardCopy, HiOutlineCheck } from 'react-icons/hi';

export default function ReferralPage() {
  const { data: referralData, isLoading } = useGetReferralLinkQuery();
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'link') {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
      } else {
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 w-full">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="space-y-8 w-full">
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

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 w-full">
        {/* Referral Link Card */}
        <div className="card bg-base-100 border border-base-content/5 shadow-sm w-full">
          <div className="card-body">
            <h3 className="text-sm font-semibold text-base-content/50 uppercase tracking-wider mb-3">
              Shareable Link
            </h3>
            <div className="flex items-center gap-2 w-full">
              <div className="flex-1 bg-base-200 rounded-lg px-4 py-3 font-mono text-sm truncate border border-base-content/5">
                {referralData?.referralLink}
              </div>
              <button
                onClick={() => copyToClipboard(referralData?.referralLink, 'link')}
                className={`btn ${copiedLink ? 'btn-success' : 'btn-primary'}`}
                title="Copy to clipboard"
              >
                {copiedLink ? (
                  <><HiOutlineCheck className="w-5 h-5" /> Copied</>
                ) : (
                  <><HiOutlineClipboardCopy className="w-5 h-5" /> Copy Link</>
                )}
              </button>
            </div>

            <div className="divider my-6">OR</div>

            <h3 className="text-sm font-semibold text-base-content/50 uppercase tracking-wider mb-3 text-center">
              Direct Referral Code
            </h3>
            <div className="flex flex-col items-center gap-3">
              <div className="badge badge-lg font-mono text-2xl font-bold px-8 py-6 bg-base-200 border-base-content/10 text-primary">
                {referralData?.referralCode}
              </div>
              <button
                onClick={() => copyToClipboard(referralData?.referralCode, 'code')}
                className="btn btn-ghost btn-sm mt-2"
              >
                {copiedCode ? (
                  <><HiOutlineCheck className="w-4 h-4 text-success" /> <span className="text-success">Copied!</span></>
                ) : (
                  <><HiOutlineClipboardCopy className="w-4 h-4" /> Copy Code</>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="card bg-base-100 border border-base-content/5 shadow-sm w-full">
          <div className="card-body">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <span className="text-base-content/60">ℹ️</span> How it works
            </h3>
            <ul className="steps steps-vertical text-sm h-full">
              <li className="step step-primary">
                <div className="text-left ml-2">
                  <p className="font-semibold">Copy your link</p>
                  <p className="text-xs text-base-content/60 mt-1">Click the copy button to get your unique referral URL.</p>
                </div>
              </li>
              <li className="step step-primary">
                <div className="text-left ml-2">
                  <p className="font-semibold">Share widely</p>
                  <p className="text-xs text-base-content/60 mt-1">Send the link via WhatsApp, Email, or Social Media.</p>
                </div>
              </li>
              <li className="step step-primary">
                <div className="text-left ml-2">
                  <p className="font-semibold">Users Register</p>
                  <p className="text-xs text-base-content/60 mt-1">They fill the form which is auto-linked to your Pathak.</p>
                </div>
              </li>
              <li className="step step-primary">
                <div className="text-left ml-2">
                  <p className="font-semibold">Track Growth</p>
                  <p className="text-xs text-base-content/60 mt-1">View all your registered members in the Dashboard.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
