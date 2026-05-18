export default function Success() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex flex-col items-center justify-center p-4">
      <div className="max-w-md mx-auto text-center">
        <div className="text-6xl mb-6">🎉</div>
        <h1 className="text-4xl font-bold text-white mb-4">
          Payment Successful!
        </h1>
        <p className="text-gray-300 mb-8">
          Thank you for your purchase. Check your email for the access link to your bundle.
        </p>
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <p className="text-gray-400 text-sm mb-2">What&apos;s next?</p>
          <ul className="text-left text-gray-300 space-y-3">
            <li className="flex items-start">
              <span className="mr-2">📧</span>
              <span>Check your inbox for the confirmation email</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">🔗</span>
              <span>Click the access link in the email</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">📦</span>
              <span>Download your bundle from Google Drive</span>
            </li>
          </ul>
        </div>
        <p className="text-gray-500 text-sm">
          Didn&apos;t receive the email? Check your spam folder or contact support.
        </p>
      </div>
    </div>
  );
}
