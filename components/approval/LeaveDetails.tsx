interface LeaveDetailsProps {
  leaveRequest: {
    id: string;
    student: {
      fullName: string;
      rollNumber: string;
      course: string;
      hostelRoomNumber: string;
    };
    leaveType: string;
    destinationAddress: string;
    departureDate: string;
    returnDate: string;
    departureTime: string;
    status: string;
    parentStatus: string;
    wardenStatus: string;
    parentContactHint?: string | null;
    verification?: {
      otpSentAt?: string | null;
      otpVerifiedAt?: string | null;
      verifiedAt?: string | null;
      selfieCaptured?: boolean;
      signatureCaptured?: boolean;
    };
  };
}

export const LeaveDetails = ({ leaveRequest }: LeaveDetailsProps) => {
  const dateRange = `${new Date(leaveRequest.departureDate).toLocaleDateString()} to ${new Date(leaveRequest.returnDate).toLocaleDateString()}`;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Verification</p>
        <h2 className="mt-2 text-xl font-bold text-slate-900">Leave Details</h2>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {[
          ['Request ID', leaveRequest.id],
          ['Student', leaveRequest.student.fullName],
          ['Roll Number', leaveRequest.student.rollNumber],
          ['Course', leaveRequest.student.course],
          ['Room', leaveRequest.student.hostelRoomNumber],
          ['Leave Type', leaveRequest.leaveType],
          ['Destination', leaveRequest.destinationAddress],
          ['Dates', dateRange],
          ['Parent Status', leaveRequest.parentStatus],
          ['Warden Status', leaveRequest.wardenStatus],
          ['Parent Contact', leaveRequest.parentContactHint ?? 'Hidden'],
          ['OTP Sent', leaveRequest.verification?.otpSentAt ?? 'Pending'],
          ['OTP Verified', leaveRequest.verification?.otpVerifiedAt ?? 'Pending'],
          ['Parent Verified', leaveRequest.verification?.verifiedAt ?? 'Pending'],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</p>
            <p className="mt-2 text-sm font-medium text-slate-900">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
